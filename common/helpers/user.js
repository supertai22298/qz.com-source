import {
    MEMBERFUL_PLAN_IDS,
    allPlans
} from 'config/membership';
import {
    roles,
    roleProperties,
    defaultRole
} from 'config/users';
import {
    daysFromToday
} from 'helpers/dates';
import {
    encodeRelayId
} from 'helpers/graphql';
import {
    get,
    valueOrDefault
} from 'helpers/utils';
import {
    isValidEmail,
    isValidLengthPassword,
    isValidCharactersPassword
} from 'helpers/validation';
import {
    CANCEL_SUBSCRIPTION,
    CHANGE_PLAN,
    DELETE_ACCOUNT,
    EDIT_BILLING,
    REACTIVATE_SUBSCRIPTION,
} from 'helpers/types/permissions';
import {
    CREDIT_CARD_BRAND,
    CREDIT_CARD_IDENTIFIER,
    CREDIT_CARD_SUMMARY,
    ELIGIBLE_FOR_FREE_TRIAL,
    MEMBERSHIP_DAYS_LEFT,
    MEMBERSHIP_IS_GIFT,
    MEMBERSHIP_IS_SUBSCRIPTION,
    PLAN_DISCOUNTED_DISPLAY_PRICE,
    PLAN_HAS_DISCOUNT,
    PLAN_ID,
    PLAN_INTERVAL,
    PLAN_IS_MEMBERFUL,
    PLAN_NAME,
    PLAN_PLATFORM,
    PLAN_PRICE,
    PLAN_SYMBOL,
    SUBSCRIPTION_ID,
    SUBSCRIPTION_STATUS,
    SUBSCRIPTION_WILL_CANCEL,
    USER_COMPANY,
    USER_EMAIL,
    USER_HAS_SET_PASSWORD,
    USER_ID,
    USER_INDUSTRY_ID,
    USER_JOB_LEVEL_ID,
    USER_NAME,
    USER_TITLE,
    USER_PROFILE,
    USER_RELAY_ID,
    USER_ROLE,
} from 'helpers/types/account';

/**
 * Creates a random password
 * @return {String}
 */
export const generateRandomPassword = () => Math.random().toString(36).slice(-8);

/**
 * Formats both decimal and non decimal prices
 * @return { String }
 */
export const formatPrice = ({
    decimal = true,
    price
}) => decimal ? (price / 100).toFixed(2) : price.toLocaleString();

/**
 * Takes an email an returns an array of error messages if it's invalid
 * @param  {String} email
 * @return {array}
 */
export const validateEmail = (email) => {

    const errors = [];

    if (!email) {
        errors.push('Please provide an email address.');
    }

    if (!isValidEmail(email)) {
        errors.push('Please provide a valid email address.');
    }

    return errors;
};

/**
 * Ensures the provided string is non-empty when trimmed
 * @param  {String} value
 * @return {array}
 */
export const validateRequiredField = value => {
    const errors = [];

    if (!value.trim()) {
        errors.push('This field is required');
    }

    return errors;
};

export const PASSWORD_LENGTH_ERROR = 'Password must be between 6 and 20 characters';

/**
 * Takes a password and makes sure its considered valid
 * @param  {String} password
 * @return {array}
 */
export const validatePassword = (password) => {

    const errors = [];

    if (!password || !isValidLengthPassword(password)) {
        errors.push(PASSWORD_LENGTH_ERROR);
    }

    if (password && !isValidCharactersPassword(password)) {
        errors.push('Password must only contain letters, numbers, or symbols.');
    }

    return errors;
};

/**
 * Get a user attribute. This allows us to update schema while keeping the logic
 * in one place (similar to userHasPermission).
 *
 * @param  {Object} user      User data
 * @param  {String} attribute Attribute to retrieve
 * @return {mixed}
 */
