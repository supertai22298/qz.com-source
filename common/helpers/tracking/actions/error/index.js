import {
    GTM,
    TRACKING
} from 'helpers/types/tracking';

const getErrorDescription = err => [
    err.name,
    err.fileName,
    err.lineNumber,
    err.message,
].filter(Boolean).join('|');

// Action creators
export const trackError = (_, __, {
    error
}) => ({
    [TRACKING]: {
        [GTM]: {
            event: 'JavaScript Error',
            eventAction: error.name || 'UnknownError',
            eventCategory: 'JavaScript Error',
            eventLabel: getErrorDescription(error),
        },
    },
    type: 'TRACK_ERROR',
});