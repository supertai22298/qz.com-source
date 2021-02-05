import React from 'react';
import styles from './StyledElement.scss';
import classnames from 'classnames/bind';
import { stripInlineStyling } from 'helpers/text';
import { BlockPartsFragment } from '@quartz/content';

const cx = classnames.bind( styles );

export const reduceAttribute = ( blockAttrs, attribute: {
	name: string,
	value: string,
} ): {
	align?: string,
	dir?: string,
	id?: string,
} => {
	const { name, value } = attribute;
	if ( [ 'dir', 'id' ].includes( name ) ) {
		return { [ name ]: value, ...blockAttrs };
	}

	// Allow only a subset of CSS properties in the top-level style attribute and
	// convert them to props.
	if ( 'style' === name ) {
		const alignMatch = value.match( /text-align\s*:\s*(center|right)/ );
		if ( alignMatch ) {
			return { align: alignMatch[1], ...blockAttrs };
		}
	}

	return blockAttrs;
};

const StyledElement = ( props: BlockPartsFragment & {
	isWorkGuide?: false,
} ) => {
	const { align, ...blockAttrs } = props.attributes?.reduce( reduceAttribute, {} );
	const className = cx(
		props.tagName,
		{ [ `align-${align}` ]: align, guide: props.isWorkGuide }
	);

	if ( ! props.tagName ) {
		return null;
	}

	const sanitizedInnerHtml = stripInlineStyling( props.innerHtml || '' );

	// If the element has no children it may be a void element, e.g. an hr, br, etc, and
	// React will throw an error if we try to use dangerouslySetInnerHTML
	if ( ! sanitizedInnerHtml ) {
		return React.createElement(
			props.tagName,
			{
				className,
				...blockAttrs,
			}
		);
	}

	return React.createElement(
		props.tagName,
		{
			className,
			dangerouslySetInnerHTML: { __html: sanitizedInnerHtml },
			...blockAttrs,
		}
	);
};

export default StyledElement;
