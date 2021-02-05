import {
    GTM,
    TRACKING
} from 'helpers/types/tracking';

const event = 'Success';

// Action creators
export const trackEmailRegwallSuccess = ({
    context
}, {
    altIdHash: AltIdHash
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Submit email regwall',
            eventCategory: 'Conversion',
            eventLabel: context,
            AltIdHash,
        },
    },
    type: 'TRACK_EMAIL_REGWALL_SUCCESS',
});

export const trackEmailExchangeSuccess = ({
    context
}, {
    altIdHash: AltIdHash
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Submit email exchange',
            eventCategory: 'Conversion',
            eventLabel: context,
            AltIdHash,
        },
    },
    type: 'TRACK_EMAIL_EXCHANGE_SUCCESS',
});

export const trackEmailFormSuccess = ({
    context
}, {
    altIdHash: AltIdHash
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Submit email form',
            eventCategory: 'Conversion',
            eventLabel: context,
            AltIdHash,
        },
    },
    type: 'TRACK_EMAIL_FORM_SUCCESS',
});

export const trackBOGOConversionSuccess = () => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Converted with BOGO offer',
            eventCategory: 'Membership signup',
            eventLabel: '3 months',
        },
    },
    type: 'TRACK_MEMBERSHIP_PAYMENT_SUCCESS',
});

export const trackMembershipPaymentSuccess = (ignored, {
    altIdHash: AltIdHash,
    subscriptionId
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Submit payment information',
            eventCategory: 'Conversion',
            eventLabel: subscriptionId,
            AltIdHash,
        },
    },
    type: 'TRACK_MEMBERSHIP_PAYMENT_SUCCESS',
});

export const trackMembershipBillingUpdateSuccess = ({
    context
}) => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Submit manage billing',
            eventCategory: 'Membership signup',
            eventLabel: context,
        },
    },
    type: 'TRACK_MEMBERSHIP_BILLING_UPDATE',
});

export const trackPaymentReactivationSuccess = () => ({
    [TRACKING]: {
        [GTM]: {
            event,
            eventAction: 'Submit reactivate billing',
            eventCategory: 'Membership signup',
            eventLabel: 'settings',
        },
    },
    type: 'TRACK_PAYMENT_REACTIVATION_SUCCESS',
});