import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { eventMiddleware } from 'helpers/tracking/middleware';

// Reducers:
import auth from 'helpers/wrappers/reducers/auth';
import experiments from 'components/Experiment/reducers/experiments';
import marquee from 'components/Ad/Marquee/reducer/marqueeReducer';
import modal from 'helpers/wrappers/reducers/modal';
import notifications from 'components/Notifications/reducer';
import preferences from 'helpers/hooks/reducers/preferences';
import session from 'helpers/wrappers/reducers/session';
import spotlight from 'components/Ad/Spotlight/reducer/spotlightReducer';

// Dummy reducer for state that never gets updated.
const dummyReducer = ( state = {} ) => state;

export default function configureStore( initialState = {} ) {
	const rootReducer = combineReducers( {
		amp: dummyReducer,
		auth,
		experiments,
		features: dummyReducer,
		marquee,
		modal,
		notifications,
		preferences,
		session,
		spotlight,
	} );

	const enhancers = [
		applyMiddleware( eventMiddleware ),
	];

	const store = createStore(
		rootReducer,
		initialState,
		composeWithDevTools( ...enhancers )
	);

	return store;
}
