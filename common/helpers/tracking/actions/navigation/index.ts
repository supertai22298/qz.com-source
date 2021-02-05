import { GTM, TRACKING } from 'helpers/types/tracking';
import { getLastPageY } from 'helpers/wrappers/withScroll';

export const trackBlockClick = ( { context, destinationHeadline, destinationUrl } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'SiteNavigate',
			eventAction: 'Click block',
			eventCategory: 'Site navigate',
			eventLabel: context,
			destinationHeadline,
			destinationUrl,
			pixelDepth: getLastPageY(),
		},
	},
	type: 'TRACK_BLOCK_CLICK',
} );

export const trackFeedItemClick = ( { context, destinationHeadline, destinationUrl } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'SiteNavigate',
			eventAction: 'Click feed item',
			eventCategory: 'Site navigate',
			eventLabel: context,
			destinationHeadline,
			destinationUrl,
			pixelDepth: getLastPageY(),
		},
	},
	type: 'TRACK_FEED_ITEM_CLICK',
} );

export const trackNavigationClickModule = ( { context, destinationHeadline, destinationUrl } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'SiteNavigate',
			eventAction: 'Click nav module',
			eventCategory: 'Site navigate',
			eventLabel: context,
			pixelDepth: getLastPageY(),
			destinationHeadline,
			destinationUrl,
		},
	},
	type: 'TRACK_NAVIGATION_CLICK',
} );

export const trackNavigationViewModule = ( { context, destinationHeadline, destinationUrl } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'SiteNavigate',
			eventAction: 'View nav module',
			eventCategory: 'Site navigate',
			eventLabel: context,
			destinationHeadline,
			destinationUrl,
			pixelDepth: getLastPageY(),
		},
	},
	type: 'TRACK_NAVIGATION_VIEW',
} );

export const trackReadMoreClick = ( { context, destinationHeadline, destinationUrl } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'SiteNavigate',
			eventAction: 'Read more click',
			eventCategory: 'Site navigate',
			eventLabel: context,
			destinationHeadline,
			destinationUrl,
			pixelDepth: getLastPageY(),
		},
	},
	type: 'TRACK_READ_MORE_CLICK',
} );

export const trackTableOfContentsClick = ( { context, destinationHeadline, destinationUrl } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'SiteNavigate',
			eventAction: 'Click nav module',
			eventCategory: 'Site navigate',
			eventLabel: context,
			destinationHeadline,
			destinationUrl,
			pixelDepth: getLastPageY(),
		},
	},
	type: 'TRACK_TABLE_OF_CONTENTS_CLICK',
} );

export const trackTableOfContentsView = ( options: { context: string } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'SiteNavigate',
			eventAction: 'View nav module',
			eventCategory: 'Site navigate',
			eventLabel: options.context,
			pixelDepth: getLastPageY(),
		},
	},
	type: 'TRACK_TABLE_OF_CONTENTS_VIEW',
} );

export const trackTabClick = ( { context, destinationHeadline, destinationUrl } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'SiteNavigate',
			eventAction: 'Click tab bar',
			eventCategory: 'Site navigate',
			eventLabel: context,
			destinationHeadline,
			destinationUrl,
			pixelDepth: getLastPageY(),
		},
	},
	type: 'TRACK_TAB_BAR_CLICK',
} );

export const trackNavClick = ( { context, destinationHeadline, destinationUrl } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'SiteNavigate',
			eventAction: 'Click nav bar',
			eventCategory: 'Site navigate',
			eventLabel: context,
			destinationHeadline,
			destinationUrl,
			pixelDepth: getLastPageY(),
		},
	},
	type: 'TRACK_NAV_CLICK',
} );
