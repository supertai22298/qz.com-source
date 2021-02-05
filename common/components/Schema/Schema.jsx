import React from 'react';
import PropTypes from 'prop-types';
import { baseUrl } from 'config/meta';

const base = {
	'@context': 'http://schema.org',
	inLanguage: 'en-us',
	publisher: {
		'@type': 'Organization',
		name: 'Quartz',
		logo: {
			'@type': 'ImageObject',
			url: 'https://app.qz.com/img/logo/Qz_Logo_Black.png',
			height: 25,
			width: 160,
		},
		sameAs: [ 'https://en.wikipedia.org/wiki/Quartz_(publication)', 'https://www.facebook.com/quartznews', 'https://twitter.com/qz' ],
		url: baseUrl,
		member: [ {
			'@type': 'Person',
			name: 'Zach Seward',
			jobTitle: 'CEO',
		} ],
		location: {
			'@type': 'PostalAddress',
			addressLocality: 'New York',
			addressRegion: 'NY',
		},
	},
};

export const getSchema = ( data ) => {

	const schema = Object.assign( {}, base, data );

	// make sure the URL is escaped to prevent XSS attacks
	if ( schema.url ) {
		schema.url = encodeURI( schema.url );
	}

	return schema;
};

/**
 * standard json dl react component.
 *
 * @param  {Object} options.data [data prop to be merge in to the base schema object.  Will overwrite base key value pair if  data prop contains the same key]
 * @return {Object} [script component with the json dl inside]
 */
const Schema = ( { data } ) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify( getSchema( data ), null, 0 ) }}></script>;

Schema.propTypes = {
	data: PropTypes.object, // data object of key values to be the base schema object
};

Schema.defaultProps = {
	data: {},
};

export default Schema;
