import React from 'react';
import {
    hot
} from 'react-hot-loader';
import {
    hydrate
} from 'react-dom';
import {
    BrowserRouter
} from 'react-router-dom';
import {
    ApolloProvider,
    createHttpLink
} from '@apollo/client';
import {
    createPersistedQueryLink
} from '@apollo/client/link/persisted-queries';
import {
    Provider
} from 'react-redux';
import {
    HelmetProvider
} from 'react-helmet-async';
import configureStore from 'store';
import App from '../common/App';
import {
    preloadReady
} from 'react-loadable';
import getApolloClient from 'data/apollo/getClient';
import {
    apiFetchOptions
} from 'config/http';
import {
    defaultRole
} from 'config/users';
import {
    log
} from 'helpers/debug';
import {
    getAuthLink
} from 'helpers/graphql';
import {
    updateUserData
} from 'helpers/wrappers/actions/auth';
import {
    updateUserPreferences
} from 'helpers/hooks/actions/preferences';
import {
    sha256
} from 'crypto-hash';

// Log unnecessary rerenders. Note: Inside this check, requiring
// "why-did-you-update" will not affect the production build. Verify with
// `npm i --production && npm run build`.
if ('production' !== process.env.NODE_ENV && process.env.DEBUG) {
    const {
        whyDidYouUpdate
    } = require('why-did-you-update');
    whyDidYouUpdate(React);
}

// Create Redux store and restore state from SSR.
const store = configureStore(window.__INITIAL_STATE__);

// Attempt to refresh user data and auth tokens.
const refreshUserData = () => {
    // Skip fetch / refresh for unauthenticated users or if the initial state from
    // SSR indicates that we should skip it.
    const {
        auth
    } = store.getState();
    const {
        disableRefresh,
        userRole
    } = auth;
    if (disableRefresh || defaultRole === userRole) {
        // Update with existing user data to signal to other processes (e.g.,
        // tracking) that the initial refresh is complete.
        store.dispatch(updateUserData(auth));
        return Promise.resolve();
    }

    return fetch('/api/user/profile', apiFetchOptions)
        .then(response => response.json())
        .then((data = {}) => store.dispatch(updateUserData(data)))
        .catch(() => {});
};

// Get user data and refresh periodically. Store the promise for the initial
// fetch so that we can make sure we wait for it before dispatching any queries.
const initialRefresh = refreshUserData();
setInterval(refreshUserData, 60 * 10 * 1000);

// Fetch user preferences and update Redux store.
fetch('/api/site/preferences', apiFetchOptions)
    .then(response => response.json())
    .then(data => {
        store.dispatch(updateUserPreferences(data));
        log('preferences', data, 'loaded');
    })
    .catch(() => {
        log('preferences', {}, 'error');
    });

// Create an Apollo link that will retrieve the auth tokens from Redux state and
// conditionally add a header to every request.
const getTokens = () => initialRefresh.then(() => store.getState().auth.tokens);
const authLink = getAuthLink(getTokens);

// Create default Apollo client.
const apolloClient = getApolloClient(
    [
        authLink,
        createPersistedQueryLink({
            useGETForHashedQueries: true,
            sha256
        }),
        createHttpLink({
            uri: process.env.CONTENT_API_URL
        }),
    ],
    window.__APOLLO_STATE__, {
        connectToDevTools: true
    }
);

// Allow initial state to be garbage-collected.
delete window.__APOLLO_STATE__;
delete window.__INITIAL_STATE__;

const mountNode = document.getElementById('root');

// delete inlined CSS from SSR during DEVELOPMENT to get HMR work
let renderCallback = () => {
    if (process.env.NODE_ENV === 'development') {
        const node = document.getElementById('css');
        node.parentNode.removeChild(node);
        renderCallback = () => {};
    }
};

// Allow hot-reloading in non-production environments.
const HotReloadableApp = 'production' === process.env.NODE_ENV ? App : hot(module)(App);

const ClientApp = ( <
    ApolloProvider client = {
        apolloClient
    } >
    <
    Provider store = {
        store
    } >
    <
    BrowserRouter >
    <
    HelmetProvider context = {
        {}
    } >
    <
    HotReloadableApp / >
    <
    /HelmetProvider> <
    /BrowserRouter> <
    /Provider> <
    /ApolloProvider>
);

const renderApp = () => hydrate(ClientApp, mountNode, renderCallback);

window.main = () => preloadReady().then(renderApp);