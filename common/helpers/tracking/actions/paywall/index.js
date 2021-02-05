import {
    GTM,
    TRACKING,
    VENT
} from 'helpers/types/tracking';

export const setPaywallStrategy = ({
    conditions,
    experiment,
    paywallType,
    strategy,
    version
}) => ({
    [TRACKING]: {
        [GTM]: {
            event: 'Paywall',
            eventAction: 'Set paywall strategy',
            eventCategory: 'Paywall',
            eventLabel: paywallType,
            PaywallConditions: conditions,
            PaywallExperiment: experiment,
            PaywallStrategy: strategy,
            PaywallVersion: version,
        },
    },
    type: 'SET_PAYWALL_STRATEGY',
});

// This event is kept as a CTA event for historical reasons but deserves its own
// treatment in tracking actions.
export const trackPaywallView = ({
    context,
    postId
}) => ({
    [TRACKING]: {
        [GTM]: {
            event: 'CTA',
            eventAction: 'View Paywall',
            eventCategory: 'Paywall',
            eventLabel: context,
        },
        [VENT]: {
            event: 'VIEW',
            data: {
                name: 'paywall_subscribe',
                post: postId,
                type: 'CTA',
            },
        },
    },
    type: 'TRACK_CTA_VIEW',
});