import {
    TRACKING
} from 'helpers/types/tracking';
import {
    deprecatedGetFieldEvent,
    getFormEvent,
    getFieldEvent,
    getCodeValidationEvent,
} from './events';

// Form names (import when dispatching actions)
export {
    MEMBERSHIP_SIGNUP,
    PLATFORM_SIGNUP
}
from './events';

// Action creators
export const trackFormFieldFocus = (trackingData, ownProps) => ({
    [TRACKING]: deprecatedGetFieldEvent('click into', trackingData, ownProps),
    type: 'TRACK_FORM_EVENT',
});

export const trackFieldEvent = (trackingData) => ({
    [TRACKING]: getFieldEvent({
        action: 'click',
        ...trackingData
    }),
    type: 'TRACK_FORM_EVENT',
});

export const trackCodeValidation = (ignoredTrackingData, {
    giftCode,
    couponCode,
    code
}) => ({
    [TRACKING]: getCodeValidationEvent({
        giftCode,
        couponCode,
        code
    }),
    type: 'TRACK_FORM_EVENT',
});

export const trackFormSubmit = trackingData => ({
    [TRACKING]: getFormEvent('submit', trackingData),
    type: 'TRACK_FORM_EVENT',
});

export const trackFormView = trackingData => ({
    [TRACKING]: getFormEvent('view', trackingData),
    type: 'TRACK_FORM_EVENT',
});