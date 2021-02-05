import {
    roles
} from 'config/users';
import {
    log
} from 'helpers/debug';
import {
    generateId
} from 'helpers/math';
import {
    GTM,
    VENT
} from 'helpers/types/tracking';
import pushGtm from './gtm';
import pushVent from './vent';
import universalGtm from '../processors/gtm/universal';
import universalVent from '../processors/vent/universal';

// We will implement a dirt-simple queue that simply stacks up events to send.
const queue = [];

// We don't have user data when the client boots, but we may have it later.
const user = {
    hasLoadedUserPreferences: false,
    hasLoadedUserData: false,
    userId: null,
    userRole: roles.READER,
    sessionId: generateId(),
    visitorId: null,
};

/**
 * Temporary function to provide legacy data layer variables until we cache
 * expires and we can update GTM.
 */
function mapLegacyGtmVariables(data) {
    const {
        articleId: id,
        pixelDepth: PixelDepth,
    } = data;

    const legacy = {
        id,
        PixelDepth,
    };

    // Only map defined values.
    Object.keys(legacy).forEach(key => legacy[key] === undefined && delete legacy[key]);

    return {
        ...data,
        ...legacy,
    };
}

// Event helpers for each event type.
const eventHelpers = {
    [GTM]: {
        enqueue: (type, event, appState) => queue.push({
            event: mapLegacyGtmVariables(universalGtm(event, appState)),
            type,
        }),
        mapUserData: event => Object.assign(event, {
            clientId: user.visitorId, // temporarily duplicate while we migrate GTM
            sessionId: user.sessionId,
            UserId: user.userId,
            UserIsLoggedIn: [roles.MEMBER, roles.USER].includes(user.userRole),
            UserIsMember: roles.MEMBER === user.userRole,
            visitorId: user.visitorId,
        }),
        send: pushGtm,
    },
    [VENT]: {
        enqueue: (type, event) => queue.push({
            event: universalVent(event),
            type,
        }),
        mapUserData: event => Object.assign(event, {
            cookie: user.visitorId,
            user: user.userId,
        }),
        send: pushVent,
    },
};

/**
 * Process the queue, enhancing events with user data, when available.
 */
const processQueue = () => {
    // No events? Nothing to do.
    if (0 === queue.length) {
        return;
    }

    // Still waiting for user data or preferences? Wait some more.
    if (!user.hasLoadedUserData || !user.hasLoadedUserPreferences) {
        return;
    }

    // Enhance with user data and ship.
    queue.splice(0)
        .forEach(({
            event,
            type
        }) => {
            const {
                mapUserData,
                send
            } = eventHelpers[type];
            const data = mapUserData(event);

            send(data);
            log('TRACKING', data, type);
        });
};

// In case the request for user data fails, set a timeout to ship it anyway. Try
// to ship any queued events before the page is unloaded.
if ('object' === typeof window) {
    setTimeout(() => {
        Object.assign(user, {
            hasLoadedUserData: true,
            hasLoadedUserPreferences: true
        });
        processQueue();
    }, 5000);

    window.addEventListener('unload', processQueue);
}

/**
 * Ship events to various analytics services. Decorate with additional data
 * depending on event type.
 *
 * @param  {string}       type     Event type (e.g., GTM)
 * @param  {array|object} event    Event data
 * @param  {object}       appState Redux application state
 * @return {undefined}
 */
export default (type, event, appState = {}) => {
    // A special event fires when we the user's data is returned from the API (or
    // when we know the user is not logged in). We use this event to update our
    // local cache of user data and start processing the queue.
    if (event.userDataForTracking) {
        Object.assign(user, event.userDataForTracking);

        // Only ship this special event if it represents loading user data for a
        // logged-in user.
        if (!event.userDataForTracking.userId) {
            return;
        }
    }

    const {
        enqueue
    } = eventHelpers[type];

    // Event data can be an object or array of objects.
    if (Array.isArray(event)) {
        event.forEach(obj => enqueue(type, obj, appState));
    } else {
        enqueue(type, event, appState);
    }

    processQueue();
};