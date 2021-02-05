import {
    oneYearInMilliseconds
} from 'helpers/dates';

// Cookie max-age is in milliseconds.
export const cookies = {
    elbCookie: {
        name: '_qz_user_elb',
        options: {
            maxAge: 60 * 30 * 1000, // thirty minutes in milliseconds
        },
        upstreamName: 'AWSELB',
    },
    sitePreferences: {
        name: 'prefs',
        options: {
            httpOnly: true,
            maxAge: oneYearInMilliseconds * 5,
            secure: process.env.NODE_ENV === 'production',
        },
    },
    userAuthCookie: {
        name: '_qz_jwt_auth',
        options: {
            httpOnly: true,
            maxAge: oneYearInMilliseconds,
            secure: process.env.NODE_ENV === 'production' && process.env.QZ_ENV !== 'testing',
        },
    },
};

export const geo = {
    eeaCountryCodes: [
        'at', // austria
        'be', // belgium
        'bg', // bulgaria
        'cy', // cyprus
        'cz', // czech republic
        'de', // germany
        'dk', // denmark
        'ee', // estonia
        'es', // spain
        'fi', // finland
        'fr', // france
        'gb', // united kingdom
        'gr', // greece
        'hu', // hungry
        'ie', // ireland
        'is', // iceland
        'it', // italy
        'li', // liechtenstein
        'lt', // lithuania
        'lu', // luxembourg
        'lv', // latavia
        'mt', // malta
        'nl', // netherlands
        'no', // norway
        'pl', // poland
        'pt', // portugal
        'ro', // romania
        'se', // sweden
        'si', // slovenia
        'sk', // slovakia
    ],
};

export const headers = {
    auth: {
        app: 'X-QZ-Token',
        userRole: 'X-QZ-User-Role',
    },
    geo: {
        continent: 'X-Continent-Code',
        country: 'X-Country-Code',
        city: 'X-City',
        region: 'X-Region-Code',
    },
    testing: {
        count: 'X-QZ-Test-Group-Count',
        group: 'X-QZ-Test-Group',
    },
};

export const apiFetchOptions = {
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'GET',
};

export const referrers = {
    /*
     * Traffic from the following referrers should activate the
     * email exchange feature instead of the hard paywall.
     * @see JIRA ticket at https://bit.ly/2NcZ4KI
     */
    lowQuality: [
        'apple.news',
        'bing.com',
        'digg.com',
        'drudgereport.com',
        'feedly.com',
        'finance.yahoo.com',
        'flipboard.com',
        'getpocket.com',
        'linkedin.com',
        'lnkd.in',
        'mix.com',
        'news360.com',
        'quora.com',
        'reddit.com',
        'smartbrief.com',
        'smartnews.com',
        't.co',
        'twitter.com',
    ],
};