export const getUserAttribute = (user = {}, attribute) => {
    switch (attribute) {
        case ELIGIBLE_FOR_FREE_TRIAL:
            // $%*! three-state booleans strike again! This could be true, false, or undefined (aka we don't know yet).
            // Return true unless proven otherwise
            return user.eligibleForFreeTrial !== false;

        case USER_EMAIL:
            return user.email;

        case USER_HAS_SET_PASSWORD:
            return !user.hasRandomPassword;

        case USER_NAME:
            return user.firstName;

        case USER_TITLE:
            return user.title;

        case USER_COMPANY:
            return user.company;

        case USER_ID:
            return user.userId;

        case USER_INDUSTRY_ID:
            return user.industry ? .id;

        case USER_JOB_LEVEL_ID:
            return user.jobLevel ? .id;

        case USER_PROFILE:
            return user.profile;

        case USER_RELAY_ID:
            return user.userId && encodeRelayId('user', user.userId);

        case USER_ROLE:
            if ([roles.MEMBER, roles.USER].includes(user.role)) {
                return user.role;
            }

            return roles.READER;

        default:
            throw new Error(`"${attribute}" is not a user attribute`);
    }
};

/**
 * Get a user setting. These values require an extra API call to /user/settings
 * for detailed membership and billing data.
 *
 * @param  {Object} user     User data
 * @param  {String} setting  Setting to retrieve
 * @return {mixed}
 */
export const getUserSetting = (user = {}, setting, language) => {
    const {
        membership = {}
    } = user;
    const {
        subscription = {}, plan = {}
    } = membership;
    const {
        amount,
        currency,
        id: planId
    } = plan;
    const {
        duration,
        amountOff,
        percentOff
    } = get(subscription, 'discount.coupon', {});

    // Is this a decimal currency?
    const {
        priceDec
    } = allPlans[planId] || {};
    // Check currency for plans that aren't in our list (like mobile plans)
    const decimal = !!priceDec || ['gbp', 'usd', 'inr'].includes(currency);

    switch (setting) {
        case CREDIT_CARD_SUMMARY:
            return valueOrDefault(
                user.defaultCard,
                'unknown',
                'ja' === language ?
                ({
                    brand,
                    expMonth,
                    expYear,
                    last4
                }) => `末尾4桁が${last4}の${brand}: ${expMonth}/${expYear}` :
                ({
                    brand,
                    expMonth,
                    expYear,
                    last4
                }) => `${brand} ending in ${last4}, exp: ${expMonth}/${expYear}`
            );

        case CREDIT_CARD_BRAND:
            return valueOrDefault(user.defaultCard.brand, 'unknown');

        case CREDIT_CARD_IDENTIFIER:
            return user.defaultCard ? Object.values(user.defaultCard).reduce((acc, key) => acc + key, '') : null;

        case MEMBERSHIP_DAYS_LEFT:
            return valueOrDefault(membership.currentPeriodEnd, 'unknown', daysFromToday);

        case MEMBERSHIP_IS_GIFT:
            return !!get(user, 'membership.gift.code');

        case PLAN_ID:
            return planId;

        case PLAN_IS_MEMBERFUL:
            const memberful = MEMBERFUL_PLAN_IDS.includes(planId);
            return !!memberful;

        case PLAN_NAME:
            return valueOrDefault(plan.nickname, 'unknown');

        case PLAN_PLATFORM:
            return valueOrDefault(plan.platform, 'unknown');

        case PLAN_PRICE:
            // If your coupon is forever, show the forever (discounted) price.
            if (duration === 'forever') {
                if (amountOff) {
                    return formatPrice({
                        price: amount - amountOff,
                        decimal,
                    });
                }

                if (percentOff) {
                    return formatPrice({
                        price: amount * (100 - percentOff) / 100,
                        decimal,
                    });
                }
            }

            return valueOrDefault(amount, 'unknown', amount => formatPrice({
                price: amount,
                decimal
            }));

        case PLAN_DISCOUNTED_DISPLAY_PRICE:
            // If your coupon isn't permanent, you have a discounted price.
            // We treat our permanent coupons more like price adjustments.
            if (duration !== 'forever') {
                if (amountOff) {
                    return formatPrice({
                        price: amount - amountOff,
                        decimal,
                    });
                }

                if (percentOff) {
                    return formatPrice({
                        price: amount * (100 - percentOff) / 100,
                        decimal,
                    });
                }
            }

            return null;

        case PLAN_HAS_DISCOUNT:
            return !!subscription.discount;

            // Monthly/yearly plan adjective for descriptions
        case PLAN_INTERVAL:
            return valueOrDefault(planId, null, planId => {
                if (!allPlans[planId]) {
                    return null;
                }
                if (allPlans[planId].yearly) {
                    return 'Yearly';
                }
                if (allPlans[planId].monthly) {
                    return 'Monthly';
                }
            });

        case PLAN_SYMBOL:
            const currencyConverter = {
                jpy: '¥',
                usd: '$',
                inr: '₹',
                gbp: '£',
            };
            return currencyConverter[currency];

        case SUBSCRIPTION_ID:
            return valueOrDefault(subscription.id, 'unknown');

        case MEMBERSHIP_IS_SUBSCRIPTION:
            return !!subscription.id;

        case SUBSCRIPTION_STATUS:
            // We are transitioning from *just* using the plan status to also
            // looking at the cancelAtPeriodEnd. This lets us do things like
            // uncancel a subscription.
            if (subscription.cancelAtPeriodEnd) {
                return 'canceled';
            }

            return valueOrDefault(subscription.status, 'unknown');

        case SUBSCRIPTION_WILL_CANCEL:
            return valueOrDefault(subscription.cancelAtPeriodEnd, false);

        default:
            throw new Error(`"${setting}" is not a user setting`);
    }
};

