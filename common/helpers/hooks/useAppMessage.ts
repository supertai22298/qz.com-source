import { useEffect } from 'react';

/**
 * Send messages to the iOS app via a WebKit script message.
*/
export default function useAppMessage( { hasPaywall, logoVariant }: {
	hasPaywall?: boolean;
	logoVariant?: string;
} ) {
	interface WebKitWindow extends Window {
		webkit?: any;
	}

	useEffect( () => {
		if ( undefined !== hasPaywall ) {
			( window as WebKitWindow )?.webkit?.messageHandlers?.paywallDisplayed?.postMessage?.( hasPaywall );
		}
	}, [ hasPaywall ] );
	useEffect( () => {
		if ( undefined !== logoVariant ) {
			( window as WebKitWindow )?.webkit?.messageHandlers?.logoVariant?.postMessage?.( logoVariant );
		}
	}, [ logoVariant ] );
}
