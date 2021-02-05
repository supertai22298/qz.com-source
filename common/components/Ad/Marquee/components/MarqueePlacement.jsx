import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Marquee } from 'components/Ad/Ad.jsx';
import { marqueeConfig } from 'config/ads';
import withScroll from 'helpers/wrappers/withScroll';

// Store the initial value from config here, since we'll want to overwrite it.
// Never mutate config, it will make you very sad!
let { openByDefault } = marqueeConfig;

class MarqueePlacement extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			loaded: openByDefault,
		};

		this._unlisten = undefined;
		this.onSlotRenderEnded = this.onSlotRenderEnded.bind( this );
		this.onScroll = this.onScroll.bind( this );
	}

	componentDidMount() {
		const { history, onRouteChange } = this.props;
		this._unlisten = history.listen( onRouteChange );
	}

	componentWillUnmount() {
		if ( typeof this._unlisten === 'function' ) {
			this._unlisten();
		}
	}

	onSlotRenderEnded( e ) {
		const { onRenderMarquee, addScrollListener, onActivateMarquee } = this.props;

		onActivateMarquee();

		// Override our *copy* of the config value so that the slot won't open by
		// default on post-initial-load ad slots.
		openByDefault = false;

		this.setState( { loaded: !e.isEmpty } );

		if ( !e.isEmpty ) {
			onRenderMarquee();

			// cache dom selectors
			this.mainEl = document.getElementById( 'main' );
			this.marqueeEl = document.getElementById( 'marquee-ad' );

			// detect marquee in and out of view
			addScrollListener( this.onScroll );
		}
	}

	onScroll() {
		const { top } = this.mainEl.getBoundingClientRect();

		// An offset of 10 pixels accounts for the marquee border.
		const topOffset = -10;

		// New wrapper div for programmatic requires us to go up one more level.
		this.marqueeEl.parentNode.parentNode.style.position = top <= topOffset ? 'absolute' : 'fixed';
	}

	render() {
		const { path, targeting } = this.props;
		const { loaded } = this.state;

		if ( !path.length ) {
			return null;
		}

		return (
			<Marquee
				path={path}
				id="marquee-ad"
				onSlotRenderEnded={this.onSlotRenderEnded}
				targeting={targeting}
				loaded={loaded}
			/>
		);
	}
}

MarqueePlacement.propTypes = {
	addScrollListener: PropTypes.func,
	history: PropTypes.object,
	onActivateMarquee: PropTypes.func,
	onRenderMarquee: PropTypes.func,
	onRouteChange: PropTypes.func,
	path: PropTypes.string,
	targeting: PropTypes.object,
};

export default withScroll( MarqueePlacement );
