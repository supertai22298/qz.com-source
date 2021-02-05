import React, {
    Fragment
} from 'react';
import Link from 'components/Link/Link';

export class PreviewAuthenticationError extends Error {}
export class Redirect301Error extends Error {}
export class Redirect302Error extends Error {}
export class ResourceNotFoundError extends Error {}

/**
 * Compute updates to react-router staticContext that should be undertaken for
 * a given error.
 *
 * @param  {Error} err
 * @return {Object}
 */
export const getErrorContext = err => {
    const queryErrors = err.graphQLErrors || [];
    const notFoundPattern = /No [\d\w]+ was found with the ID/;

    if (err instanceof Redirect301Error) {
        return {
            statusCode: 301,
            url: err.message || '/',
        };
    }

    if (err instanceof Redirect302Error) {
        return {
            statusCode: 302,
            url: err.message || '/',
        };
    }

    if (
        queryErrors.length === 1 && notFoundPattern.test(queryErrors[0].message) ||
        err instanceof ResourceNotFoundError ||
        err instanceof PreviewAuthenticationError
    ) {
        return {
            statusCode: 404,
            url: null,
        };
    }

    return {
        statusCode: 500,
        url: null,
    };
};

// Potentially change the error message (i.e. when we don't want to display the exact message from the server in the client.)
export const getErrorMessage = (error) => {
    if ('object' === typeof error) {
        return JSON.stringify(error);
    }

    if (error === 'Failed to authenticate.') {
        return 'This email and password combination doesn’t match an existing account';
    }

    if (error.match(/has been already used by another user/)) {
        const [email] = error.match(/\S*\@\S*/) || [];

        return ( <
            Fragment > This email is already associated with an account.Click <
            Link to = {
                {
                    pathname: '/login/by-email/',
                    state: {
                        email,
                    }
                }
            } >
            here < /Link>
            to send yourself an instant login link. <
            /Fragment>
        );
    }

    if (
        error.match(/PromoCode\(code=.+\) is not found/) ||
        error.match(/Not found\: Gift\(code=.+\)/)
    ) {
        return 'Code not found.';
    }

    if (error.match(/Gift\(code=.+\) is already redeemed/)) {
        return 'Gift code has already been redeemed.';
    }

    return error;
};