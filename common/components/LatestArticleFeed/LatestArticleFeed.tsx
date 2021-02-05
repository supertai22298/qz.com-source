import React from 'react';
import styles from './LatestArticleFeed.scss';
import useLatestArticles from 'data/hooks/useLatestArticles';
import useLatestFeedContent from 'data/hooks/useLatestFeedContent';
import FeatureArticleCard from 'components/FeatureArticleCard/FeatureArticleCard';

function LatestArticleCards ( props: { posts: Array<any> } ) {
	return (
		<>
			{props.posts.map( article => {
				if ( !article.featuredImage || !article.link || !article.title ) {
					return null;
				}

				const {
					edition,
					editions,
					id,
					featuredImage,
					title,
					video,
				} = article;

				if ( !featuredImage.sourceUrl ) {
					return null;
				}

				// tweaks for emails;
				let editionName = '';
				if ( edition?.name ) {
					editionName = !!article.emailId ? `📬 ${edition?.name}` : edition?.name;
				}
				if ( editions ) {
					editionName = editions.nodes?.[0]?.name;
				}
				const link = !!article.emailId ? article.link.replace( '/email/', '/emails/' ) : article.link;

				return (
					<li key={id} className={styles.item}>
						<FeatureArticleCard
							details={editionName}
							link={link}
							showPlayIcon={!!video}
							thumbnailAltText={featuredImage.altText ?? ''}
							thumbnailSrc={featuredImage.sourceUrl}
							title={title}
						/>
					</li>
				);
			} )
			}
		</>
	);
}

function LatestEditionFeed ( { edition }: { edition: string } ) {
	const { posts } = useLatestArticles( { edition } );

	if ( ! posts ) {
		return null;
	}

	return <LatestArticleCards posts={posts} />;
}

function LatestFeed() {
	const { posts } = useLatestFeedContent();

	if ( !posts ) {
		return null;
	}

	return <LatestArticleCards posts={posts} />;
}

export default function LatestArticleFeed ( { edition }: { edition?: string } ) {
	const { posts } = useLatestArticles( { edition } );

	if ( ! posts ) {
		return null;
	}

	return (
		<ul className={styles.container}>
			{
				edition ? <LatestEditionFeed edition={edition} /> : <LatestFeed />
			}
		</ul>
	);
}
