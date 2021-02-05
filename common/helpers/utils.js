import {
    log
} from 'helpers/debug';

/* TABLE OF CONTENTS:
- get
- set
- dedupe
- dedupePosts
- loadScript
- loadScriptOnce
- logImpression
- debounce
- throttle
- postMessage
- getUrlVars
- easingEquation
- scrollTo
- hashCode
- sortBy
- valueOrDefault
- pick
- once
- keyBy
*/

/**
 * Given a string of accessors, returns an array where each item is an accessor.
 * E.g. '[0].edges.node.posts[2].edges' returns [0, 'edges', 'node', 'posts', 2, 'edges']
 * Used by get and set to access an object's deep properties.
 *
 * @param  {String} path The path to convert
 * @return {Array} Array of accessors
 */

const pathToArr = path => path.replace(/\s+/g, '').replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);

/**
 * Simple replacement for lodash#get. Supports simple array and object property
 * accessors, e.g., '[0].edges.node.posts[2].edges'.
 *
 * @param  {Object|Array} obj   Object or array to get deep property from.
 * @param  {String}       path  String representation of deep property.
 * @param  {mixed}        def   Default value if accessing fails.
 * @return {mixed}              Deep property value.
 */
export const get = (obj, path, def) => {
    try {
        // Remove all white space, split all accessors into array.
        const accessors = pathToArr(path);
        return accessors.reduce((step, prop) => step[prop], obj) || def;
    } catch (err) {
        return def;
    }
};

/**
 * Simple replacement for lodash#set. Mutates the supplied object by setting the
 * provided value at the provided path. Creates an object if any portion of the path
 * is undefined, like mkdir -p
 *
 * @param  {Object} obj  Object on which to set the value
 * @param  {String} path Path at which to set the value. Uses dot notation, e.g. x.y.z
 * @param  {mixed} val  The value to assign on obj
 * @return {Object} obj The updated object
 */
export const set = (obj, path, val) => {
    if (typeof path === 'string') {
        const accessors = pathToArr(path);
        return set(obj, accessors, val);
    } else if (path.length === 1) {
        return obj[path[0]] = val; // eslint-disable-line no-param-reassign
    } else if (path.length === 0) {
        return obj;
    }
    if (typeof obj[path[0]] === 'undefined') {
        obj[path[0]] = {}; // eslint-disable-line no-param-reassign
    }
    return set(obj[path[0]], path.slice(1), val);
};

// Dedupe an array (or arrays) of primitive values like numbers or strings
export const dedupe = (...arrays) => {
    const values = new Set(); // IE11 does not support constructor args for Set.
    arrays.forEach(arr => arr.forEach(value => values.add(value)));

    return [...values];
};

/* Dedupe an array of objects like articles or comments.
Also takes additional arrays if there are multiple collections to filter from. */
export const dedupeCollection = (original, ...arraysToExclude) => {
    const ids = {};

    /* If additional arrays are provided, we want to filter those items out of our original array
    This can be used to avoid duplicate articles/commments/etc... between multiple collections. */
    if (arraysToExclude.length) {
        arraysToExclude
            .reduce((a, b) => [...a, ...b])
            .forEach(element => ids[element.id] = element.id);
    }

    // Use dictionary of ids to remove any duplicates
    return original.reduce((articles, article) => {
        if (!ids[article.id]) {
            ids[article.id] = article.id;
            articles.push(article);
        }
        return articles;
    }, []);
};

/**
 * Async load a js script file
 * @param  {String} src the script url
 * @return {Promise} promise resolve with true or reject with Error
 */
export const loadScript = (src, attributes = {}) => new Promise((resolve, reject) => {

    // reject immediately if document is not an object or
    // src is not a string
    if (typeof document === 'undefined' || document instanceof HTMLDocument !== true) {
        reject(new TypeError('document not an instance of HTMLDocument'));
    }

    if (typeof src !== 'string') {
        reject(new TypeError('src not a string'));
    }

    const script = document.createElement('script');

    if (Object.keys(attributes).length) {
        for (const key in attributes) {
            script.setAttribute(key, attributes[key]);
        }
    }

    script.async = true;
    script.src = src;
    // reject with ErrorEvent
    script.onerror = reject;

    // resolve true onload with true
    script.onload = () => {
        resolve(true);
    };

    document.body.appendChild(script);

});

// Map script URLs to a request Promise so we can make just one request per URL
const loadedScripts = {};

/**
 * Helper to make sure a script only gets loaded once
 * @param  {string} src
 * @return {Promise}
 */
export const loadScriptOnce = (src, attributes) => {
    let request = loadedScripts[src];

    if (!request) {
        request = loadScript(src, attributes);
        loadedScripts[src] = request;
    }

    return request;
};

export const logImpression = (url) => {
    if ('string' === typeof url) {
        const img = document.createElement('img');
        img.src = url.replace(/%%CACHEBUSTER%%/gi, new Date().getTime());
    }
};

/**
 * Debouncer for delaying function calls until after invocation window closes.
 */
export const debounce = (fn, time) => {
    let timeout;

    return function(...args) {
        const functionCall = () => fn.apply(this, args);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    };
};

/**
 * port of http://underscorejs.org/docs/underscore.html#section-82 without the option
 * @param  {function} func function to throttle
 * @param  {number} wait in milliseconds
 * @return {function} return a function that will execute only within the give time window
 */