/**
 * Determine whether a user has a permission.
 *
 * @param  {Object} user        User data
 * @param  {String} permission  A permission to test for
 * @return {Boolean}
 */
export const userHasPermission = (user, permission) => {
    const userHasSubscription = !!get(user, 'membership.subscription.id');
    const userCanReactivateSubscription = getUserSetting(user, SUBSCRIPTION_WILL_CANCEL);
    const userHasGift = getUserSetting(user, MEMBERSHIP_IS_GIFT);
    const userIsMemberful = getUserSetting(user, PLAN_IS_MEMBERFUL);

    const platformIsWeb = 'web' === getUserSetting(user, PLAN_PLATFORM);
    const planStatus = getUserSetting(user, SUBSCRIPTION_STATUS);
    const subscriptionIsActiveOrTrialing = ['active', 'trialing', 'past_due'].includes(planStatus);

    switch (permission) {
        case CANCEL_SUBSCRIPTION:
            return platformIsWeb &&
                subscriptionIsActiveOrTrialing &&
                !userHasGift &&
                !userCanReactivateSubscription;

        case CHANGE_PLAN:
            return userHasSubscription &&
                !getUserSetting(user, PLAN_DISCOUNTED_DISPLAY_PRICE) &&
                subscriptionIsActiveOrTrialing;

        case DELETE_ACCOUNT:
            return !userHasSubscription && !userHasGift && !userIsMemberful;

        case EDIT_BILLING:
            // Only web plans and when card is present.
            return !!(platformIsWeb && user.defaultCard && !userHasGift);

        case REACTIVATE_SUBSCRIPTION:
            return platformIsWeb && userCanReactivateSubscription;
    }

    return false;
};

/**
 * Validate form fields to ensure the data is the way we want it
 * @param  {String} email
 * @param  {String} password
 * @return {array}
 */
export const validateFormFields = (email, password) => ({
    email: validateEmail(email),
    password: validatePassword(password),
});

export const userTitle = (title, organization) => title && organization ?
    `${title} at ${organization}` :
    title || organization;

/**
 * Helper function for finding a user's social connection status. Given
 * a user object and provider, returns a boolean denoting whether the
 * user's account has a connection to a social media account from the
 * provider.
 *
 * @param {Object} user User profile object
 * @param {String} provider Lower case name of provider, e.g. facebook, linkedin
 * @return {Boolean}
 */
export const userHasSocialConnection = (user, provider) => {
    switch (provider) {
        case 'apple':
            return get(user, 'socialStatus.hasApple', false);
        case 'facebook':
            return get(user, 'socialStatus.hasFacebook', false);
        case 'linkedin':
            return get(user, 'socialStatus.hasLinkedIn', false);
        case 'twitter':
            return get(user, 'socialStatus.hasTwitter', false);
    }

    return false;
};

export const getRoleProperties = role => roleProperties[role] || roleProperties[defaultRole];