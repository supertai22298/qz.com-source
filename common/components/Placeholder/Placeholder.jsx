import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './Placeholder.scss';

const cx = classnames.bind( styles );

// bind className in the component where placeholder is being used - style there
export const PlaceholderImage = ( { aspectRatio, className } ) => {
	const style = {
		paddingBottom: `${ 100 / aspectRatio }%`,
	};

	return (
		<div
			className={cx( 'image', className )}
			style={style}
			aria-hidden="true"
		/>
	);
};

PlaceholderImage.defaultProps = {
	aspectRatio: 1,
};

PlaceholderImage.propTypes = {
	aspectRatio: PropTypes.number.isRequired,
	className: PropTypes.string,
};

/*
	preset heading sizes
		large: 36px
		medium: 16px
		small: 13px
		x-small: 8px
*/

export const PlaceholderHeading = ( { className, size } ) => (
	<div className={cx( 'heading', size, className )} aria-hidden="true" />
);

PlaceholderHeading.propTypes = {
	className: PropTypes.string,
	size: PropTypes.string,
};

PlaceholderHeading.defaultProps = {
	size: 'large',
};

export const PlaceholderParagraph = ( { className, lines } ) => {
	const items = [];

	for ( let i = 0; i < lines; i++ ) {
		items.push(
			<div className={cx( 'line' )} key={i} />
		);
	}

	return (
		<div className={cx( 'paragraph', className )} aria-hidden="true" >
			{items}
		</div>
	);
};

PlaceholderParagraph.propTypes = {
	className: PropTypes.string,
	lines: PropTypes.number.isRequired,
};

PlaceholderParagraph.defaultProps = {
	count: 3,
};