export const throttle = (func, wait) => {
    let callbackArgs, result;
    let timeout = null;
    let previous = 0;

    const later = () => {
        previous = Date.now();
        timeout = null;
        result = func.apply(this, callbackArgs);

        if (!timeout) {
            callbackArgs = null;
        }
    };

    return (...args) => {
        const now = Date.now();

        if (!previous) {
            previous = now;
        }

        const remaining = wait - (now - previous);

        callbackArgs = args;

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;

            result = func.apply(this, callbackArgs);

            if (!timeout) {
                callbackArgs = null;
            }

        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }

        return result;
    };
};

/**
 * Post a message to a child frame.
 *
 * @param  {string} action  The event name.
 * @param  {object} data    Data to send.
 * @param  {mixed}  frameEl DOM element of child iframe.
 * @param  {string} origin  The origin of the frame.
 * @return {void}
 */
export const postMessage = ({
    action,
    data,
    frameEl,
    origin
}) => {
    const message = {
        action,
        data,
        fromId: 'QZParent',
        toId: frameEl.id,
    };

    log('postMessage:send', message, action);
    (frameEl.contentWindow || window).postMessage(JSON.stringify(message), origin);
};

/**
 * this is a quadratic ease in out function
 * this should be used for all easing site wide and we can just adjust this function as necessary if any changes are needed.
 * @param {int} time		currentTime
 * @param {int} start		start position in pixels
 * @param {int} change		distance to cover
 * @param {int} duration	how long the animation will take
 * @return {void}
 */
const easingEquation = function(time, start, change, duration) {

    let calculatedTime = time / (duration / 2);

    if (calculatedTime < 1) {
        return change / 2 * Math.pow(calculatedTime, 2) + start;
    }

    calculatedTime--;

    return -change / 2 * (calculatedTime * (calculatedTime - 2) - 1) + start;
};

/**
 * scrolls and element to a given value
 * @param {object} el - a reference to the element to be scrolled
 * @param {number} to - the value in px the element should be scrolled to
 * @param {number} duration - time in milliseconds the animation should take
 * @param {string} direction - "vertical" or "horizontal" to indicate the direction to scroll
 * @param {function} callBack - callback function to be executed when the animation completes
 */
export const scrollTo = (el, to, duration, direction = 'vertical', callBack) => {
    // If element is window, use documentElement for a more consistent API.
    let element = el;
    if (element === window) {
        element = document.documentElement;
    }

    const prop = direction === 'vertical' ? 'scrollTop' : 'scrollLeft';
    const start = element[prop];
    const change = to - start;

    // This needs to be lower than 60fps, otherwise we get out of sync with
    // withScroll and it will not get the updated scroll position in time.
    const increment = 1000 / 30;

    let currentTime = 0;

    const animateScroll = () => {
        currentTime += increment;
        const val = easingEquation(currentTime, start, change, duration);
        element[prop] = val; // eslint-disable-line no-param-reassign
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        } else if (typeof callBack === 'function') {
            callBack.apply();
        }
    };

    animateScroll();
};

export const hashCode = (str) => {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
    }

    return hash;
};

// sort by array by property
export const sortBy = (arr, prop) =>
    arr.sort((a, b) => {
        const aVal = a[prop];
        const bVal = b[prop];

        if (aVal > bVal) {
            return -1;
        }

        if (aVal < bVal) {
            return 1;
        }

        // if b is undefined while a isn't, put b behind a
        if (aVal && !bVal) {
            return -1;
        }

        // if a is undefined while b isn't, put a behind b
        if (!aVal && bVal) {
            return 1;
        }

        // otherwise, leave a and b unchanged with respect to each other
        return 0;
    });

/**
 * Return default value if value is not defined or falsy. Otherwise pass to a
 * function to generate output.
 *
 * @param  {mixed}    possiblyUndefined A value that may be undefined
 * @param  {mixed}    defaultValue      Default value to return if undefined
 * @param  {Function} func              A function to generate the output
 * @return {mixed}
 */
export const valueOrDefault = (possiblyUndefined, defaultValue = null, func = value => value) => !possiblyUndefined ? defaultValue : func(possiblyUndefined);

/**
 * Pick a subset of keys from an object. Do not create keys that don't already
 * exist.
 *
 * @param  {Array}   keys  Keys (property names) to pick.
 * @param  {Object}  obj   Object
 * @param  {Object}  init  Additional data to include in the resulting object.
 * @return {Object}
 */
export const pick = (keys, obj, init = {}) =>
    keys.reduce((acc, cur) => obj[cur] ? {
        [cur]: obj[cur],
        ...acc
    } : acc, init);

/**
 * Run a function once and only once.
 *
 * @param  {function} func Function to memoize / cache.
 * @return {mixed}
 */
export const once = func => {
    let memo;
    let ran = false;

    return () => {
        if (ran) {
            return memo;
        }

        ran = true;
        memo = func.apply(this);
        return memo;
    };
};

/**
 * Helper to determine what domain code is being executed on
 */
export const isQzDotCom = 'undefined' !== typeof window ? 'qz.com' === window.location.hostname : 'qz.com' === process.env.SERVER_HOSTNAME;

/**
 * Map an array of objects to an object. The key and value of each tuple
 * in the object are determined by the getKey and getValue functions
 * respectively.
 *
 * @param  {Array} array The array to be mapped
 * @param  {Function} getKey Iterator function to determine the iteratee's key. It takes one argument: the iteratee
 * @param  {Function} getValue Optional iterator function to determine the iteratee's value. By default passes through the iteratee unchanged. It takes one argument: the iteratee
 * @return {Object} An object containing the mapped key/value pairs
 */
export const keyBy = (arr, getKey, getValue = o => o) => Object.fromEntries(arr.map(o => [getKey(o), getValue(o)]));