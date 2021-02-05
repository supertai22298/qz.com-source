import React from 'react';
import PropTypes from 'prop-types';
import withVisibility from 'helpers/wrappers/withVisibility';
import deepEqual from 'deep-equal';
import compose from 'helpers/compose';

let ads = [];
let divs = 0;

/**
 * Callback function for when ad slots have finished rendering
 * @param  {Object} event
 * @return {Void}
 */
const slotRenderEnded = ( event ) => {
	const id = event.slot.getSlotElementId();
	const ad = ads.find( ( ad ) => ad.id === id );

	if ( ad && 'function' === typeof ad.onSlotRenderEnded ) {
		ad.onSlotRenderEnded( event );
	}
};

/**
 * Helper to keep track of div ids
 * @return {String}
 */
const generateDivId = () => {
	divs++;
	return `gpt-slot-${divs}`;
};

const googletag = 'object' === typeof window ? window.googletag = window.googletag || {} : {};
googletag.cmd = googletag.cmd || [];

// Configure GPT.
googletag.cmd.push( () => {
	googletag.pubads().collapseEmptyDivs();
	googletag.pubads().addEventListener( 'slotRenderEnded', slotRenderEnded );
	googletag.pubads().setPrivacySettings( {
		childDirectedTreatment: false,
	} );
} );

export class Gpt extends React.Component {
	constructor( props ) {
		super( props );

		this.divId = props.id || generateDivId();

		this.state = {
			loaded: false,
			refresh: false,
			inView: !props.lazyLoad,
		};

		this.onMouseEnter = this.onMouseEnter.bind( this );
	}

	static getDerivedStateFromProps( props, state ) {
		const { loaded, refresh } = state;
		const { lazyLoad, visible, adUnitPath, targeting } = props;

		const shouldLoad = lazyLoad && !loaded && visible;
		const shouldRefresh = adUnitPath !== state.adUnitPath || !deepEqual( targeting, state.targeting );

		if ( loaded !== shouldLoad || refresh !== shouldRefresh ) {
			return {
				loaded: shouldLoad,
				refresh: shouldRefresh,
				adUnitPath: adUnitPath,
				targeting: targeting,
			};
		}

		return null;
	}

	componentDidMount() {
		// A counter to keep track of how many times the ad slot has refreshed, if any
		this.refreshCounter = 0;

		const {
			adUnitPath,
			autoRefreshInterval,
			autoRefreshLimit,
			lazyLoad,
			onSlotRenderEnded,
		} = this.props;

		this.createSlot();
		this.configureSlot();

		// setup slot
		googletag.cmd.push( () => {

			// add services
			googletag.enableServices();

			// render if no lazy load
			if ( !lazyLoad ) {
				googletag.display( this.divId );
			}

			// keep track of slots
			ads.push( {
				id: this.divId,
				slot: this.slot,
				onSlotRenderEnded: e => {
					// If an autoRefreshInterval (ms) was supplied, if the ad
					// path indicates that we are on an article page, and if we
					// have not reached the refresh limit (if one was supplied),
					// we will refresh the ad slot once that interval has
					// expired. Note that we use setTimeout, not setInterval,
					// because each subsequent refresh will call this function.
					if (
						autoRefreshInterval &&
						adUnitPath.endsWith( '/article' ) &&
						(
							! autoRefreshLimit ||
							this.refreshCounter < autoRefreshLimit
						)
					) {
						this.startRefreshTimer();

						// Lock the ad slot to the size of the first returned creative
						if ( this.refreshCounter === 1 ) {
							this.slot.defineSizeMapping( [ [ [ 0, 0 ], e.size ] ] );
						}
					}

					// Also run the onSlotRenderEnded handler prop
					onSlotRenderEnded( e );
				},
			} );
		} );
	}

	startRefreshTimer() {
		// Increment our private refresh timer and set it as a new value
		// for the refresh targeting parameter in time for the next refresh
		this.refreshCounter = this.refreshCounter + 1;
		this.slot.setTargeting( 'refresh', this.refreshCounter.toString() );

		this.refreshTimer = window.setTimeout( () => {
			googletag.pubads().refresh( [ this.slot ] );
		}, this.props.autoRefreshInterval );
	}

	stopRefreshTimer() {
		window.clearTimeout( this.refreshTimer );
	}

