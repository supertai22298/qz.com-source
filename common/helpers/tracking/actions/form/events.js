import {
    allPlans
} from 'config/membership';
import {
    uppercaseFirstLetter as uc
} from 'helpers/text';
import {
    GTM
} from 'helpers/types/tracking';

export const MEMBERSHIP_SIGNUP = 'MembershipSignup';
export const PLATFORM_SIGNUP = 'PlatformSignup';

// Map of event names to event categories. This is a little silly but we're
// trying to be backwards-compatible.
const eventCategories = {
    [MEMBERSHIP_SIGNUP]: 'Membership signup',
    [PLATFORM_SIGNUP]: 'Platform signup',
};

// Transform data from membership signup forms to Tag Manager variables.
const transformMembershipData = (formName, planId, stageName, trialDuration, listIds) => {
    if (MEMBERSHIP_SIGNUP !== formName || !planId || !allPlans[planId]) {
        return {};
    }

    const {
        priceInt: membershipPrice,
        interval: membershipPackage
    } = allPlans[planId];
    const membershipType = 'standard'; // may add other types in the future like student

    const membershipInfo = {
        membershipPackage, // monthly / yearly
        membershipPrice, // price as integer
        membershipType,
    };

    // This is a temporary custom dimension for our A/B test of various free trial lengths
    if ('payment' === stageName) {
        membershipInfo.trialDuration = trialDuration;
    }

    if (listIds) {
        membershipInfo.ListId = listIds;
    }

    return membershipInfo;
};

// Map our action payload to a GTM event
const deprecatedGetFieldData = (action, {
    context,
    formName,
    moduleName
}, {
    fieldName
}) => ({
    [GTM]: {
        // The event key (for form events, this is the name of the form)
        event: formName,
        // The event category (for form events, this is very similar to the name of the form)
        eventCategory: eventCategories[formName],
        // A sentence describing the action (e.g. "Click into email field")
        eventAction: `${uc( action )} ${moduleName || `${fieldName} field`}`,
        // Optional context
        eventLabel: context,
    },
});

let previousFieldEventSignature;

export const deprecatedGetFieldEvent = (action, {
    context,
    formName,
    moduleName
}, {
    fieldName
}) => {
    const eventSignature = `${action}+${formName}+${moduleName || fieldName}+${context}`;

    if (previousFieldEventSignature === eventSignature) {
        return {};
    }

    previousFieldEventSignature = eventSignature;

    return deprecatedGetFieldData(action, {
        context,
        formName,
        moduleName
    }, {
        fieldName
    });
};

// Map our tracking data to a GTM event.
export const getFieldEvent = ({
    action,
    context,
    formName,
    moduleName,
    fieldName
}) => {
    const eventSignature = `${action}+${formName}+${moduleName || fieldName}+${context}`;

    if (previousFieldEventSignature === eventSignature) {
        return {};
    }

    previousFieldEventSignature = eventSignature;

    return {
        [GTM]: {
            // The event key (for form events, this is the name of the form)
            event: formName,
            // The event category (for form events, this is very similar to the name of the form)
            eventCategory: eventCategories[formName],
            // A sentence describing the action (e.g. "Click into email field")
            eventAction: `${uc( action )} ${moduleName || `${fieldName} field`}`,
            // Optional context
            eventLabel: context,
        },
    };
};

export const getFormEvent = (action, {
    context,
    formName,
    stageName = '',
    trialDuration,
    listIds,
    planId
}) => ({
    [GTM]: {
        event: formName,
        eventCategory: eventCategories[formName],
        eventAction: `${uc( action )} ${stageName} form`.replace(/ +/g, ' '), // remove extra spaces
        eventLabel: context,
        ...transformMembershipData(formName, planId, stageName, trialDuration, listIds),
    },
});

export const getCodeValidationEvent = (trackingData) => {
    const formName = MEMBERSHIP_SIGNUP;
    let eventAction;
    let eventLabel;

    const {
        code,
        giftCode,
        couponCode
    } = trackingData;

    if (!(code || couponCode || giftCode)) {
        return {};
    }

    if (code) {
        eventAction = 'Submit invalid code';
        eventLabel = code;
    }

    if (giftCode) {
        eventAction = 'Submit valid gift';
        eventLabel = giftCode;
    }

    if (couponCode) {
        eventAction = 'Submit valid coupon';
        eventLabel = couponCode;
    }

    return {
        [GTM]: {
            event: formName,
            eventCategory: eventCategories[formName],
            eventAction,
            eventLabel,
        },
    };
};