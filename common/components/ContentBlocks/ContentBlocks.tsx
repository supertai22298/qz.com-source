import React, { Fragment } from 'react';
import StyledElement from 'components/StyledElement/StyledElement';
import ArticleRecircArticle from 'components/ArticleRecircArticle/ArticleRecircArticle';
import EmbedDatawrapper from 'components/Embeds/types/EmbedDatawrapper/EmbedDatawrapper';
import Figure from 'components/Figure/Figure';
import { keyBy } from 'helpers/utils';
import { getArticleProps } from 'helpers/data/article';
import styles from './ContentBlocks.scss';
import { Blockquote, EmojiList } from '@quartz/interface';
import Nug from 'components/Nug/Nug';
import { stripInlineStyling } from 'helpers/text';
import { getTitle } from 'components/SignupModule/SignupModule';
import { CollectionPartsFragment } from '@quartz/content';

export const ContentBlock = ( props: ElementType<CollectionPartsFragment[ 'blocks' ]> ) => {
	const {
		attributes,
		connections,
		innerHtml,
		tagName,
		type,
	} = props ?? {};
	// Map attribute objects to a dictionary
	const attributeDictionary = keyBy( attributes, o => o.name, o => o.value );

	switch ( type ) {
		case 'BLOCKQUOTE':
		case 'CORE_QUOTE':
			if ( ! innerHtml ) {
				return null;
			}

			return (
				<Blockquote>
					<div dangerouslySetInnerHTML={{ __html: stripInlineStyling( innerHtml ) }} />
				</Blockquote>
			);

		case 'QZ_POST_TOUT':
			const { appCta, emailListId, memberPromoText } = attributeDictionary;

			if ( !connections?.[ 0 ] ) {
				return null;
			}

			return (
				<PostTout
					appCta={appCta}
					connection={connections[ 0 ]}
					emailListId={emailListId}
					membershipPromo={memberPromoText}
				/>
			);

		case 'CORE_IMAGE': {
			const connection = connections?.[ 0 ];
			// Guard against images that weren't able to be resolved.
			if ( connection?.__typename !== 'MediaItem' ) {
				return null;
			}

			const {
				altText,
				caption,
				credit,
				mediaDetails,
				sourceUrl,
			} = connection;
			const { width, height } = mediaDetails ?? {};

			if ( ! sourceUrl || ! width || ! height ) {
				return null;
			}

			return (
				<div className={styles.figureContainer}>
					<Figure
						alt={altText || ''}
						aspectRatio={width / height}
						caption={caption}
						credit={credit}
						lazyLoad={true}
						src={sourceUrl}
					/>
				</div>
			);
		}

		case 'CORE_HEADING':
		case 'CORE_LIST':
		case 'CORE_PARAGRAPH':
		case 'CORE_SEPARATOR':
		case 'P':
		case 'H2':
		case 'H3':
		case 'H4':
		case 'H5':
		case 'H6':
		case 'OL':
		case 'UL':
		case 'PRE':
		case 'FIGURE':
			return (
				<StyledElement
					attributes={attributes}
					innerHtml={innerHtml}
					tagName={tagName || 'p'}
				/>
			);

		case 'EMBED_DATAWRAPPER':
		case 'SHORTCODE_QZ_DATAWRAPPER': {
			const { height, title, url } = attributeDictionary;

			return (
				<EmbedDatawrapper
					height={parseInt( height, 10 )}
					title={title}
					url={url}
				/>
			);
		}

		case 'EL': {
			const { emojiBullets } = attributeDictionary;

			return (
				<EmojiList
					bullets={emojiBullets.split( ',' )}
					innerHtml={innerHtml}
					tagName={tagName ?? 'ul'}
				/>
			);
		}

		case 'SHORTCODE_CAPTION': {
			const {
				alt,
				aspectRatio,
				caption,
				credit,
				url,
			} = attributeDictionary;

			if ( ! url ) {
				return null;
			}

			return (
				<div className={styles.figureContainer}>
					<Figure
						alt={alt}
						aspectRatio={parseFloat( aspectRatio )}
						caption={caption}
						credit={credit}
						src={url}
					/>
				</div>
			);
		}

		default:
			return null;
	}
};

export const getNugEmail = ( emailListId, allEmailLists ) => {
	/**
	 * Use the email list ID from the DB to find the correct email list in our config
	 * and pass along the subscription/display info we need (listId and name).
	 */
	const emailInfo = allEmailLists.nodes?.find( node => node?.emailListId === parseInt( emailListId, 10 ) ) ?? {};
	const { listId, name } = emailInfo;

	/**
	 * We should only pass along an email if there is an email/name associated with the nug and
	 * an editor has chosen to show the signup box (which gives us the emailListId attribute)
	*/
	if ( !! emailListId && listId && name ) {
		return {
			listId,
			emailTitle: getTitle( listId, name ),
		};
	}

	return {};
};

export function PostTout ( props: {
	appCta: string,
	connection,
	emailListId?: number,
	membershipPromo?: string,
} ) {
	const {
		appCta,
		connection,
		emailListId,
		membershipPromo,
	} = props;
	// If there is no id defined on the connection, that means we weren't prepared
	// for this type to be returned. (In GraphQL terms, we did not define fields
	// for this type in the union, e.g., "... on Nug".)
	//
	// This can be a problem when editors attempt to connect an object of the same
	// type, e.g., a nug-to-nug connection. Our current queries don't support this
	// because—again using nugs as an example—connecting nugs to nugs in NugParts
	// would cause infinite recursion as NugParts get spread in over and over
	// again, down the query tree.
	if ( ! connection.id ) {
		return null;
	}

	switch ( connection.__typename ) {
		case 'Nug':
			const { listId, emailTitle } = getNugEmail( emailListId, connection.emailLists );

			return (
				<Nug
					appCta={appCta}
					blocks={connection.blocks}
					emailListId={listId}
					emailTitle={emailTitle}
					id={connection.nugId}
					membershipPromo={membershipPromo}
					title={connection.title}
				/>
			);
		case 'Post':
			const article = getArticleProps( connection );

			return (
				<div className={styles.articleCardContainer}>
					<ArticleRecircArticle article={article} />
				</div>
			);
		default:
			return null;
	}
}

export const ContentBlocks = ( props: {
	blocks: CollectionPartsFragment[ 'blocks' ],
} ) => {
	if ( ! props.blocks?.length ) {
		return null;
	}

	return (
		<Fragment>
			{
				props.blocks.map( ( block, index ) => {
					if ( ! block?.type ) {
						return null;
					}

					return (
						<ContentBlock
							key={index}
							attributes={block.attributes}
							connections={block.connections}
							id={block.id}
							innerHtml={block.innerHtml}
							tagName={block.tagName}
							type={block.type}
						/>
					);
				} )
			}
		</Fragment>
	);
};

export default ContentBlocks;
