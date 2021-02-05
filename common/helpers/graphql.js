import base64 from 'base-64';
import {
    setContext
} from '@apollo/client/link/context';

/**
 * Decode Relay ID. Returns an object with the type and the WP ID.
 *
 * @param  {string} relayId
 * @return {object}
 */
export const decodeRelayId = relayId => {
    const [type, id] = base64.decode(relayId).split(':');

    return {
        id: parseInt(id, 10),
        type,
    };
};

/**
 * Encode Relay ID.
 *
 * @param  {string}     type GraphQL type.
 * @param  {int|string} id   WP ID.
 * @return {string}
 */
export const encodeRelayId = (type, id) => {
    if (!type || !id) {
        throw new Error('When creating Relay ID, both type and ID must be truthy');
    }
    return base64.encode(`${type}:${id}`);
};

/**
 * Get Apollo auth link that will add a header to every request if authorization
 * tokens are present.
 *
 * @param  {Function} getTokens Function that returns a promise for auth tokens.
 * @return {ApolloLink}
 */
export const getAuthLink = getTokens => setContext(() =>
    getTokens().then(({
        gql: gqlToken
    }) => {
        // Add an authorization header to CMS graphql requests, if it exists.
        if (gqlToken) {
            return {
                headers: {
                    'X-Authorization': `Bearer ${gqlToken}`,
                },
            };
        }

        return {};
    })
);