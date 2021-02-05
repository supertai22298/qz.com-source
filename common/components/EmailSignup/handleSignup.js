// TODO: Finish handling all the error states.
const parseEmailProviderErrors = ({
    status
}) => {
    const serverError = 'The server is currently experiencing issues - please try again later.';

    if (status < 500) {
        return 'We were unable to sign you up for the newsletter. If you are having issues, please contact <a href="mailto:support@qz.com">support@qz.com</a> for help.';
    }

    return serverError;
};

const handleSignup = ({
    data,
    isLoggedIn,
    onError = () => {},
    onSuccess,
    registerUser,
    registerOptions = {
        useCaptcha: false
    },
}) => {
    const {
        emailAddress,
        listIds,
        customFields = {}
    } = data;

    const body = {
        email: emailAddress,
        list_ids: listIds,
        custom_fields: customFields || {},
    };

    const formPostVars = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch('/api/email/subscribe', formPostVars)
        .then(promise => promise.json())
        .then(json => {
            if (json.data && json.data.status > 399) {
                const message = parseEmailProviderErrors(json.data);
                throw new Error(message);
            }

            if (!isLoggedIn) {
                registerUser({
                    email: emailAddress,
                    source: `email-signup-${listIds.join( '-' )}`,
                    ...registerOptions,
                });
            }

            onSuccess ? .(json);
        })
        .catch(onError);
};

export default handleSignup;