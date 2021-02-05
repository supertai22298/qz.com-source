import {
    log
} from 'helpers/debug';

/**
 * Safely remove a value from localStorage
 *
 * @param {string} key the key of the localStorage item to remove
 */
export const clearLocalStorage = key => {
    try {
        return window.localStorage.removeItem(key);
    } catch (err) {
        log('localStorage write error', err);
    }
};

/**
 * Safely read a value from localStorage
 *
 * @param {string} key the key of the localStorage item to read
 */
export const readLocalStorage = key => {
    try {
        const storedData = window.localStorage.getItem(key);
        if (null === storedData) {
            return null;
        }

        const {
            expires,
            value
        } = JSON.parse(storedData) || {};

        // If the value has expired, tidy up the item and return null
        if (expires && expires < Date.now()) {
            clearLocalStorage(key);
            return null;
        }

        return value;
    } catch (err) {
        log('localStorage read error', err);
        return null;
    }
};

/**
 * Safely write a value to localStorage with an optional expiry time
 *
 * @param {string} key the localStorage key
 * @param {*} value the localStorage value to save
 * @param {number} expires time in ms before the saved key/value expires. 0 = no expiry
 */
export const writeLocalStorage = (key, value, expires = 0) => {
    try {
        const data = {
            value
        };

        if (expires) {
            data.expires = Date.now() + expires;
        }

        return window.localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
        log('localStorage write error', err);
    }
};