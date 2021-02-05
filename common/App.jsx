import React, { useEffect } from 'react';
import Routes from 'routes';
import styles from './App.scss';
import BottomBar from 'components/BottomBar/BottomBar';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import Link from 'components/Link/Link';
import Notifications from 'components/Notifications/Notifications';
import SessionTrack from 'components/SessionTrack/SessionTrack';
import { setInputIntentClasses } from 'helpers/input-intents';

const App = () => {
	// Initial app setup.
	useEffect( setInputIntentClasses, [] );

	return (
		<ErrorBoundary>
			<Routes />
			<Notifications />
			<BottomBar
				id="old-browser"
				dismissible={false}
				visible={false}
			>
				<Link to="https://browsehappy.com"><span className={styles.browserLink}>Update your browser</span> for the best experience.</Link>
			</BottomBar>
			<SessionTrack />
		</ErrorBoundary>
	);
};

export default App;
