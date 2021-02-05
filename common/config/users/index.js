// User intents for registration flows.
export const MEMBERSHIP_SIGNUP_INTENT = 'MEMBERSHIP_SIGNUP_INTENT';
export const JAPAN_SIGNUP_INTENT = 'JAPAN_SIGNUP_INTENT';

export const roles = {
    MEMBER: 'member', // member (has access to premium content)
    READER: 'reader', // no credentials
    USER: 'user', // logged-in but not a member
};

export const roleProperties = {
    [roles.MEMBER]: {
        isMember: true,
        isLoggedIn: true,
    },
    [roles.USER]: {
        isMember: false,
        isLoggedIn: true,
    },
    [roles.READER]: {
        isLoggedIn: false,
        isMember: false,
    },
};

export const defaultRole = roles.READER;