import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './SpotlightOverlay.scss';
import withScroll from 'helpers/wrappers/withScroll';

class SpotlightOverlay extends React.Component {

	constructor( props ) {
		super( props );

		this.onScroll = this.onScroll.bind( this );

		this.state = {
			style: {},
		};
	}

	static getDerivedStateFromProps( props, state ) {
		if ( state.backgroundColor !== props.color ) {
			return {
				...state.style,
				backgroundColor: props.color,
			};
		}

		return null;
	}

	componentDidMount() {
		const { addScrollListener } = this.props;

		addScrollListener( this.onScroll );
	}

	onScroll( scrollProps ) {
		const currentOpacity = this.state.style.opacity;

		// amount of space required before we start manipulating the background
		const threshold = 300;

		// background should be at 100% opacity once were 75% through the threshold
		const distance = threshold * .75;

		// how much space from the bottom before we start animating
		const diff = threshold - distance;

		const { ads } = this.props;

		if ( !ads ) {
			return;
		}

		const els = Object.values( ads );

		/**
		 * When the state updates, go through the ids and cache the DOM nodes
		 *
		 * @return {void}
		 */
		const opacityStyle = els.map( ( el ) => {

			let opacity = 0;

			const rect = el?.getBoundingClientRect();

			if ( !rect ) {
				return opacity;
			}

			// is the ad within the threshold distance from the top
			if ( rect.top < threshold && rect.top > 0 ) {

				opacity = ( threshold - rect.top ) / distance;

			// is the ad within the threshold distance from the bottom
			} else if ( rect.bottom < scrollProps.innerHeight && rect.bottom > scrollProps.innerHeight - threshold ) {

				opacity = 1 - Math.max( 0, scrollProps.innerHeight - rect.bottom - diff ) / distance;
			}

			return opacity;

		} )
			.filter( ( opacity ) => !!opacity ) // remove non-zero values
			.reduce( ( prevOpacity, opacity ) => opacity, 0 ); // return last non-zero value

		// Don't set state if property hasn't changed.
		if ( opacityStyle === currentOpacity ) {
			return;
		}

		this.setState( {
			style: {
				...this.state.style,
				display: opacityStyle ? 'block' : 'none', // display: none if opacity is 0
				opacity: opacityStyle,
			},
		} );
	}

	render() {
		const { style } = this.state;
		return <div className={styles.container} style={style}></div>;
	}
}

SpotlightOverlay.propTypes = {
	addScrollListener: PropTypes.func,
	ads: PropTypes.object,
	color: PropTypes.string,
};

const mapStateToProps = ( state ) => ( {
	ads: state.spotlight.ads,
	color: state.spotlight.color,
} );

const SpotlightOverlayWithScroll = withScroll( SpotlightOverlay );

export default connect( mapStateToProps )( SpotlightOverlayWithScroll );
