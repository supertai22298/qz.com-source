import React from 'react';
import PropTypes from 'prop-types';
import Schema from './Schema.jsx';
import getMeta, { baseUrl } from 'config/meta';

const WebPageSchema = ( { description, edition, location, name } ) => {
	const meta = getMeta( edition );

	const schemaData = {
		'@type': 'WebPage',
		name: name || meta.title,
		description: description || meta.description,
		url: `${baseUrl}${location.pathname}`,
	};

	return <Schema data={schemaData} />;
};

WebPageSchema.propTypes = {
	description: PropTypes.string,
	edition: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired,
	name: PropTypes.string,
};

export default WebPageSchema;
