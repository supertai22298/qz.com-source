import {
    slugify
} from 'helpers/text';
import {
    GTM,
    TRACKING,
    VENT
} from 'helpers/types/tracking';

// CTA names (import when dispatching actions)
export const LOGIN_CTA = 'Login CTA';
export const SUBSCRIBE_CTA = 'Subscribe CTA';
export const SUBSCRIBE_BAR = 'Subscribe Bar';

// Action creators
export const trackCtaClick = ({
    context,
    ctaName,
    post,
    ventName,
    ...trackingData
}) => ({
    [TRACKING]: {
        [GTM]: {
            event: 'CTA',
            eventAction: `Click ${ctaName}`,
            eventCategory: ctaName,
            eventLabel: context,
            ...trackingData,
        },
        [VENT]: {
            event: 'INTERACTION',
            data: {
                method: 'click',
                name: ventName || slugify(ctaName),
                post,
                subtype: context,
                type: 'CTA',
            },
        },
    },
    type: 'TRACK_CTA_CLICK',
});

export const trackCtaView = ({
    context,
    ctaName,
    post,
    ventName,
    ...trackingData
}) => ({
    [TRACKING]: {
        [GTM]: {
            event: 'CTA',
            eventAction: `View ${ctaName}`,
            eventCategory: ctaName,
            eventLabel: context,
            ...trackingData,
        },
        [VENT]: {
            event: 'VIEW',
            data: {
                name: ventName || slugify(ctaName),
                post,
                subtype: context,
                type: 'CTA',
            },
        },
    },
    type: 'TRACK_CTA_VIEW',
});