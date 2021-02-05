import React from 'react';
import SignupHints from 'components/SignupHints/SignupHints';
import SubscribeCTAs from 'components/SubscribeCTAs/SubscribeCTAs';
import styles from './ArticlePaywallMembership.scss';
import { trackPaywallView } from 'helpers/tracking/actions';
import NewPerks from 'components/NewPerks/NewPerks';
import { useTrackingOnMount } from 'helpers/hooks/useTracking';
import { CalloutCard } from '@quartz/interface';

export default function ArticlePaywallMembership ( props: {
	trackingContext: string,
} ) {
	useTrackingOnMount( trackPaywallView, { context: props.trackingContext } );

	return (
		<>
			<div className={styles.ctaContainer}>
				<SubscribeCTAs trackingContext={props.trackingContext} />
			</div>
			<div className={styles.perksContainer}>
				<CalloutCard>
					<p className={styles.perksHeading}>Membership includes:</p>
					<NewPerks />
				</CalloutCard>
			</div>
			<div className={styles.hints}>
				<SignupHints
					align="center"
					showLogin={false}
					showQuartzJapanLink={true}
				/>
			</div>
		</>
	);
}
