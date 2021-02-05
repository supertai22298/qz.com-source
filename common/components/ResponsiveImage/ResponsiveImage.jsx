import React from 'react';
import PropTypes from 'prop-types';
import ImageLoader from 'components/ImageLoader/ImageLoader';
import { breakpoints, getImprovedSrcSet } from 'helpers/images';
import { resizeWPImage } from '@quartz/js-utils';

const ResponsiveImage = ( { src, alt, aspectRatio, crop, sources, lazyLoad, className } ) => {

	const srcSet = [];
	const sizes = [];

	sources.forEach( ( { width, breakpoint } ) => {

		srcSet.push(
			getImprovedSrcSet(
				src,
				[
					width,
					Math.round( width / aspectRatio ),
					crop,
				]
			)
		);

		sizes.push(
			breakpoint === 'phone-only' ? `${width}px` : `${breakpoints[breakpoint].media} ${width}px`
		);
	} );

	// this is important, otherwise it will default to mobile on desktop
	sizes.reverse();

	const [ { width } ] = sources;
	const height = Math.round( width / aspectRatio );
	const defaultSrc = resizeWPImage( src, width, height, crop );

	return (
		<ImageLoader
			width={width}
			height={height}
			src={defaultSrc}
			alt={alt}
			srcSet={srcSet}
			sizes={sizes}
			lazyLoad={lazyLoad}
			className={className}
		/>
	);
};

ResponsiveImage.propTypes = {
	alt: PropTypes.string.isRequired,
	aspectRatio: PropTypes.number.isRequired,
	className: PropTypes.string,
	crop: PropTypes.bool,
	lazyLoad: PropTypes.bool,
	sources: PropTypes.arrayOf(
		PropTypes.shape( {
			breakpoint: PropTypes.oneOf( Object.keys( breakpoints ) ).isRequired,
			width: PropTypes.number.isRequired,
		} )
	).isRequired,
	src: PropTypes.string.isRequired,
};

ResponsiveImage.defaultProps = {
	crop: true,
	lazyLoad: false,
};

export default ResponsiveImage;
