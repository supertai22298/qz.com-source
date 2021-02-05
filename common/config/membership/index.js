/**
 * An object representing customer-facing membership plan options, keyed by id.
 */
export const subscriptionPlans = {
    1: {
        countryCode: 'us',
        id: 1,
        planName: 'Standard plan',
        price: '$14.99',
        priceInt: 15,
        priceDec: 1499,
        interval: 'month',
        monthly: true,
        type: 'monthly',
    },
    10: {
        id: 10,
        countryCode: 'us',
        bannerText: 'popular',
        planName: 'Yearly plan',
        price: '$99.99',
        priceInt: 100,
        priceDec: 9999,
        interval: 'year',
        yearly: true,
        type: 'yearly',
    },
    14: {
        id: 14,
        countryCode: 'gb',
        planName: 'Standard plan',
        price: '£12',
        priceInt: 12,
        priceDec: 1200,
        interval: 'month',
        monthly: true,
        type: 'monthly',
    },
    15: {
        id: 15,
        countryCode: 'gb',
        bannerText: 'popular',
        planName: 'Yearly plan',
        price: '£80',
        priceInt: 80,
        priceDec: 8000,
        interval: 'year',
        yearly: true,
        type: 'monthly',
    },
    16: {
        id: 16,
        countryCode: 'in',
        planName: 'Standard plan',
        price: '₹1,000',
        priceInt: 1000,
        priceDec: 100000,
        interval: 'month',
        monthly: true,
        type: 'monthly',
    },
    17: {
        id: 17,
        countryCode: 'in',
        bannerText: 'popular',
        planName: 'Yearly plan',
        price: '₹7,000',
        priceInt: 7000,
        priceDec: 700000,
        interval: 'year',
        yearly: true,
        type: 'yearly',
    },
    18: {
        id: 18,
        countryCode: 'jp',
        planName: '月額プランから始める',
        price: '¥1,000',
        priceInt: 1000,
        interval: '月',
        monthly: true,
        type: 'monthly',
    },
    19: {
        id: 19,
        countryCode: 'jp',
        bannerText: 'popular',
        planName: '年割プランで2000円お得',
        price: '¥10,000',
        priceInt: 10000,
        interval: '年',
        yearly: true,
        type: 'yearly',
    },
};

export const giftPlans = {
    7: {
        id: 7,
        planName: '3 months',
        price: '$29.99',
        priceInt: 30,
        priceDec: 2999,
        interval: '3 months',
    },
    8: {
        id: 8,
        bannerText: 'popular',
        planName: '1 year',
        price: '$99.99',
        priceInt: 100,
        priceDec: 9999,
        popular: true,
        interval: 'year',
    },
    9: {
        id: 9,
        planName: '2 years',
        price: '$149.99',
        priceInt: 150,
        priceDec: 14999,
        interval: '2 years',
    },
};

export const deprecatedPlans = {
    2: {
        id: 2,
        countryCode: 'us',
        price: '$99.99',
        priceInt: 100,
        priceDec: 9999,
        interval: 'year',
        yearly: true,
    },
};

export const allPlans = { ...subscriptionPlans,
    ...giftPlans,
    ...deprecatedPlans
};

export const giftPlanIds = Object.keys(giftPlans);

export const freeTrialLength = 7;

export const stripeClientKey = process.env.STRIPE_CLIENT_KEY;

export const MEMBERFUL_PLAN_IDS = [10003, 10004, 20, 21];
export const MEMBERFUL_URL = 'https://qz.memberful.com/account/subscriptions';

// Number of blocks to show when paywall is in effect.
export const PAYWALL_BLOCKS_LIMIT = 3;

export const membershipSocialImage = 'https://cms.qz.com/wp-content/uploads/2020/10/subscribe_gif.gif';

// coupon string for universale sale seen on the payment step of the subscribe flow.
export const offerCode = 'QZTWENTY';

// Text description of the discount applied by the universal sale. This is a
// string for messaging, not a math value.
export const offerCodeDiscount = '20%';
export const offerCodeCtaText = 'Start free trial';

// Number of articles a user can read before they see the metered paywall.
// (only if the dynamic paywall is disabled). This limit is inclusive, meaning
// the metered paywall should be triggered after it is reached (> and not >=).
export const METERED_PAYWALL_LIMIT = 2;

export const PAYWALL_DYNAMIC = 'PAYWALL_DYNAMIC';
export const PAYWALL_EMAIL_EXCHANGE = 'PAYWALL_EMAIL_EXCHANGE';
export const PAYWALL_HARD = 'PAYWALL_HARD';
export const PAYWALL_MEMBER_UNLOCK = 'PAYWALL_MEMBER_UNLOCK';