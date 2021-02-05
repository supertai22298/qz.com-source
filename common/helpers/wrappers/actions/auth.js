import {
    USER_ID,
    USER_ROLE
} from 'helpers/types/account';
import {
    GTM,
    TRACKING
} from 'helpers/types/tracking';
import {
    getUserAttribute
} from 'helpers/user';

export const UPDATE_MEMBERSHIP_DATA = 'UPDATE_MEMBERSHIP_DATA';
export const UPDATE_PENDING_REQUEST = 'UPDATE_PENDING_REQUEST';
export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';

export const updatePendingRequest = pendingRequestId => ({
    type: UPDATE_PENDING_REQUEST,
    payload: {
        pendingRequestId,
    },
});

export const updateUserData = data => ({
    type: UPDATE_USER_DATA,
    payload: data,
    // This allows us to add user information to tracking events.
    [TRACKING]: {
        [GTM]: {
            event: 'UserData',
            eventAction: 'User verified',
            eventCategory: 'User data',
            userDataForTracking: {
                hasLoadedUserData: true,
                userId: getUserAttribute(data.user, USER_ID) || null,
                userRole: getUserAttribute(data.user, USER_ROLE),
            },
        },
    },
});