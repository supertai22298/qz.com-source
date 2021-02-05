import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { resizeWPImage } from '@quartz/js-utils';
import getMeta from 'config/meta';

const AppMeta = ( { edition } ) => {
	const meta = getMeta( edition );

	const favicon = typeof window !== 'undefined' && window.matchMedia( '(prefers-color-scheme: dark)' ).matches ?
		meta.favicon.dark :
		meta.favicon.light;

	return (
		<Helmet
			htmlAttributes={{ lang: 'en' }}
			defaultTitle={`${meta.title} — ${meta.subtitle}`}
			titleTemplate={`%s — ${meta.title}`}
		>
			<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"/>
			<meta property="og:description" content={meta.description}/>
			<meta property="og:image" content={meta.openGraphImage}/>
			<meta property="og:locale" content="en_US"/>
			<meta property="og:site_name" content={meta.title}/>
			<meta property="og:title" content={meta.title}/>
			<meta property="og:type" content="website"/>
			<meta name="twitter:card" content="summary"/>
			<meta name="twitter:image" content={meta.iconUrl}/>
			<meta name="twitter:site" content={`@${meta.twitterName}`}/>
			<meta name="application-name" content={meta.title} />
			<meta name="description" content={meta.description}/>
			<meta name="theme-color" content={meta.themeColor} />
			<link rel="icon" href={favicon}/>
			<link rel="manifest" href={meta.manifest}/>
			<link type="application/opensearchdescription+xml" rel="search" href="/public/meta/opensearch.xml" />
			<meta name="apple-mobile-web-app-title" content={meta.title}/>
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="black"/>
			<link rel="apple-touch-startup-image" href={meta.iconUrl} />
			<link rel="apple-touch-icon" href={meta.iconUrl} />
			<link rel="apple-touch-icon" sizes="120x120" href={resizeWPImage( meta.iconUrl, 120, 120, true )} />
			<link rel="apple-touch-icon" sizes="180x180" href={resizeWPImage( meta.iconUrl, 180, 180, true )} />
			<link rel="apple-touch-icon" sizes="167x167" href={resizeWPImage( meta.iconUrl, 167, 167, true )} />
			<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
			<meta name="msapplication-window" content="width=1024;height=768" />
			<meta name="msapplication-tooltip" content={meta.shortDescription} />
			<meta name="msapplication-TileColor" content="#ffffff" />
			<meta name="msapplication-TileImage" content={resizeWPImage( meta.iconUrl, 144, 144, true )} />
			<meta name="msapplication-square70x70logo" content={resizeWPImage( meta.iconUrl, 70, 70, true )} />
			<meta name="msapplication-square150x150logo" content={resizeWPImage( meta.iconUrl, 150, 150, true )} />
			<meta name="msapplication-wide310x150logo" content={resizeWPImage( meta.iconUrl, 310, 150, true )} />
			<meta name="msapplication-square310x310logo" content={resizeWPImage( meta.iconUrl, 310, 310, true )} />
			<meta name="google-site-verification" content="s3UlsLX3rTzf6Zh3P-bFlB0KcMuM1gKAPYrMm5icDK8" />
		</Helmet>
	);
};

AppMeta.propTypes = {
	edition: PropTypes.string.isRequired,
};

export default AppMeta;
