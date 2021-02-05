import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './SiteMenu.scss';
import DrawerMenu from 'components/DrawerMenu/DrawerMenu';
import SearchInput from 'components/SearchInput/SearchInput';
import SocialLinks from 'components/SocialLinks/SocialLinks';
import Switchboard from 'components/Switchboard/Switchboard';
import getMeta from 'config/meta';
import useUserRole from 'helpers/hooks/useUserRole';

const getPageSwitchboardItems = isMember => {
	const defaultItems = [
		{
			link: '/emails/',
			title: 'Subscribe to our emails',
			description: 'Enjoy Quartz emails in your inbox, with something fresh every morning, afternoon, and weekend.',
		},
		{
			link: '/guides/',
			title: 'Field Guides',
			description: 'Go deep with our field guides to the industries, companies, and phenomena changing the state of play in business.',
		},
		{
			link: '/re/quartz-presents/',
			title: 'Presentations',
			description: 'Take our topic-based slide presentations to your next meeting and use them to guide your decision making.',
		},
		{
			link: '/latest/',
			title: 'Latest',
			description: 'Most recent coverage of Quartz’s global business news and insights.',
		},
		{
			link: '/discover/trending/',
			title: 'Trending',
			description: 'Popular stories that our global audience is reading right now.',
		},
		{
			link: '/obsessions/',
			title: 'Obsessions',
			description: 'Our core obsessions that drive our newsroom—defining topics of seismic importance to the global economy.',
		},
		{
			link: '/featured/',
			title: 'Featured',
			description: 'Enjoy our most ambitious editorial projects.',
		},
	];

	if ( isMember ) {
		return defaultItems;
	}

	return [
		{
			title: 'Become a member',
			description: 'Enrich your perspective. Embolden your work. Become a Quartz member.',
			link: '/subscribe/',
		},
		...defaultItems,
	];
};

const editionSwitchboardItems = [
	'quartz',
	'work',
	'africa',
	'india',
].map( edition => {
	const { link, shortDescription, title } = getMeta( edition );

	return {
		description: shortDescription,
		link,
		title,
	};
} );

export const SiteDirectory = ( { isMember } ) => (
	<Fragment>
		<div className={styles.section}>
			<p className={styles[ 'section-heading' ]}>Follow Quartz</p>
			<SocialLinks />
		</div>
		<div className={styles.section}>
			<p className={styles[ 'section-heading' ]}>Discover</p>
			<Switchboard
				items={getPageSwitchboardItems( isMember )}
				size="small"
			/>
		</div>
		<div className={styles.section}>
			<p className={styles[ 'section-heading' ]}>Editions</p>
			<Switchboard
				items={editionSwitchboardItems}
				size="small"
			/>
		</div>
		<div className={styles.section}>
			<p className={styles[ 'section-heading' ]}>More from Quartz</p>
			<Switchboard
				items={[
					{
						title: 'About Quartz',
						description: 'Learn more about our mission, values, culture, and staff.',
						link: '/about/',
					},
					{
						title: 'Careers',
						description: 'Join our global team of smart, curious, and kind colleagues.',
						link: '/careers/',
					},
					{
						title: 'Diversity and inclusion',
						description: 'Our commitment to making Quartz a great place to work for people of all backgrounds.',
						link: '/about/diversity-inclusion-equality-at-quartz/',
					},
					{
						title: 'Help center',
						description: 'Ask questions about any of our products or get help from our support team.',
						link: 'https://help.qz.com',
					},
					{
						title: 'Download our app',
						description: 'Access all Quartz content right from your homescreen.',
						link: '/app/',
					},
					{
						title: 'Quartz Creative',
						description: 'Browse a portfolio of brand work from our in-house advertising studio.',
						link: '/creative/',
					},
				]}
				size="small"
			/>
		</div>
	</Fragment>
);

SiteDirectory.propTypes = {
	isMember: PropTypes.bool.isRequired,
};

function SiteMenu ( {
	closeDropdown,
	inView,
} ) {
	const { isMember } = useUserRole();

	return (
		<DrawerMenu
			align="left"
			closeDropdown={closeDropdown}
			inView={inView}
		>
			<div className={styles.section}>
				<SearchInput onSubmit={closeDropdown} />
			</div>
			<SiteDirectory isMember={isMember} />
		</DrawerMenu>
	);
}

SiteMenu.propTypes = {
	closeDropdown: PropTypes.func.isRequired,
	inView: PropTypes.bool.isRequired,
};

export default SiteMenu;
