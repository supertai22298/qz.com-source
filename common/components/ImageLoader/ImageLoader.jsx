import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'components/Image/Image';
import styles from './ImageLoader.scss';
import classnames from 'classnames/bind';
import withAmp from 'helpers/wrappers/withAmp';
import compose from 'helpers/compose';
import { useInView } from 'helpers/hooks';

const cx = classnames.bind( styles );

const ImageLoader = ( {
	width,
	height,
	src,
	title,
	alt,
	srcSet,
	sizes,
	children,
	className,
	amp,
	lazyLoad,
	disableBackground,
} ) => {
	const style = {};
	const aspectRatio = width / height;
	const [ loaded, setLoaded ] = useState( ! lazyLoad );
	const [ ref, visible ] = useInView( {
		initialVisibility: amp || ! lazyLoad,
		rootMargin: '250px',
	} );

	// add style if a aspectRatio was passed
	if ( aspectRatio && ! amp ) {
		const paddingBottom = 100 / aspectRatio;
		style.paddingBottom = `${paddingBottom}%`;
	}

	return (
		<div
			className={cx( 'container', className, { loaded, disableBackground, visible } )}
			style={style}
			ref={ref}
		>
			{
				visible &&
				<Image
					alt={alt}
					height={height}
					onLoad={() => {
						setLoaded( true );
					}}
					sizes={sizes}
					src={src}
					srcSet={srcSet}
					title={title}
					width={width}
				/>
			}
			{
				lazyLoad &&
				! amp &&
				<noscript>
					<img src={src} alt={alt} />
				</noscript>
			}
			{children}
		</div>
	);
};

ImageLoader.defaultProps = {
	sizes: [],
	disableBackground: false,
};

ImageLoader.propTypes = {
	alt: PropTypes.string.isRequired,
	amp: PropTypes.bool.isRequired,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	className: PropTypes.string,
	disableBackground: PropTypes.bool,
	height: PropTypes.number.isRequired,
	lazyLoad: PropTypes.bool.isRequired,
	sizes: PropTypes.array.isRequired,
	src: PropTypes.string.isRequired,
	srcSet: PropTypes.array.isRequired,
	title: PropTypes.string,
	width: PropTypes.number.isRequired,
};

export default compose(
	withAmp()
)( ImageLoader );
