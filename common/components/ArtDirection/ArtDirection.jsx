import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './ArtDirection.scss';
import classnames from 'classnames/bind';
import { withAmp, withVisibility } from 'helpers/wrappers';
import compose from 'helpers/compose';
import { breakpoints, getImprovedSrcSet, pxToEm } from 'helpers/images';
import { resizeWPImage } from '@quartz/js-utils';
import { get, hashCode } from 'helpers/utils';

const cx = classnames.bind( styles );
const shouldUpdate = ( props, nextProps ) => get( props, '.sources[0].url' ) !== get( nextProps, '.sources[0].url' );

// sort the array by breakpoint names so its mobile-first
const sortBreakpoints = sources => {
	const keys = Object.keys( breakpoints );
	sources.sort( ( a, b ) => keys.indexOf( a.breakpoint ) - keys.indexOf( b.breakpoint ) );
};

// Used to provide different image sources across multiple breakpoints.
// For example, you might want to show a 1:1 aspect ratio image on mobile, and a 16:9 image on larger screen
// You can learn more about "Art Direction" here: https://developers.google.com/web/fundamentals/design-and-ux/responsive/images
class ArtDirection extends React.Component {

	constructor( props ) {
		super( props );

		// create a unique id we can use for the inline styles
		this.id = hashCode( JSON.stringify( props.sources ) );
	}

	render() {

		let css = '';
		let lastAspectRatio = null;
		const { alt, sources, className, visible, setRef } = this.props;
		const instanceClass = `ArtDirection__${this.id}`;

		sortBreakpoints( sources );

		sources.forEach( ( source, i ) => {
			const { breakpoint, width, height } = source;
			const aspectRatio = width / height;
			const padding = 100 / aspectRatio;

			if ( aspectRatio !== lastAspectRatio ) {
				// dont output the media query for the first breakpoint
				// shouldnt need it since were mobile-first
				if ( 0 === i ) {
					css += `.${instanceClass} { padding-bottom: ${padding}%; }`;
				} else {
					css += `@media ${breakpoints[breakpoint].media} { .${instanceClass} { padding-bottom: ${padding}%; } }`;
				}
			}

			lastAspectRatio = aspectRatio;
		} );

		// use the smallest source as the default
		const [ { url, width, height } ] = sources;
		const defaultSrc = height ? resizeWPImage( url, width, height ) : resizeWPImage( url, width );

		// reverse so it goes from largest to smallest
		sources.reverse();

		return (
			<Fragment>
				<style dangerouslySetInnerHTML={{ __html: css }}/>
				<picture
					className={cx( 'container', instanceClass, className )}
					ref={setRef}
				>
					{
						sources.map( ( source, i ) => {
							const { breakpoint, url, width, height } = source;
							const args = height ? [ width, height, true ] : [ width ];
							const srcSet = getImprovedSrcSet( url, args );

							return (
								<source
									key={i}
									media={breakpoints[breakpoint].media}
									srcSet={srcSet}
								/>
							);
						} )
					}
					{
						visible &&
						<img
							alt={alt}
							className={cx( 'image' )}
							decoding="async"
							src={defaultSrc}
						/>
					}
				</picture>
			</Fragment>
		);
	}
}

// More details on art direction in AMP: https://www.ampproject.org/docs/design/responsive/responsive_design#displaying-responsive-images
const ArtDirectionAmp = ( { alt, sources } ) => {

	// important to make sure we dont add max-width to the largest size
	sortBreakpoints( sources );

	return (
		<Fragment>
			{
				sources.map( ( source, i ) => {
					const { url, width, height, breakpoint } = source;
					const aspectRatio = width / height;
					const crop = source.height ? true : false;
					let { media } = breakpoints[breakpoint];

					// amp media query needs max-width otherwise we'll get multiple images
					// dont add the max-width to the last media query
					if ( breakpoints[breakpoint].maxWidth && i < sources.length - 1 ) {
						media += ` and (max-width: ${pxToEm( breakpoints[breakpoint].maxWidth )}em)`;
					}

					const src = resizeWPImage( url, width, height, crop );

					return (
						<amp-img
							key={i}
							src={src}
							layout="responsive"
							width={aspectRatio}
							height={1}
							alt={alt}
							media={media}
						>
						</amp-img>
					);
				} )
			}
		</Fragment>
	);
};

ArtDirection.propTypes = {
	// For decorative elements that shouldn't have alt text, use an empty string
	alt: PropTypes.string.isRequired,
	className: PropTypes.string,
	setRef: PropTypes.func,
	sources: PropTypes.arrayOf( PropTypes.shape( {
		breakpoint: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number,
	} ) ),
	visible: PropTypes.bool.isRequired,
};

ArtDirectionAmp.propTypes = {
	alt: PropTypes.string.isRequired,
	sources: PropTypes.arrayOf( PropTypes.shape( {
		breakpoint: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number,
	} ) ),
};

export default compose(
	withAmp( ArtDirectionAmp ),
	withVisibility( { shouldUpdate } )
)( ArtDirection );
