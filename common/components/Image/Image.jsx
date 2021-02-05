import React from 'react';
import PropTypes from 'prop-types';
import compose from 'helpers/compose';
import { withAmp } from 'helpers/wrappers';
import { dedupe } from 'helpers/utils.js';

// Image could be loaded from SSR before app hyrdates. Check for complete
// property before attaching onLoad.
export const Image = ( { alt, className, onLoad, sizes, src, srcSet, title } ) => {

	const uniqueSrcSet = dedupe( srcSet ).join( ', ' );

	return (
		<img
			ref={ref => {
				if ( ref?.src && ref.complete ) {
					onLoad( null, 'complete' );
				}
			}}
			src={src}
			srcSet={uniqueSrcSet}
			sizes={sizes.join( ', ' )}
			title={title}
			alt={alt}
			onLoad={onLoad}
			className={className}
			decoding="async"
		/>
	);
};

const ImageAmp = ( { width, height, src, alt, srcSet, sizes, title } ) => {
	const aspectRatio = width / height;
	const uniqueSrcSet = srcSet.length ? dedupe( srcSet ).join( ', ' ) : null;

	return (
		<amp-img
			layout="responsive"
			src={src}
			title={title}
			alt={alt}
			width={aspectRatio}
			height="1"
			srcSet={uniqueSrcSet}
			sizes={sizes.length ? sizes.join( ', ' ) : null}
		>
		</amp-img>
	);
};

Image.defaultProps = ImageAmp.defaultProps = {
	srcSet: [],
	sizes: [],
	className: '',
	onLoad: () => {},
	visible: true,
};

const baseImagePropTypes = {
	alt: PropTypes.string.isRequired,
	height: PropTypes.number.isRequired,
	sizes: PropTypes.array.isRequired,
	src: PropTypes.string.isRequired,
	srcSet: PropTypes.array.isRequired,
	title: PropTypes.string,
	width: PropTypes.number.isRequired,
};

Image.propTypes = {
	...baseImagePropTypes,
	className: PropTypes.string.isRequired,
	onLoad: PropTypes.func.isRequired,
};

ImageAmp.propTypes = baseImagePropTypes;

export default compose(
	withAmp( ImageAmp )
)( Image );
