import {
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    useDispatch
} from 'react-redux';
import {
    apiFetchOptions,
    referrers
} from 'config/http';
import {
    PAYWALL_DYNAMIC,
    PAYWALL_EMAIL_EXCHANGE,
    PAYWALL_HARD,
    PAYWALL_MEMBER_UNLOCK
} from 'config/membership';
import {
    log
} from 'helpers/debug';
import useAppMessage from 'helpers/hooks/useAppMessage';
import usePageVariant from 'helpers/hooks/usePageVariant';
import useClientSideUserData from 'helpers/hooks/useClientSideUserData';
import useUserRole from 'helpers/hooks/useUserRole';
import {
    getQueryParamData,
    getUtmQueryParams
} from 'helpers/queryParams';
import {
    setPaywallStrategy
} from 'helpers/tracking/actions';
import {
    getHostname
} from 'helpers/urls';

// Fetch dynamic paywall decision from API.
const getDynamicPaywallDecision = (id) => {
    // Strip path from referrer because (1) it's not important and (2) it can
    // cause encoding issues. Prepend "https://" because parsing libraries
    // expect a URL but actual protocol is irrelevant to us.
    const hostname = getHostname(document.referrer);
    const referrer = hostname ? `https://${hostname}` : '';

    const params = {
        id, // the current article relay ID
        params: encodeURIComponent(JSON.stringify(getUtmQueryParams())),
        referrer,
    };

    log('paywall', params, 'request');

    const queryString = Object.keys(params).map(key => `${key}=${params[ key ]}`).join('&');

    return fetch(`/api/site/behavior?${queryString}`, apiFetchOptions)
        .then(response => response.json())
        .catch(() => ({
            conditions: 'error',
            experiment: 'error',
            paywall: false,
            strategy: 'error',
            version: 'error',
        }));
};

let memberUnlockedId = null;

const useArticlePaywallState = (article, qualifiers) => {
    const {
        id
    } = article;
    const {
        isMetered, // use "dynamic" paywall
        isPaywalled, // show "hard" paywall
    } = qualifiers;

    const {
        promotionalContentIds
    } = useClientSideUserData();
    const {
        isInApp
    } = usePageVariant();
    const {
        isLoggedIn,
        isMember
    } = useUserRole();

    const {
        isEmailOffer,
        isMemberUnlockedContent,
    } = getQueryParamData({
        isLoggedIn,
        isMember
    });

    const canReadArticle = isMember || promotionalContentIds.includes(id);

    let isFromLowQualityReferrer = false;
    if ('undefined' !== typeof document) {
        const referrerHostname = getHostname(document.referrer);
        isFromLowQualityReferrer = referrers.lowQuality.some(hostname => hostname === referrerHostname || referrerHostname.endsWith(`.${hostname}`));
    }

    // We may want to enforce one CTA or the other depending on factors like
    // utm_campaign variables or whether the user has signed up before.
    // For instance, we don't want to show the email exchange if the user is logged in or
    // using the app.
    const showEmailExchange = !isInApp && !isLoggedIn && !canReadArticle && (isPaywalled && isFromLowQualityReferrer || isEmailOffer);

    // preserve the id of member unlocked content so as to only show the member-unlocked-content paywall
    // on the initial article
    if (isMemberUnlockedContent && !memberUnlockedId) {
        memberUnlockedId = id;
    }

    const showMemberUnlockedPaywall = !isLoggedIn && !canReadArticle && isMemberUnlockedContent && id === memberUnlockedId;

    // Hard paywall status is a simple function of props. The other paywall types
    // can only be applied on client-side render after a network request to our
    // API. Set the initial paywall type to null or HARD if the user does not
    // have access.
    const showHardPaywall = isPaywalled && !canReadArticle;
    const [paywallType, setPaywallType] = useState(showHardPaywall ? PAYWALL_HARD : null);

    const setAndLog = useCallback((type, data) => {
        setPaywallType(type);
        log('paywall', {
            id,
            ...data
        }, type);
    }, [id, setPaywallType]);

    const dispatch = useDispatch();

    useAppMessage({
        hasPaywall: !!paywallType
    });

    useEffect(() => {
        // The CMS allows editors to disable all paywalls.
        const disablePaywalls = !(isMetered || isPaywalled);

        if (canReadArticle || disablePaywalls) {
            setAndLog(null);
            return;
        }

        if (showEmailExchange) {
            setAndLog(PAYWALL_EMAIL_EXCHANGE);
            return;
        }

        if (showMemberUnlockedPaywall) {
            setAndLog(PAYWALL_MEMBER_UNLOCK);
            return;
        }

        if (showHardPaywall) {
            setAndLog(PAYWALL_HARD);
            return;
        }

        getDynamicPaywallDecision(id).then(data => {
            const {
                conditions,
                experiment,
                paywall,
                strategy,
                version
            } = data;
            const newPaywallType = paywall ? PAYWALL_DYNAMIC : null;
            const actionPayload = {
                conditions,
                experiment,
                paywallType: newPaywallType,
                strategy,
                version
            };

            dispatch(setPaywallStrategy(actionPayload));
            setAndLog(newPaywallType, data);
        });
    }, [
        canReadArticle,
        dispatch,
        id,
        isMetered,
        isMemberUnlockedContent,
        isPaywalled,
        setAndLog,
        showEmailExchange,
        showHardPaywall,
        showMemberUnlockedPaywall,
    ]);

    const resetDynamicPaywall = () => {
        if (PAYWALL_DYNAMIC === paywallType) {
            setAndLog(null);
        }
    };

    return [
        paywallType,
        resetDynamicPaywall,
    ];
};

export default useArticlePaywallState;