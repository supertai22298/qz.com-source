import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { baseFeedUrl } from 'config/meta';

// Note: You cannot use React components inside Helmet; they must be regular
// HTML tags. Therefore we bring our own Helmet and components must use FeedLink
// outside of their own Helmet, if it exists.
const FeedLink = ( { path, title } ) => (
	<Helmet>
		<link
			href={`${baseFeedUrl}/${path}/`.replace( /\/+$/g, '/' )}
			rel="alternate"
			title={title}
			type="application/rss+xml"
		/>
	</Helmet>
);

FeedLink.propTypes = {
	path: PropTypes.string.isRequired,
	title: PropTypes.string,
};

FeedLink.defaultProps = {
	title: 'Quartz',
};

export default FeedLink;
