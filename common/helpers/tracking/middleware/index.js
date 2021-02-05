import send from 'helpers/tracking/send';
import {
    GTM,
    TRACKING,
    VENT
} from 'helpers/types/tracking';

// Redux middleware to inspect every action and, if it contains a tracking
// payload, send it to an analytics service.
export const eventMiddleware = ({
    getState
}) => next => action => {
    // We only want to send events client-side.
    if ('undefined' !== typeof window && 'object' === typeof action[TRACKING]) {
        const appState = getState();
        const trackingData = action[TRACKING];

        // Send events for each event type.
        [GTM, VENT]
        .filter(type => 'object' === typeof trackingData[type])
            .forEach(type => send(type, trackingData[type], appState));
    }

    return next(action);
};

// Link click listener for Vent. GTM has its own click listener, so it doesn't
// make much sense to build our own, especially since the GTM event helpfully
// includes lots of stuff we're interested in. Create a custom event listener
// and pass the data through to Vent.
if ('object' === typeof document) {
    document.addEventListener('VentEvent', evt => send(VENT, evt.detail));
}