	componentDidUpdate( prevProps, prevState ) {
		const { loaded, refresh } = this.state;
		const { lazyLoad, resetVisibility, visible } = this.props;

		if ( loaded && loaded !== prevState.loaded ) {
			googletag.cmd.push( () => {
				if ( refresh ) {
					googletag.pubads().refresh( [ this.slot ], { updateCorrelator: false } );
				} else {
					googletag.display( this.divId );
				}
			} );
		}

		// when a component gets new props, we should refresh the ad instead of displaying a new one
		if ( refresh && refresh !== prevState.refresh ) {
			this.configureSlot();

			googletag.cmd.push( () => {
				googletag.pubads().clear( [ this.slot ] );
			} );

			// refresh the slot
			if ( ! lazyLoad ) {
				googletag.cmd.push( () => {
					// Reset the refresh counter so we don't include the previous ad's
					// auto-refresh count in the new ad's count.
					this.refreshCounter = 0;
					googletag.pubads().refresh( [ this.slot ], { updateCorrelator: false } );
				} );

			// refresh when it's in view
			} else {
				resetVisibility();
			}
		}

		// The visibility of the ad changed and an auto-refresh timer was
		// started at some point in the component lifecycle. We should
		// either start or stop the timer depending on whether the ad is
		// now visible or not
		if ( this.refreshTimer && visible !== prevState.visible ) {
			if ( visible ) {
				this.startRefreshTimer();
			} else {
				this.stopRefreshTimer();
			}
		}
	}

	componentWillUnmount() {

		// remove slot
		ads = ads.filter( ( ad ) => ad.id !== this.divId );

		// destroy the slot in gpt
		googletag.cmd.push( () => {
			googletag.destroySlots( [ this.slot ] );
		} );
	}

	createSlot() {

		const {
			adUnitPath,
			slotSize,
			outOfPage,
		} = this.props;

		googletag.cmd.push( () => {

			// determine type of slot
			if ( outOfPage ) {
				this.slot = googletag.defineOutOfPageSlot( adUnitPath, this.divId );
			} else {
				this.slot = googletag.defineSlot( adUnitPath, slotSize, this.divId );
			}

			// add pubads service
			this.slot.addService( googletag.pubads() );

		} );
	}

	configureSlot() {

		const {
			autoRefreshInterval,
			targeting,
			sizeMapping,
		} = this.props;

		googletag.cmd.push( () => {

			// clear any previously set targets, since this might be configured after a refresh
			this.slot.clearTargeting();

			// add targeting
			if ( targeting ) {
				Object.keys( targeting ).forEach( key => {
					this.slot.setTargeting( key, targeting[key] );
				} );
			}

			// handle size mapping
			if ( sizeMapping ) {
				const sizeMappingArray = sizeMapping
					.reduce( ( mapping, size ) => mapping.addSize( size.viewport, size.slot ), googletag.sizeMapping() )
					.build();

				this.slot.defineSizeMapping( sizeMappingArray );
			}

			// Add a 'refresh' targeting parameter if this slot should
			// auto-refresh. We always want to start at 0. Passing 0 as an
			// integer fails to update the value, so we pass it as a string
			if ( autoRefreshInterval ) {
				this.slot.setTargeting( 'refresh', '0' );
			}
		} );
	}

	onMouseEnter() {
		// Once a user has moused onto the ad, stop the refresh timer and
		// prevent it from starting again
		this.stopRefreshTimer();
		this.refreshTimer = null;
	}

	render() {
		const {
			className,
			lazyLoad,
			setRef,
		} = this.props;

		// render div
		return (
			<div className={className} onMouseEnter={this.onMouseEnter} ref={lazyLoad ? setRef : null}>
				<div id={this.divId} />
			</div>
		);
	}
}

Gpt.propTypes = {
	adUnitPath: PropTypes.string.isRequired,
	/**
	 * Time in ms that the ad should be visible for, once loaded, before
	 * refreshing the slot. Slot will not refresh if no value is supplied
	 */
	autoRefreshInterval: PropTypes.number,
	/**
	 * Maximum number of times that the ad should auto-refresh. Note that
	 * this value limits the number of refreshes, not the number of
	 * impressions. A limit of 3 refreshes would result in up to 4
	 * impressions. If no refresh limit is supplied, the slot will
	 * refresh continually
	 */
	autoRefreshLimit: PropTypes.number,
	className: PropTypes.string,
	id: PropTypes.string,
	lazyLoad: PropTypes.bool,
	onSlotRenderEnded: PropTypes.func,
	outOfPage: PropTypes.bool,
	resetVisibility: PropTypes.func.isRequired,
	setRef: PropTypes.func.isRequired,
	sizeMapping: PropTypes.arrayOf(
		PropTypes.shape( {
			viewport: PropTypes.array,
			slot: PropTypes.array,
		} )
	),
	slotSize: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.array,
	] ),
	targeting: PropTypes.object,
	visible: PropTypes.bool.isRequired,
};

Gpt.defaultProps = {
	slotSize: [],
	lazyLoad: true,
};

export default compose(
	withVisibility( { persistent: true } )
)( Gpt );
