import {
    log
} from 'helpers/debug';

// Keep a local copy of the user's geo data so that it can be exported for use
// outside the React lifecycle.
//
// IMPORTANT: This is a hack-ish pattern because we need access to this value
// *immediately* and outside of React components (e.g., in GPT configuration and
// in tracking). This is like importing the Redux store and calling getState().
// Do NOT import this function for use with React components; they will NOT
// update with new props. Don't use this pattern for other custom hooks unless
// you fit this very narrow use case. Keep state inside the hooks!
const userGeoData = {
    countryCode: 'us',
    regionCode: 'ny',
};

// Client-side, parse the QZ global to load stringified JSON from ESI, which
// contains the user's geo data.
try {
    const {
        country,
        region
    } = JSON.parse(window.QZ.geo);
    const countryCode = country.toLowerCase();
    const regionCode = region.toLowerCase();

    Object.assign(userGeoData, {
        countryCode,
        regionCode
    });

    // Debug log initial geo settings.
    log('geo', userGeoData, 'LOAD');

    // Delete geo information so that no one attempts to use it improperly.
    delete window.QZ.geo;
} catch (err) {}

/**
 * Get the user's geo data as defined by Fastly geolocation service. DO NOT
 * IMPORT THIS FOR A REACT COMPONENT. Instead, use useUserPreferences.
 *
 * @return {object}
 */
export const getUserGeoData = () => ({ ...userGeoData
});