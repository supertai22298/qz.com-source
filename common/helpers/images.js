import {
    resizeWPImage
} from '@quartz/js-utils';

/**
 * Helper to update query string params
 * @param  {string} uri
 * @param  {string} key
 * @param  {string} value
 * @return {string}
 */
export const updateQueryStringParameter = (uri, key, value) => {
    const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';

    if (uri.match(re)) {
        return uri.replace(re, `$1${key}=${value}$2`);
    }

    return `${uri}${separator}${key}=${value}`;
};

/**
 * Get a array of srcset values
 *
 * @param  {string} url original image url
 * @param  {array} resizeImageParams array of arrays
 * @return {array}
 */
export const getSrcSet = (url, resizeImageParams) => {

    // If user passes an array of width values, roll with it. Otherwise, expect
    // an array of params to apply to resizeWPImage function.
    const applyParams = resizeImageParams.map(params => Array.isArray(params) ? params : [params]);

    return applyParams.map(params => `${resizeWPImage( url, ...params )} ${params[0]}w`);
};

/**
 * Get a srcSet string
 * @param  {string} url
 * @param  {array} resizeImageArgs
 * @param  {int} maxDevicePixelRatio
 * @return {string}
 */
export const getImprovedSrcSet = (url, resizeImageArgs, maxDevicePixelRatio = 2) => {

    const srcSet = [];

    const updateArgs = (args, devicePixelRatio) => {

        const newArgs = args.slice();

        // width
        if (args[0]) {
            newArgs[0] = args[0] * devicePixelRatio;
        }

        // height
        if (args[1]) {
            newArgs[1] = args[1] * devicePixelRatio;
        }

        return newArgs;
    };

    for (let i = 1; i <= maxDevicePixelRatio; i++) {
        const newUrl = resizeWPImage(url, ...updateArgs(resizeImageArgs, i));
        const width = resizeImageArgs[0] * i;

        srcSet.push(
            `${newUrl} ${width}w`
        );
    }

    // return a string, not an array
    return srcSet.join(', ');
};

/**
 * Convert pixels to ems
 *
 * @param  {int} px
 * @param  {int} base
 * @return {float}
 */
export const pxToEm = (px, base = 16) => px / base;

// copy our css breakpoints to js for use w/ srcset
// values here come from variables.scss and breakpoints.scss
export const breakpoints = {
    'phone-only': {
        maxWidth: 424,
        media: '(max-width: 26.5624em)', // 424px
    },
    'phone-large-up': {
        minWidth: 425,
        maxWidth: 767,
        media: '(min-width: 26.5625em)', // 425px
    },
    'tablet-portrait-up': {
        minWidth: 768,
        maxWidth: 1023,
        media: '(min-width: 48em)', // 768px
    },
    'tablet-landscape-up': {
        minWidth: 1024,
        maxWidth: 1199,
        media: '(min-width: 64em)', // 1024px
    },
    'desktop-up': {
        minWidth: 1200,
        maxWidth: 1599,
        media: '(min-width: 75em)', // 1200px
    },
    'desktop-large-up': {
        minWidth: 1600,
        maxWidth: 1799,
        media: '(min-width: 100em)', // 1600px
    },
    'desktop-extra-large-up': {
        minWidth: 1800,
        media: '(min-width: 112.5em)', // 1800px
    },
};