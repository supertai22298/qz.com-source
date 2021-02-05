import {
    GTM,
    TRACKING
} from 'helpers/types/tracking';

export const UPDATE_USER_PREFERENCES = 'UPDATE_USER_PREFERENCES';

export const updateUserPreferences = data => ({
    type: UPDATE_USER_PREFERENCES,
    data,
    [TRACKING]: {
        [GTM]: {
            event: 'UserData',
            eventAction: 'User verified',
            eventCategory: 'User data',
            userDataForTracking: {
                hasLoadedUserPreferences: true,
                visitorId: data.visitorId,
            },
        },
    },

});