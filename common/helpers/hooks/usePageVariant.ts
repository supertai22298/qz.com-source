import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { queryParams } from 'helpers/queryParams';

export default function usePageVariant () {
	const { edition, locale, preview, variant } = useParams();
	const [ isInAppRequest, setIsInAppRequest ] = useState( false );

	useEffect( () => {
		const { client } = queryParams;

		// Our iOS app appends `client=ios` to in-app webviews of qz.com. This
		// allows us to determine if current session is inside an in-app webview.
		// Useful so that we can show the "in-app" page variant as they click around
		// the site, even if they didn't enter on a URL with an app route parameter.
		if ( 'ios' === client ) {
			setIsInAppRequest( true );
		}
	}, [] );

	return {
		edition: edition || 'quartz',
		isAmp: 'amp' === variant,
		isInApp: isInAppRequest || 'app' === variant,
		language: 'japan' === locale ? 'ja' : 'en',
		isPreview: 'preview' === preview,
	};
}
