import React from 'react';
import classnames from 'classnames/bind';
import styles from './SocialLinks.scss';
import links from 'config/links';
import TwitterIcon from 'svgs/twitter.svg';
import InstagramIcon from 'svgs/instagram.svg';
import FacebookIcon from 'svgs/facebook.svg';
import LinkedInIcon from 'svgs/linkedin.svg';
import YouTubeIcon from 'svgs/youtube.svg';
import MessengerIcon from 'svgs/messenger.svg';

const cx = classnames.bind( styles );

const socialSourceNames = {
	facebook: 'Facebook',
	facebookGroup: 'Facebook Group',
	instagram: 'Instagram',
	messenger: 'Messenger',
	twitter: 'Twitter',
	youtube: 'YouTube',
	linkedin: 'LinkedIn',
};

const getIcon = ( source ) => {
	switch ( source ) {
		case 'twitter':
			return <TwitterIcon className={cx( 'icon' )} />;
		case 'instagram':
			return <InstagramIcon className={cx( 'icon' )} />;
		case 'facebook':
		case 'facebookGroup':
			return <FacebookIcon className={cx( 'icon' )} />;
		case 'youtube':
			return <YouTubeIcon className={cx( 'icon', 'youtube' )} />;
		case 'linkedin':
			return <LinkedInIcon className={cx( 'icon' )} />;
		case 'messenger':
			return <MessengerIcon className={cx( 'icon' )} />;
		default:
			return null;
	}
};

const SocialLinks = () => {
	const editionLinks = links();
	const socialLinkKeys = Object.keys( editionLinks.social );

	return (
		<ul className={styles.container}>
			{
				socialLinkKeys.map( ( source, index ) => (
					<li className={styles.item} key={index}>
						<a href={editionLinks.social[source]}>
							<div aria-hidden={true}>{getIcon( source )}</div>
							<div className={styles.name}>{socialSourceNames[source]}</div>
						</a>
					</li>
				) )
			}
		</ul>
	);
};

export default SocialLinks;
