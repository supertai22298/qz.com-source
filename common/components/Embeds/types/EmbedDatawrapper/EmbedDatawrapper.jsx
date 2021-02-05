import React, { useEffect, useState, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import styles from './EmbedDatawrapper.scss';
import classnames from 'classnames/bind';
import withAmp from 'helpers/wrappers/withAmp';
import { getAmpBool } from 'helpers/amp';
import { get } from 'helpers/utils';

const cx = classnames.bind( styles );

export const getId = url => url.replace( /^https?:\/\/[^\/]+\//, '' ).split( '/' )[0];

export const EmbedDatawrapper = ( {
	align,
	height: initialHeight,
	size,
	title,
	url,
} ) => {
	const [ height, setHeight ] = useState( initialHeight );
	const chartId = getId( url );
	const eventName = 'datawrapper-height';

	useEffect( () => {
		const listener = ( { data } ) => {
			const newHeight = get( data, `${eventName}.${chartId}` );
			// This listener gets called a lot, so we won't update the height unless it changes by a noticeable amount
			if ( newHeight && Math.abs( newHeight - height ) > 5 ) {
				setHeight( newHeight );
			}
		};

		window.addEventListener( 'message', listener );

		// when component unmounts:
		return () => {
			window.removeEventListener( 'message', listener );
		};
	}, [ chartId, height ] );

	return (
		<div className={cx( 'container', size, { [ `align-${align}` ]: align } )}>
			<iframe
				className={cx( 'iframe' )}
				id={`datawrapper-chart-${chartId}`}
				title={title}
				src={url}
				scrolling="no"
				height={height}
			/>
		</div>
	);
};

const EmbedDatawrapperAmp = ( { title, url, width, height } ) => (
	<Fragment>
		<Helmet>
			<script async={undefined} custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
		</Helmet>
		<div className={cx( 'container' )}>
			<amp-iframe
				src={url}
				title={title}
				width={width}
				height={height}
				layout="responsive"
				sandbox="allow-scripts allow-same-origin"
				resizable={getAmpBool( true )}
			>
				<div overflow={getAmpBool( true )}></div>
			</amp-iframe>
		</div>
	</Fragment>
);

const sharedPropTypes = {
	align: PropTypes.oneOf( [ 'left', 'right' ] ),
	height: PropTypes.number.isRequired,
	size: PropTypes.oneOf( [
		'small',
		'medium',
		'large',
		'extra-large',
	] ),
	title: PropTypes.string,
	url: PropTypes.string.isRequired,
};

const sharedDefaultProps = {
	size: 'medium',
};

EmbedDatawrapper.propTypes = sharedPropTypes;
EmbedDatawrapperAmp.propTypes = {
	...sharedPropTypes,
	width: PropTypes.number.isRequired,
};

EmbedDatawrapper.defaultProps = sharedDefaultProps;
EmbedDatawrapperAmp.defaultProps = sharedDefaultProps;

export default withAmp( EmbedDatawrapperAmp )( EmbedDatawrapper );
