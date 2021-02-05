import {
    redactEmailAddressesFromPath
} from 'helpers/text';

export default payload => {
    const {
        event,
        data
    } = payload;

    return {
        event,
        product: 'web',
        data: {
            date: new Date().getTime() / 1000,
            ua: window.navigator.userAgent,
            query: window.location.search || null, // not supported in all browsers, https://caniuse.com/#feat=urlsearchparams
            path: redactEmailAddressesFromPath(window.location.pathname),
            referrer: redactEmailAddressesFromPath(document.referrer),
            version: '1.0.0', // from package.json
            ...data,
        },
    };
};