import React, { Fragment } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './Home.scss';
import useHomeCollection from 'data/hooks/useHomeCollection';
import { ButtonLabel } from '@quartz/interface';
import { ContentBlock } from 'components/ContentBlocks/ContentBlocks';
import { HomeFeedInline } from 'components/Ad/Ad';
import Figure from 'components/Figure/Figure';
import HomepagePromo from 'components/HomepagePromo/HomepagePromo';
import LatestArticleFeed from 'components/LatestArticleFeed/LatestArticleFeed';
import LatestGuidePromo from 'components/LatestGuidePromo/LatestGuidePromo';
import { MarqueeUnit } from 'components/Ad/Marquee/Marquee';
import Page, { PageLoading } from 'components/Page/Page';
import UserGreeting from 'components/UserGreeting/UserGreeting';
import { uppercaseFirstLetter } from 'helpers/text';
import Link from 'components/Link/Link';
import { CollectionPartsFragment } from '@quartz/content';

const NUGS_PER_AD = 2;

function HomeFeedBlocks( props: {
	blocks: CollectionPartsFragment[ 'blocks' ],
} ) {
	if ( ! props.blocks?.length ) {
		return null;
	}

	let nugIndex = 0;
	let adCounter = 0;

	return (
		<Fragment>
			{
				props.blocks.map( ( block, index ) => {
					if ( ! block?.type ) {
						return null;
					}

					// Logic to determine whether we should show an ad after this
					// block. Namely, is the block a nug and have we already
					// shown [NUGS_PER_AD] nugs without an ad?
					let showAd = false;
					const isNug = block.type === 'QZ_POST_TOUT' && block.connections?.[ 0 ]?.__typename === 'Nug';

					if ( isNug ) {
						nugIndex++;

						if ( 0 === nugIndex % NUGS_PER_AD ) {
							adCounter++;
							showAd = true;
						}
					}

					return (
						<Fragment key={index}>
							<ContentBlock
								attributes={block.attributes}
								connections={block.connections}
								id={block.id}
								innerHtml={block.innerHtml}
								tagName={block.tagName}
								type={block.type}
							/>
							{
								showAd &&
								<HomeFeedInline
									id={`ad-${adCounter}`}
									path="home"
									targeting={{
										region: 'global',
										tile: adCounter,
									}}
								/>
							}
						</Fragment>
					);
				} )
			}
		</Fragment>
	);
}

export default function Home () {
	const collection = useHomeCollection();
	const { pathname } = useLocation();
	const { edition, postId } = useParams();

	if ( ! collection ) {
		return <PageLoading />;
	}

	const {
		altText,
		caption,
		credit,
		mediaDetails,
		sourceUrl,
	} = collection.featuredImage ?? {};

	// Vary behavior based on edition.
	let canonicalPath = '/';
	let feedLink = '/';
	let latestLink = '/latest/';
	let pageTitle = 'Quartz';

	// Specifically exclude UK to force a redirect to global home.
	if ( [ 'africa', 'india' ].includes( edition ) ) {
		canonicalPath = `/${edition}/`;
		feedLink = `/edition/${edition}`;
		latestLink = `/${edition}${latestLink}`;
		pageTitle = `${pageTitle} ${uppercaseFirstLetter( edition )}`;
	}

	// If this is a preview, accept the current path as canonical.
	if ( postId ) {
		canonicalPath = pathname;
	}

	return (
		<Page
			canonicalPath={canonicalPath}
			feedLink={feedLink}
			pageTitle={pageTitle}
			pageType="home"
		>
			<div className={styles.container}>
				<div className={styles.columns}>
					<h1 className={styles.pageHeading}>{pageTitle}</h1>
					<MarqueeUnit path="home" targeting={{ region: 'global' }} />
					<aside className={styles.leftRailContainer}>
						<h2 className={styles.railHeading}>This week’s guide</h2>
						<div className={styles.guidePromoContainer}>
							<LatestGuidePromo />
						</div>
						<Link to="/guides/">
							<ButtonLabel variant="secondary">More guides</ButtonLabel>
						</Link>
					</aside>
					<div className={styles.centerWellContainer}>
						<HomepagePromo />
						<UserGreeting />
						{
							sourceUrl &&
							<div className={styles.featuredImageContainer}>
								<Figure
									alt={altText ?? ''}
									aspectRatio={( mediaDetails?.width ?? 1 ) / ( mediaDetails?.height ?? 1 )}
									caption={caption}
									credit={credit}
									src={sourceUrl}
								/>
							</div>
						}
						<HomeFeedBlocks blocks={collection.blocks || []} />
					</div>
					<aside className={styles.rightRailContainer}>
						<h2 className={styles.railHeading}>{`Latest ${pageTitle} stories`}</h2>
						<LatestArticleFeed edition={edition} />
						<Link to={latestLink}>
							<ButtonLabel variant="secondary">More news</ButtonLabel>
						</Link>
					</aside>
				</div>
			</div>
		</Page>
	);
}
