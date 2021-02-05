import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import compose from 'helpers/compose';
import Redirect from 'components/Redirect/Redirect';
import { getErrorContext } from 'helpers/errors';
import { trackError as onError } from 'helpers/tracking/actions';
import { withTracking } from 'helpers/wrappers';
import ErrorPage from '../../pages/Error/Error';

// This error boundary wraps the entire App component and will catch any error
// thrown *client side* within the React lifecycle.
class ErrorBoundary extends Component {
	constructor( props ) {
		super( props );

		// Status code may have been set on the server and passed down.
		const {
			staticContext: {
				statusCode = 200,
			},
		} = props;

		// This mirrors the properties set on react-router staticContext.
		this.state = {
			statusCode,
			url: null,
		};
	}

	// NOTE: getDerivedStateFromError is NOT called on the server in React 16.
	// On the server, we instead catch the error and do a similar inspection of
	// the error to determine what to do. See app middleware for details.
	static getDerivedStateFromError( error ) {
		const errorContext = getErrorContext( error );

		// Client-side, redirects and 404s are the only errors we want to catch and
		// render. All other errors are *unexpected*. We don't want to replace a
		// broken but still potentially useful page with an unhelpful error page.
		if ( [ 301, 302, 404 ].includes( errorContext.statusCode ) ) {
			return errorContext;
		}

		return null;
	}

	// NOTE: componentDidCatch is NOT called on the server in React 16.
	componentDidCatch( error ) {
		console.log( 'Error: ', error );

		// Track error.
		this.props.onError( { error } );
	}

	componentDidUpdate( { location } ) {
		// Clear error if user navigates away.
		if ( location.pathname !== this.props.location.pathname ) {
			this.setState( {
				statusCode: 200,
				url: null,
			} );
		}
	}

	render() {
		const { children, location } = this.props;
		const { statusCode, url } = this.state;

		if ( url ) {
			return <Redirect status={statusCode} to={url} />;
		}

		if ( 200 !== statusCode ) {
			return <ErrorPage location={location} statusCode={statusCode} />;
		}

		return children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.element.isRequired,
	location: PropTypes.object.isRequired,
	onError: PropTypes.func.isRequired,
	staticContext: PropTypes.object.isRequired,
};

ErrorBoundary.defaultProps = {
	staticContext: {}, // only exists on SSR
};

export default compose(
	withRouter,
	withTracking( { onError } )
)( ErrorBoundary );
