import {
    GTM,
    TRACKING
} from 'helpers/types/tracking';

const event = 'EmailSignup';
const eventCategory = 'Email signup';

export const viewNewsletterModule = ({
    listId,
    location
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'View email module',
            eventCategory,
            eventLabel: location ? `${listId}|${location}` : listId,
        },
    },
    type: 'VIEW_NEWSLETTER_MODULE',
});

export const viewNewsletterList = ({
    eventLabel
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'View multi-signup screen',
            eventCategory,
            eventLabel,
        },
    },
    type: 'VIEW_NEWSLETTER_LIST',
});

export const clickNewsletterModule = ({
    listId,
    location
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Click email input',
            eventCategory,
            eventLabel: location ? `${listId}|${location}` : listId,
        },
    },
    type: 'CLICK_NEWSLETTER_MODULE',
});

export const clickNewsletterCheckbox = ({
    ListId
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Click email checkbox',
            eventCategory,
            eventLabel: ListId,
        },
    },
    type: 'CLICK_NEWSLETTER_CHECKBOX',
});

export const submitNewsletterModule = ({
    listIds,
    location
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Submit email signup',
            eventCategory,
            eventLabel: location ? `${listIds.join( '|' )}|${location}` : listIds.join('|'),
        },
    },
    type: 'SUBMIT_NEWSLETTER_MODULE',
});

export const instantNewsletterSignup = ({}, {
    AltIdHash,
    ListId
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'instant',
            eventCategory,
            eventLabel: ListId,
            AltIdHash,
        },
    },
    type: 'INSTANT_EMAIL_SIGNUP',
});

export const submitEmailRegwall = ({
    context
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Submit email regwall',
            eventCategory: 'Regwall',
            eventLabel: context,
        },
    },
    type: 'SUBMIT_EMAIL_REGWALL',
});

export const submitEmailExchange = ({
    context
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Submit email exchange',
            eventCategory: 'Paywall',
            eventLabel: context,
        },
    },
    type: 'SUBMIT_EMAIL_REGWALL',
});