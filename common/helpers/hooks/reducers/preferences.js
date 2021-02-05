import {
    UPDATE_USER_PREFERENCES
} from '../actions/preferences';

export const initialState = {
    // Whether the user's preferences have been loaded from the API.
    hasLoaded: false,

    preferredEdition: 'quartz',

    // A semi-permanent visitor ID is kept in cookies and is used for various
    // analytical purposes.
    visitorId: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER_PREFERENCES:
            return {
                ...state,
                ...action.data,
                hasLoaded: true,
            };
    }

    return state;
};