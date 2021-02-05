import { Component } from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';

class MarqueeDefinition extends Component {
	componentDidUpdate( prevProps ) {
		const { path, onFetchMarquee, targeting } = this.props;

		// So that the we change marquee definition in redux store only when
		// path and targeting are actually different
		if ( path !== prevProps.path || !deepEqual( targeting, prevProps.targeting ) ) {
			onFetchMarquee( { path, targeting } );
		}
	}

	componentDidMount() {
		const { path, onFetchMarquee, targeting } = this.props;
		onFetchMarquee( { path, targeting } );
	}

	render() {
		return null;
	}
}

MarqueeDefinition.propTypes = {
	onFetchMarquee: PropTypes.func,
	path: PropTypes.string,
	targeting: PropTypes.object,
};

export default MarqueeDefinition;
