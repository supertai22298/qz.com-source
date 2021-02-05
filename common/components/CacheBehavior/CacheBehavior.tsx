import { useParams, withRouter } from 'react-router-dom';
import { dedupe } from 'helpers/utils';

export function CacheBehavior ( props: {
	additionalKeys?: string[],
	baseKey: string,
	maxAge?: number,
	staticContext,
} ) {
	const {
		additionalKeys = [],
		baseKey,
		maxAge: expiry = 300,
		staticContext,
	} = props;

	// We use the base cache key to construct more specific cache keys that can
	// narrowly target specific pages. This requires the routes to use one of
	// these named params.
	//
	// For example, a base key of "post" and a route param of "postId" matching
	// "12345" would result in a paramKey of "post-12345".
	//
	// The primary benefit of doing this at the route level is that we ensure that
	// the cache keys get attached to errors and redirects, in addition to
	// successful responses.
	const { edition, postId, slug } = useParams();

	// Static context only exists on the SSR.
	if ( ! staticContext ) {
		return null;
	}

	// The first cache key in the array is special. Given a URL, the first cache
	// key will be purged by the cache purge bot, e.g., "post-12345". When using
	// this component, make sure that the first cache key is not too general.
	const paramKeys = [ postId, slug, edition ].filter( Boolean ).map( param => `${baseKey}-${param}` );
	const cacheBehavior = {
		...staticContext.cacheBehavior,
		expiry,
		surrogateKeys: dedupe( [
			...paramKeys,
			baseKey,
			...additionalKeys,
			...staticContext.cacheBehavior.surrogateKeys, // Preserve any keys added elsewhere.
		] ),
	};

	// Assign the cache data to static context, where it can be picked up by the
	// app middleware.
	Object.assign( staticContext, { cacheBehavior } );

	return null;
}

// React Router does not currently provide a way to get acccess to the SSR
// staticContext using a hook. A Route with a render prop and withRouter are the
// only ways to gain access. Since render props don't mix well with hooks, we'll
// continue using the HOC for now.
export default withRouter( CacheBehavior );
