import {
    getQueryParams
} from 'helpers/urls';

// Called only once in outer scope. Use the HOC or getQueryParamData instead
// of importing this directly.
export const queryParams = getQueryParams();

export const isEmailOffer = ({
    utm_source,
    utm_medium,
    utm_campaign
}) => {
    const utm_sources = [
        'from.flipboard.com',
        'getpocket.com',
        'smart.news.com',
        'linkedin',
        'linkedin.com',
    ];

    return utm_sources.includes(utm_source) ||
        'facebook' === utm_source && 'qz-organic' === utm_medium ||
        'email-offer' === utm_campaign;
};

const isLandingPageMembershipPromo = ({
    utm_term,
    utm_content
}) => {

    if ('member-promo' === utm_term) {
        return {
            marketingPromo: true,
            contentVariant: parseInt(utm_content, 10),
        };
    }

    return false;
};

export const getQueryParamData = ({
    isLoggedIn,
    isMember
}) => {
    const {
        code,
        email,
        grsf_email,
        poll,
        promo,
        redirectTo,
        referred_by,
        utm_content,
        utm_source,
        utm_term,
    } = queryParams;

    return {
        // Show the paywall where you can exchange your email for a free article.
        // You're eligible because you're a reader (aka not logged in).
        isEmailOffer: !isLoggedIn && isEmailOffer(queryParams),
        // Show a promotional version of the subscribe form, with special text.
        isMemberPromotion: promo === 'true',
        // Show a particular variant of the email exchange paywall if you've been
        // invited to view an article by a member
        isMemberUnlockedContent: !isLoggedIn && utm_term === 'mucp',
        // Show a thank you message if users have landed on qz as a result of
        // a poll option
        isPollResponse: utm_source === 'email' && poll === 'true',
        // Show users the landing page membership promotion module if they are coming
        // in through a marketing promotion.
        landingPageMembershipPromo: !isMember && isLandingPageMembershipPromo(queryParams),
        // growsurf email, used on referral pages
        growsurfEmail: grsf_email,
        // When users follow a link (e.g. to log in), we may want to redirect them to a final destination,
        redirectTo,
        // When users follow a link, they may have been referred by another user or email
        // list subscriber.
        referredByEmail: referred_by,
        // checking whether to display subscribe bar promotion text for paid marketing
        showSubscribeBarPromotion: utm_term === 'subscribe-bar',
        // show the BOGO promotional offer in the subscribe flow
        showBOGOOffer: utm_term === 'bogo3',
        // copy variant for the promotion text is based on the utm content parameter
        subscribeBarPromotionCopyVariant: parseInt(utm_content, 10) || 0,
        // For form fills
        suggestedEmail: email,
        suggestedPromoCode: code,
    };
};

export function getUtmQueryParams() {
    const utms = ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term'];

    // Only set the property if it has a value
    return utms.reduce((acc, utm) => {
        if (queryParams[utm]) {
            Object.assign(acc, {
                [utm]: queryParams[utm]
            });
        }

        return acc;
    }, {});
}