import React, { Component } from 'react';
import { connect } from 'react-redux';
import withVisibility from './withVisibility';

/**
 * Create a mapDispatchToProps function for tracking function props (see
 * below). Defining this in outer scope so that it can be tested without
 * mocking Redux.
 *
 * @param  {function} dispatch Redux dispatch function
 * @param  {object}   ownProps Wrapped component's own props
 * @return {function}
 */
export const createMapDispatchToProps = trackedProps => ( dispatch, ownProps ) => Object.keys( trackedProps ).reduce( ( acc, prop ) => {
	// The value of each property in the `trackedProps` object is a Redux
	// action creator.
	const { [ prop ]: actionCreator } = trackedProps;

	// Get the original prop to be tracked (e.g., onClick) and a trackingData
	// prop, if it exists.
	const { [ prop ]: originalProp, trackingData = {} } = ownProps;

	return {
		...acc,
		[ prop ]: ( ...args ) => {
			dispatch( actionCreator( trackingData, ownProps, ...args ) );
			return originalProp?.( ...args );
		},
	};
}, {} );

/**
 * Wraps function props of a component and dispatches (tracking) actions when
 * they are called. For example, let's say I want to dispatch an action named
 * trackClick whenever an onClick function prop is called:
 *
 * ---
 * import { trackClick } from './actions';
 *
 * const MyComponent = ( { onClick } ) => <a onClick={onClick}>Click Me!</a>;
 *
 * export default withTracking( {
 *   onClick: trackClick,
 * } )( MyComponent )
 * ---
 *
 * Now trackClick will be dispatched when onClick is called. The action payload
 * will be empty unless I supply a `trackingData` prop to the wrapped component.
 *
 * What happens next? That's up to you! All we're doing is dispatching an action.
 *
 * @param  {object} trackedProps An object where the key is a function prop and
 *                               the value is a Redux action creator
 * @return {Component}
 */
export const withTracking = ( trackedProps = {} ) => WrappedComponent => connect( null, createMapDispatchToProps( trackedProps ) )( WrappedComponent );

// Create in outer scope for reuse.
const withTrackingVisibility = withVisibility( {
	shouldUpdate: () => true,
} );

type TrackingData = Record<string, unknown>;

type TrackedComponentProps = {
	// Arbitrary data that is sent with the tracking event
	trackingData?: TrackingData,
	// tracking action to dispatch when the component mounts
	trackOnMount: () => void,
	// tracking action to dispatch when the component appears in the viewport
	trackOnView: () => void,
	visible: boolean,
};

type TrackedComponentState = {
	viewed: boolean,
};

// Action factories must return an object with at least a property of
// 'type', but since we are removing redux in the near future we're
// being lazy and pretending we don't care what the function returns.
type TrackingActionFactory = ( trackingData?: TrackingData, ownProps?: Record<any, unknown> ) => void;

/**
 * Track the visibility of a component either on mount (componentDidMount)
 * and/or when it is actually visible (using withVisibility). If tracking on
 * mount, override the PixelDepth since it's not knowable.
 *
 * @param  {object} options Pass onMount and/or onView to track visibility.
 * @return {Component}
 */
export const withVisibilityTracking = ( options: {
	onMount?: TrackingActionFactory,
	onView?: TrackingActionFactory,
} ) => WrappedComponent => {
	const { onMount, onView } = options;

	const mapDispatchToProps = ( dispatch, { trackingData = {}, ...ownProps } ) => ( {
		trackOnMount: () => onMount && dispatch( onMount( { pixelDepth: null, ...trackingData }, ownProps ) ),
		trackOnView: () => onView && dispatch( onView( trackingData, ownProps ) ),
	} );

	class TrackedComponent extends Component<TrackedComponentProps, TrackedComponentState> {
		constructor( props ) {
			super ( props );

			this.state = {
				viewed: false,
			};
		}

		componentDidMount() {
			this.props.trackOnMount();
			this.trackIfVisible();
		}

		componentDidUpdate( prevProps ) {
			// If the tracking data changed, call the onMount func again. (Example:
			// the "stage" of the form changed.)
			if ( this.trackingDataDidUpdate( prevProps.trackingData ) ) {
				this.props.trackOnMount();
			}

			this.trackIfVisible();
		}

		trackingDataDidUpdate( prevTrackingData = {} ) {
			return Object.keys( prevTrackingData ).some( key => prevTrackingData[ key ] !== this.props.trackingData?.[ key ] );
		}

		trackIfVisible() {
			const { trackOnView, visible = false } = this.props;
			const { viewed } = this.state;

			if ( !viewed && visible ) {
				trackOnView();
				this.setState( { viewed: true } );
			}
		}

		render () {
			return <WrappedComponent {...this.props} />;
		}
	}

	const ConnectedComponent = connect( null, mapDispatchToProps )( TrackedComponent );

	// Only wrap with withVisibility if we need to.
	return onView ? withTrackingVisibility( ConnectedComponent ) : ConnectedComponent;
};
