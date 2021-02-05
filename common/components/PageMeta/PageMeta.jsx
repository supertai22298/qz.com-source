import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import appConfig from 'config/apps';

const PageMeta = ( {
	canonicalUrl,
	description,
	imageUrl,
	includeApp,
	isHome,
	noIndex,
	pageTitle,
	pageUrl,
	shareTitle,
} ) => {
	const { name: appName, appStoreId } = appConfig;

	return (
		<Fragment>
			<Helmet>
				{
					! isHome &&
						<title>{pageTitle}</title>
				}
				<meta property="og:title" content={shareTitle || pageTitle} />
			</Helmet>
			{
				canonicalUrl &&
				<Helmet>
					<link rel="canonical" href={canonicalUrl} />
				</Helmet>
			}
			{
				noIndex &&
				<Helmet>
					<meta name="robots" content="noindex" />
				</Helmet>
			}
			{
				description &&
				<Helmet>
					<meta name="description" content={description}/>
					<meta property="og:description" content={description} />
				</Helmet>
			}
			{
				imageUrl &&
				<Helmet>
					<meta property="og:image" content={imageUrl}/>
					<meta name="twitter:image" content={imageUrl}/>
					<meta name="twitter:card" content="summary_large_image" />
				</Helmet>
			}
			{
				pageUrl &&
				<Helmet>
					<meta property="og:url" content={pageUrl} />
				</Helmet>
			}
			{
				includeApp &&
				<Helmet>
					<meta name="twitter:app:name:iphone" content={appName} />
					<meta name="twitter:app:id:iphone" content={appStoreId} />
				</Helmet>
			}
		</Fragment>
	);
};

PageMeta.propTypes = {
	canonicalUrl: PropTypes.string,
	description: PropTypes.string,
	imageUrl: PropTypes.string,
	includeApp: PropTypes.bool.isRequired,
	isHome: PropTypes.bool.isRequired,
	noIndex: PropTypes.bool.isRequired,
	pageTitle: PropTypes.string.isRequired,
	pageUrl: PropTypes.string,
	shareTitle: PropTypes.string,
};

PageMeta.defaultProps = {
	includeApp: false,
	isHome: false,
	noIndex: false,
};

export default PageMeta;
