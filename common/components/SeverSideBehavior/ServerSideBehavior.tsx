import { withRouter } from 'react-router-dom';

function ServerSideBehavior ( props: {
	renderStatic?: boolean,
	staticContext,
} ) {
	const {
		renderStatic = false, // a.k.a. disable React (no client-side render or hydration)
		staticContext,
	} = props;

	// Static context only exists on the SSR.
	if ( ! staticContext ) {
		return null;
	}

	// Assign the behavior data to static context, where it can be picked up by the
	// app middleware.
	Object.assign( staticContext, { renderStatic } );

	return null;
}

// React Router does not currently provide a way to get acccess to the SSR
// staticContext using a hook. A Route with a render prop and withRouter are the
// only ways to gain access. Since render props don't mix well with hooks, we'll
// continue using the HOC for now.
export default withRouter( ServerSideBehavior );
