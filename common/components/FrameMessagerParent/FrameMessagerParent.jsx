import { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'helpers/compose';
import { withRouter } from 'react-router-dom';
import { decodeRelayId } from 'helpers/graphql';
import { postMessage, scrollTo } from 'helpers/utils';
import withPostMessage from 'helpers/wrappers/withPostMessage';
import withScroll from 'helpers/wrappers/withScroll';
import { updateSpotlight } from 'components/Ad/Spotlight/action/index';
import { connect } from 'react-redux';

class FrameMessagerParent extends Component {

	constructor( props ) {
		super( props );

		this._frameElDatas = [];

		this._headerEl = undefined;
		this._tabEl = undefined;
		this._unlisten = undefined;

		this.hashPrefix = 'data/';

		this._registerFrame = this._registerFrame.bind( this );
		this._getInViewStatus = this._getInViewStatus.bind( this );
		this._clearChildFrame = this._clearChildFrame.bind( this );
		this._setHeaderTabRef = this._setHeaderTabRef.bind( this );
		this._handleScroll = this._handleScroll.bind( this );
		this._handleRouteChange = this._handleRouteChange.bind( this );
		this._updateSpotlight = this._updateSpotlight.bind( this );
		this._readHash = this._readHash.bind( this );
		this._updateHash = this._updateHash.bind( this );
	}

	// todo: this is just so that we can calculate the height of the header and the tab which is depended upon
	// the window size and the scroll action of the user.  This should really be part of a an app store state
	// like ui state:
	//
	// {
	// 	nav: {
	// 		visible: true,
	// 		height: 56
	// 	},
	// 	tab: {
	// 		visible: false,
	// 		height: 56
	// 	}
	// }
	_setHeaderTabRef() {
		this._headerEl = document.getElementById( 'header-bar' );
		this._tabEl = document.getElementById( 'tab-bar' );
	}

	_getInViewStatus( el ) {
		const rect = el.getBoundingClientRect();
		const windowHeight = window.innerHeight;

		const headerRect = this._headerEl?.getBoundingClientRect();
		const headerHeight = headerRect && headerRect.top >= 0 ? headerRect.height : 0;

		const tabRect = this._tabEl?.getBoundingClientRect();
		const tabHeight = tabRect && tabRect.height > 0 ? tabRect.height : 0;

		const topThreshold = headerHeight + 1;
		const bottomThreshold = windowHeight - tabHeight;
		const viewableThreshold = rect.height <= 399 ? .7 * rect.height : .5 * rect.height;

		const isVisibleFromTop = rect.bottom > topThreshold && rect.bottom < bottomThreshold;
		const isVisibleFromBottom = rect.top > topThreshold && rect.top < bottomThreshold;
		const isAllVisible = rect.top >= topThreshold && rect.bottom <= bottomThreshold;
		const isViewportAllAd = rect.top < topThreshold && rect.bottom > bottomThreshold;

		const isVisible = isVisibleFromTop || isVisibleFromBottom || isAllVisible || isViewportAllAd;

		let isViewable = false;

		if ( !isVisible ) {

			isViewable = false;

		} else if ( isAllVisible || isViewportAllAd ) {

			isViewable = true;

		} else if ( isVisibleFromTop ) {

			isViewable = rect.bottom - topThreshold >= viewableThreshold;

		} else if ( isVisibleFromBottom ) {

			isViewable = bottomThreshold - rect.top >= viewableThreshold;

		}

		const frameTop = {
			nav: rect.top - headerHeight,
			window: windowHeight - rect.top,
		};

		const frameBottom = {
			nav: rect.bottom - tabHeight,
			window: windowHeight - rect.bottom,
		};

		const result = {
			frameTop: frameTop,
			frameBottom: frameBottom,
			scrollDepth: 0 - headerHeight - frameTop.nav, // same as 0 - rect.top
			viewable: isViewable,
			visible: isVisible,
		};

		const preViewableOrVisible = this._frameElDatas
			.filter( ( frameElData ) => frameElData.parentNode === el )
			.map( ( frameElData ) => frameElData.viewableOrVisible )
			.pop();

		this._frameElDatas = this._frameElDatas.map( ( frameElData ) => {

			if ( frameElData.parentNode === el ) {

				return {
					...frameElData,
					viewableOrVisible: isViewable || isVisible,
				};
			}

			return frameElData;
		} );

		if ( preViewableOrVisible || isViewable || isVisible ) {

			return result;
		}

		return undefined;
	}

	// This is a temporary solution while ad tech migrates to a new stack that
	// can use targeting props universally. When that happens, this should be
	// removed.
	getPageContext() {
		const { currentArticleId } = this.props;
		const { windowProps } = this._readWindowProps();

		return {
			...windowProps,
			wpid: currentArticleId,
		};
	}

	_getDimensions( el ) {

		return {
			window: {
				x: window.innerWidth,
				y: window.innerHeight,
			},
			frame: {
				x: el.offsetWidth,
				y: el.offsetHeight,
			},
			availableHeight: window.innerHeight,
		};

	}

	_registerFrame( { data }, frameEl ) {
		if ( !frameEl ) {
			return;
		}

		const context = this.getPageContext();
		const inViewStatus = this._getInViewStatus( frameEl.parentNode ) || {};
		const dimensions = this._getDimensions( frameEl.parentNode );

		this._frameElDatas.push( {
			frameEl,
			parentNode: frameEl.parentNode,
			origin: data.url,
			viewableOrVisible: inViewStatus.viewable || inViewStatus.visible,
		} );

		// withPostMessage will reply with this data.
		return {
			context,
			dimensions,
			inViewStatus,
			user: {}, // deprecated; used to hold analytics IDs
		};
	}

	_clearChildFrame() {
		this._frameElDatas = [];
	}

	_handleRouteChange() {
		this._clearChildFrame();
	}

	_handleScroll( scrollProps ) {
		this._frameElDatas.forEach( ( frameElData ) => {

			const { frameEl, origin, parentNode } = frameElData;
			const action = 'itemWell:scroll';
			const data = this._getInViewStatus( parentNode, scrollProps ); // Use frame container el.

			// Broadcast scroll event to subscribed frames. If the data is undefined
			// it means the frame is not in view or doesn't need the event.
			if ( data ) {
				postMessage( { action, data, frameEl, origin } );
			}
		} );
	}

	_readWindowProps() {
		return {
			windowProps: {
				uri: {
					hash: window.location.hash,
					href: window.location.href,
					origin: window.location.origin,
					pathname: window.location.pathname,
				},
				clientDimensions: {
					height: document.body.clientHeight,
					width: document.body.clientWidth,
				},
			},
		};
	}

	_readHash() {
		let hash = '';
		const currentHash = window.location.hash;
		const hashPrefix = `#${this.hashPrefix}`;

		if ( currentHash.indexOf( hashPrefix ) === 0 ) {
			hash = currentHash.substring( hashPrefix.length );
		}

		return { hash };
	}

	_scrollToPosition( { data }, frameEl ) {
		const { position } = data;
		const duration = 250;

		let offset = parseInt( position, 10 );

		// If there's no offset, do nothing.
		if ( isNaN( offset ) ) {
			return { error: true };
		}

		// Make sure offset is not out of bounds.
		const { height, top } = frameEl.getBoundingClientRect();
		offset = Math.min( height, Math.max( 0, offset ) );

		// Calculate offset relative to page.
		const scrollOffset = document.documentElement.scrollTop + top + offset;

		// Scroll.
		scrollTo( window, scrollOffset, duration );

		// Return the offset so requestor knows if it changed.
		return {
			error: false,
			offset,
		};
	}

	_updateHash( { data } ) {
		const { hash } = data;

		if ( 'string' === typeof hash ) {
			window.location.hash = `${this.hashPrefix}${hash}`;
			return { hash, error: false };
		}

		return {
			error: 'invalid hash',
			hash: false,
		};
	}

	_updateSpotlight( message ) {
		const { data: { color } } = message;
		const { onUpdateSpotlight } = this.props;

		// push color value into redux store
		onUpdateSpotlight( { color } );
	}

	componentDidMount() {
		const { addMessageListener, addScrollListener, history } = this.props;

		this._setHeaderTabRef();
		this._unlisten = history.listen( this._handleRouteChange );

		addScrollListener( this._handleScroll );
		addMessageListener( { eventHandler: this._registerFrame, eventName: 'child:register' } );
		addMessageListener( { eventHandler: this._readWindowProps, eventName: 'child:readWindowProps' } );
		addMessageListener( { eventHandler: this._readHash, eventName: 'child:readHash' } );
		addMessageListener( { eventHandler: this._updateHash, eventName: 'child:updateHash' } );
		addMessageListener( { eventHandler: this._updateSpotlight, eventName: 'child:updateSpotlight' } );
		addMessageListener( { eventHandler: this._scrollToPosition, eventName: 'child:scrollToPosition' } );
	}

	componentWillUnmount() {

		this._clearChildFrame();

		if ( this._unlisten ) {
			this._unlisten();
		}
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return null;
	}

}

FrameMessagerParent.propTypes = {
	addMessageListener: PropTypes.func.isRequired,
	addScrollListener: PropTypes.func.isRequired,
	currentArticleId: PropTypes.number,
	history: PropTypes.object.isRequired,
	onUpdateSpotlight: PropTypes.func.isRequired,
};

const mapStateToProps = ( { session: { currentArticle } } ) => ( {
	currentArticleId: currentArticle ? decodeRelayId( currentArticle ).id : null,
} );

const mapDispatchToProps = dispatch => ( {
	onUpdateSpotlight: ( { color } ) => {
		dispatch( updateSpotlight( { color } ) );
	},
} );

export default compose(
	connect( mapStateToProps, mapDispatchToProps ),
	withRouter,
	withScroll,
	withPostMessage
)( FrameMessagerParent );
