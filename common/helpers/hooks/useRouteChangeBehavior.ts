import { useEffect, useRef } from 'react';
import { makeTabbableOnceAndFocus as focus } from 'helpers/dom';
import { useLocation } from 'react-router-dom';

export default function useRouteChangeBehavior() {
	const { hash, pathname } = useLocation();
	const appRef = useRef<HTMLDivElement>( null );

	// Simulate native browser behavior when the path or hash changes by
	// either:
	//
	// 1. Scrolling to the top of the page and refocusing <main>, or
	//
	// 2. If there is a hash in the location that references an element in the
	//    DOM, scrolling to that element and focusing it.
	useEffect( () => {
		// By running this inside a 1ms setTimeout we are effectively
		// waiting until the browser is ready for us to inspect the DOM
		// and perform our scrolling and focusing.
		window.setTimeout( () => {
			// Get the window location hash without the '#'
			const hashPart = hash?.substring( 1 );

			if ( hashPart ) {
				// Query for an element with an id or name attribute that
				// matches the hash part in the window location
				const elByHash = document.querySelector( `#${hashPart}, [name="${hashPart}"]` );

				// If an element was found, make that our new scroll and focus target,
				// accounting for the height of the overlaid nav bar via a CSS rule
				// (scroll-padding-top) on the html element.
				if ( elByHash ) {
					focus( elByHash );
					elByHash.scrollIntoView();
					return;
				}
			}

			// It's important to scroll after focusing because Safari <=11 will scroll
			// when focusing.
			focus( appRef.current );
			window.scrollTo( 0, 0 );
		}, 1 );
	}, [ hash, pathname ] );

	return appRef;
}
