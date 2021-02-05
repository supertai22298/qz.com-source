import React from 'react';
import styles from './TabBar.scss';
import useUserRole from 'helpers/hooks/useUserRole';
import { useLocation } from 'react-router-dom';
import { withTracking } from 'helpers/wrappers';
import { trackTabClick } from 'helpers/tracking/actions';
import Link from 'components/Link/Link';
import DiscoverIcon from 'svgs/discover.svg';
import EmailIcon from 'svgs/email-at-symbol.svg';
import LatestIcon from 'svgs/clock.svg';
import MembershipIcon from 'svgs/membership-badge-icon.svg';
import ObsessionsIcon from 'svgs/obsessions.svg';

const TrackedLink = withTracking( { onClick: trackTabClick } )( Link );

function TabBar () {
	const { isMember } = useUserRole();
	const { pathname } = useLocation();
	const isCurrentLink = pattern => !! pathname.replace( /^\/(africa|india|japan|work)/, '' ).match( pattern );

	return (
		<nav className={styles.container} id="tab-bar">
			<ul className={styles.tabs}>
				<li className={styles.tab}>
					<TrackedLink
						className={styles.link}
						current={isCurrentLink( /^\/discover\// )}
						to="/discover/"
					>
						<DiscoverIcon aria-hidden={true} className={styles.icon} />
						<span>Discover</span>
					</TrackedLink>
				</li>
				<li className={styles.tab}>
					<TrackedLink
						className={styles.link}
						current={isCurrentLink( /^\/latest\// )}
						to="/latest/"
					>
						<LatestIcon aria-hidden={true} className={styles.icon} />
						<span>Latest</span>
					</TrackedLink>
				</li>
				<li className={styles.tab}>
					<TrackedLink
						className={styles.link}
						current={isCurrentLink( /^\/(obsessions|on)\// )}
						to="/obsessions/"
					>
						<ObsessionsIcon aria-hidden={true} className={styles.icon} />
						<span>Obsessions</span>
					</TrackedLink>
				</li>
				<li className={styles.tab}>
					<TrackedLink
						className={styles.link}
						current={isCurrentLink( /^\/emails\// )}
						to="/emails/"
					>
						<EmailIcon aria-hidden={true} className={styles.icon} />
						<span>Emails</span>
					</TrackedLink>
				</li>
				<li className={styles.tab}>
					{
						isMember &&
						<TrackedLink
							className={styles.link}
							current={isCurrentLink( /^\/guides?\// )}
							to="/guides/"
						>
							<MembershipIcon aria-hidden={true} className={styles.icon} />
							<span>Field guides</span>
						</TrackedLink>
					}
					{
						! isMember &&
						<TrackedLink
							className={styles.link}
							current={isCurrentLink( /^\/subscribe\// )}
							to="/subscribe/"
						>
							<MembershipIcon aria-hidden={true} className={styles.icon} />
							<span>Subscribe</span>
						</TrackedLink>
					}
				</li>
			</ul>
		</nav>
	);
}

export default TabBar;
