import {
    defaultRole
} from 'config/users';
import {
    UPDATE_PENDING_REQUEST,
    UPDATE_USER_DATA
} from '../actions/auth';

export const initialState = {
    disableRefresh: false, // Temporary flag to disable client-side refresh for app views
    membership: {}, // Data about the user's membership plan, if any
    pendingRequestId: null, // Identifier for a pending request. Either a string or null if no request is pending
    promotionalContentIds: [], // Content IDs the user has access to (e.g., via email exchange feature)
    tokens: {}, // Auth tokens
    user: {}, // User data
    userRole: defaultRole, // User role
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PENDING_REQUEST:
            return {
                ...state,
                pendingRequestId: action.payload.pendingRequestId,
            };

        case UPDATE_USER_DATA:
            const {
                contentIds,
                membership,
                tokens,
                user,
                userRole
            } = action.payload;

            return {
                ...state,
                membership: membership || initialState.membership,
                pendingRequestId: null,
                promotionalContentIds: contentIds || initialState.promotionalContentIds,
                tokens: tokens || initialState.tokens,
                user: user || initialState.user,
                userRole: userRole || initialState.userRole,
            };
    }

    return state;
};