import {
    ApolloClient,
    ApolloLink,
    InMemoryCache
} from '@apollo/client';
import {
    relayStylePagination
} from 'helpers/relayStylePagination';

// Specifies what field Apollo will use to dedupe and normalize fetched data
const dataIdFromObject = object => object.id;

const getApolloClient = (links, initialState, options = {}) => {
    const cache = new InMemoryCache({
        dataIdFromObject,
        typePolicies: {
            Query: {
                fields: {
                    posts: relayStylePagination(['where']),
                    guides: relayStylePagination(['where', 'last']),
                    content: relayStylePagination(['where', 'first']),
                },
            },
        },
    });

    // restore state during client-side render
    if (initialState) {
        cache.restore(initialState);
    }

    return new ApolloClient({
        cache,
        link: ApolloLink.from(links),
        ...options,
    });
};

export default getApolloClient;