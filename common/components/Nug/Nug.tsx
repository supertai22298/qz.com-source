import React from 'react';
import ArticlePaywall from 'components/ArticlePaywall/ArticlePaywall';
import classnames from 'classnames/bind';
import { ButtonLabel, Hed, Kicker, Tagline } from '@quartz/interface';
import ContentBlocks from 'components/ContentBlocks/ContentBlocks';
import Dateline from 'components/Dateline/Dateline';
import EmailSignup from 'components/EmailSignup/EmailSignup';
import Link from 'components/Link/Link';
import NugMembershipPromo from './components/NugMembershipPromo/NugMembershipPromo';
import { PAYWALL_HARD } from 'config/membership';
import styles from './Nug.scss';
import { CollectionPartsFragment } from '@quartz/content';

const cx = classnames.bind( styles );

export const Nug = ( props: {
	appCta?: JSX.Element | string,
	blocks: NonNullable<CollectionPartsFragment[ 'blocks' ]>,
	emailListId?: number,
	emailTitle?: JSX.Element | string,
	id: string,
	lastModified?: string,
	link?: string,
	membershipPromo?: string,
	postId?: number,
	showPaywall?: boolean,
	title: string,
} ) => {
	const {
		appCta,
		blocks,
		emailListId,
		emailTitle,
		id,
		lastModified,
		link,
		membershipPromo,
		postId,
		showPaywall = false,
		title,
	} = props;
	// HTML id attribute values must begin with A-z
	const htmlId = `n${id}`;

	return (
		<>
			<div id={htmlId} className={cx( 'container', { showPaywall } )}>
				<Kicker>
					<a href={`#${htmlId}`}>
						<h3 className={styles.heading}>{title}</h3>
					</a>
				</Kicker>
				{
					lastModified &&
						<Tagline>
							Last updated <Dateline dateGmt={lastModified} />
						</Tagline>
				}
				<ContentBlocks blocks={showPaywall ? blocks?.slice( 0, 4 ) : blocks} />
				{
					link &&
						<p><Link to={link}>{`Read more about ${title} →`}</Link></p>
				}
				{
					appCta &&
						<Link to="/app/" className={styles.appButton}>
							<Hed size="medium">
								<div className={styles.appHead}>
									<span role="img" aria-label="mobile phone">📲</span>
									Download the Quartz iOS app to get a daily haiku pick-me-up.
								</div>
							</Hed>
							<ButtonLabel variant="secondary">Download our app</ButtonLabel>
						</Link>
				}
				{
					membershipPromo &&
					<NugMembershipPromo promoText={membershipPromo} />
				}
				{
					emailListId &&
					<EmailSignup listIds={[ emailListId ]} title={emailTitle} />
				}
			</div>
			{
				showPaywall &&
				postId &&
					<ArticlePaywall
						id={`coronavirus-living-briefing-${title}`}
						paywallType={PAYWALL_HARD}
					/>
			}
		</>
	);
};

export default Nug;
