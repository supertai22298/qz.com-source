import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import {
    connect
} from 'react-redux';
import {
    apiFetchOptions
} from 'config/http';
import compose from 'helpers/compose';
import {
    updatePendingRequest,
    updateUserData
} from '../actions/auth';
import {
    generateRandomPassword,
    getUserSetting,
    userHasPermission
} from 'helpers/user';
import {
    get
} from 'helpers/utils';
import {
    getErrorMessage
} from 'helpers/errors';
import {
    USER_EMAIL,
    USER_NAME
} from 'helpers/types/account';
import {
    withNotifications,
    withClientSideUserData
} from 'helpers/wrappers';
import {
    CREATE_GIFT_REQUEST_ID
} from './config';
import {
    getUserGeoData
} from 'helpers/geo';
import {
    withRouter
} from 'react-router-dom';

const mapStateToProps = state => {
    // Combine user and membership data so we can query settings and permissions easily
    const userAndMembershipData = {
        ...state.auth.user,
        membership: state.auth.membership,
    };

    return {
        getUserSetting: getUserSetting.bind(null, userAndMembershipData),
        pendingRequestId: state.auth.pendingRequestId,
        userHasPermission: userHasPermission.bind(null, userAndMembershipData),
        userRole: state.auth.userRole,
    };
};

const mapDispatchToProps = dispatch => ({
    updatePendingRequest: requestId => dispatch(updatePendingRequest(requestId)),
    updateUserData: (data = {}) => {
        // If user data is undefined, just update pending request.
        if ('undefined' === typeof data.user) {
            dispatch(updatePendingRequest(null));
            return;
        }

        // We store user and membership data separately
        const {
            user: {
                membership,
                ...user
            }
        } = data;

        dispatch(updateUserData({ ...data,
            membership,
            user
        }));
    },
});

const mapPlanChangeDataToState = data => ({
    planChangePreview: data
});

/**
 * This HOC handles all aspects of communicating with our user API to prevent
 * components from handling network requests, promises, or the like. This keeps
 * data flow unidirectional and keeps components reactive. Function props are
 * passed down to accomplish tasks like registering, logging in, and updating
 * user data.
 *
 * Once functions are called and resolve, updated props will be provided with
 * either updated user data or an error.
 */
export default (options = {}) => WrappedComponent => {
    // Setting this option to `true` indicates that the wrapped component requests
    // user settings data (membership and billing information) in addition to user
    // profile information. It will be provided on componentDidMount (and will be
    // absent on initial / server-side render).
    const {
        useSettings = false
    } = options;

    class ComponentWithUserApi extends Component {
        constructor(props) {
            super(props);

            this.state = this.getInitialState();

            this.createGift = this.createGift.bind(this);
            this.getPlanChangePreview = this.getPlanChangePreview.bind(this);
            this.createSocialConnection = this.createSocialConnection.bind(this);
            this.deleteSocialConnection = this.deleteSocialConnection.bind(this);
            this.deleteUser = this.deleteUser.bind(this);
            this.loginUser = this.loginUser.bind(this);
            this.loginUserWithAuth0Token = this.loginUserWithAuth0Token.bind(this);
            this.logoutUser = this.logoutUser.bind(this);
            this.requestResetPassword = this.requestResetPassword.bind(this);
            this.resetFormState = this.resetFormState.bind(this);
            this.resetPassword = this.resetPassword.bind(this);
            this.updateCreditCard = this.updateCreditCard.bind(this);
            this.updateEmail = this.updateEmail.bind(this);
            this.updateError = this.updateError.bind(this);
            this.updateEmailWithVerification = this.updateEmailWithVerification.bind(this);
            this.updatePassword = this.updatePassword.bind(this);
            this.updateProfile = this.updateProfile.bind(this);
            this.updateUserData = this.updateUserData.bind(this);
        }

        componentDidMount() {
            if (useSettings) {
                this.getUserSettings();
            }

            const {
                countryCode
            } = getUserGeoData();

            // update country code on mount if not in the US ( us is default countryCode in state)
            if (countryCode !== this.state.countryCode) {
                this.setState({
                    countryCode
                });
            }

        }

        componentDidUpdate() {
            const countryCodeOverride = this.getCountryCodeOverride(this.props);
            if (this.state.countryCodeOverride !== countryCodeOverride) {
                this.setState({
                    countryCodeOverride
                });
            }
        }

        getCountryCodeOverride(props) {
            if ('japan' === props.match ? .params ? .locale) {
                return 'jp';
            }

            return null;
        }

        getInitialState() {
            return {
                countryCode: 'us',
                countryCodeOverride: this.getCountryCodeOverride(this.props),
                initialPassword: null,
                magicLink: null,
                error: null,
                giftPlanId: null,
                hasFetchedSettings: false,
                planChangePreview: null,
            };
        }

        callApi({
            endpoint,
            method = 'get',
            body,
            newState = {},
            onSubmit = () => {},
            onSuccess = () => {},
            mapDataToState = () => ({}),
            requestId = 'generic_request_id',
        }) {
            // Don't get user data if a request is in process.
            if (this.props.pendingRequestId) {
                return Promise.resolve();
            }

            this.props.updatePendingRequest(requestId);

            const fetchOptions = {
                ...apiFetchOptions,
                body: body && JSON.stringify(body),
                method: method.toUpperCase(),
            };

            const endpointsWithoutSettings = ['login', 'login/auth0', 'logout'];
            const successState = {
                error: null,
                hasFetchedSettings: !endpointsWithoutSettings.includes(endpoint),
            };

            // Reset the error before submitting
            return new Promise((resolve, reject) => {
                this.setState({
                    error: null
                }, () => {
                    fetch(`/api/user/${endpoint}`, fetchOptions)
                        .then(response => response.json())
                        .then(({
                            error,
                            ...data
                        }) => {
                            if (error) {
                                return Promise.reject(error);
                            }

                            return { ...data,
                                ...onSubmit()
                            };
                        })
                        .then(data => {
                            const state = { ...newState,
                                ...successState,
                                ...mapDataToState(data)
                            };
                            this.updateUserData(data, state);
                            onSuccess(data);
                            resolve(state);
                        })
                        .catch(error => {
                            reject(this.updateUserData({}, {
                                error: getErrorMessage(error)
                            }));
                        });
                });
            });
        }

        createGift({
            captchaToken,
            senderName,
            senderEmail,
            recipientName,
            recipientEmail,
            message,
            planId,
            tokenObject,
            requestId = CREATE_GIFT_REQUEST_ID,
        }) {
            const {
                history,
                notifyError
            } = this.props;

            const giftError = () => notifyError('There was an error creating your gift.');
            const giftSuccess = () => history.push('/gift/success/');

            const body = {
                captchaToken,
                senderName,
                recipientEmail,
                recipientName,
                message,
                planId,
                token: this.getStripeToken(tokenObject),
            };

            if (!this.props.getUserAttribute(USER_EMAIL)) {
                const userInfo = {
                    senderEmail,
                    password: generateRandomPassword(),
                    hasRandomPassword: true,
                };

                return this.callApi({
                        endpoint: 'gift',
                        method: 'post',
                        body: {
                            ...body,
                            ...userInfo,
                        },
                    })
                    .then(giftSuccess)
                    .catch(giftError);

            }

            return this.callApi({
                    endpoint: 'gift',
                    method: 'post',
                    body,
                    requestId,
                })
                .then(giftSuccess)
                .catch(giftError);
        }

        getPlanChangePreview({
            newPlanId
        }) {
            const {
                notifyError
            } = this.props;

            this.callApi({
                    endpoint: 'invoice_preview',
                    method: 'patch',
                    body: {
                        newPlanId
                    },
                    mapDataToState: mapPlanChangeDataToState,
                })
                .catch(() => notifyError('There was an error changing your plan.'));
        }

        getStripeToken(tokenObject) {
            return get(tokenObject, 'id', null);
        }

        getUserSettings() {
            if (!this.props.isLoggedIn) {
                return;
            }

            this.callApi({
                    endpoint: 'settings'
                })
                .catch(() => {
                    // Do nothing
                });
        }

        createSocialConnection({
            idToken,
            requestId,
            displayName
        }) {
            const {
                notifySuccess,
                notifyError
            } = this.props;

            this.callApi({
                    endpoint: 'social',
                    method: 'post',
                    body: {
                        idToken
                    },
                    requestId,
                })
                .then(() => notifySuccess(`${displayName} account successfully connected`))
                .catch(() => notifyError('An error was encountered and your account could not be connected.'));
        }

        deleteSocialConnection({
            provider,
            confirm,
            requestId,
            displayName
        }) {
            const {
                notifySuccess,
                notifyError
            } = this.props;

            if (!confirm) {
                return;
            }

            this.callApi({
                    endpoint: 'social',
                    method: 'delete',
                    body: {
                        provider
                    },
                    requestId,
                })
                .then(() => notifySuccess(`${displayName} account successfully disconnected`))
                .catch(() => notifyError('An error was encountered and your account could not be disconnected.'));
        }

        deleteUser({
            confirm,
            requestId
        }) {
            const {
                notifySuccess,
                notifyError
            } = this.props;

            if (!confirm) {
                return;
            }

            this.callApi({
                    endpoint: '',
                    method: 'delete',
                    requestId,
                })
                .then(() => notifySuccess('Your account was successfully deleted and you have been logged out.'))
                .catch(() => notifyError('An error occurred and your account could not be deleted. Please try again or contact support@qz.com for assistance.'));
        }

        loginUser({
            email,
            password
        }) {
            // Don't login if user is already logged in.
            if (this.props.isLoggedIn) {
                return;
            }

            this.callApi({
                    endpoint: 'login',
                    method: 'post',
                    body: {
                        email,
                        password
                    },
                })
                .catch(() => {
                    // This error is handled in the login form.
                });
        }

        loginUserWithAuth0Token({
            idToken
        }) {
            const {
                notifyError
            } = this.props;

            // Don't login if user is already logged in.
            if (this.props.isLoggedIn) {
                return;
            }

            this.callApi({
                    endpoint: 'login/auth0',
                    method: 'post',
                    body: {
                        jwt: idToken
                    },
                })
                .catch(() => notifyError('An error was encountered and we couldn’t sign you in. Please try again or use another sign-in method.'));
        }

        logoutUser({
            requestId
        } = {}) {
            const {
                notifyError
            } = this.props;

            this.callApi({
                    endpoint: 'logout',
                    mapDataToState: () => this.state,
                    requestId,
                })
                .catch(() => notifyError('An error occurred and you could not be logged out.'));
        }

        requestResetPassword({
            email
        }) {
            this.callApi({
                    endpoint: 'password/reset',
                    method: 'post',
                    body: {
                        email
                    },
                })
                .finally(() => this.setState({
                    initialPassword: 'RESETTING'
                }));
        }

        resetFormState() {
            this.setState({
                error: null,
                initialPassword: null,
            });
        }

        resetPassword({
            password,
            token
        }) {
            this.setState({
                    initialPassword: 'CURRENT_PASSWORD'
                },
                () => this.callApi({
                    endpoint: 'password/reset',
                    method: 'put',
                    body: {
                        password,
                        token
                    },
                    newState: {
                        initialPassword: null
                    },
                })
                .catch(() => {
                    // This error is handled in the form UI.
                })
            );
        }

        updateCreditCard({
            onSuccess,
            tokenObject
        }) {
            const token = this.getStripeToken(tokenObject);

            this.callApi({
                    endpoint: 'billing',
                    method: 'put',
                    onSuccess,
                    body: {
                        token
                    },
                })
                .catch(() => {
                    // This error is handled in the form UI.
                });
        }

        updateEmail({
            email
        }) {
            this.callApi({
                    endpoint: 'email',
                    method: 'put',
                    body: {
                        email
                    },
                })
                .catch(() => {
                    // This error is handled in the form UI.
                });
        }

        updateEmailWithVerification({
            email,
            password,
            ...userProps
        }) {
            this.callApi({
                    endpoint: 'verified_email',
                    method: 'put',
                    body: {
                        email,
                        password,
                        ...userProps,
                    },
                })
                .catch(() => {
                    // This error is handled in the form UI.
                });
        }

        updateError(error) {
            this.setState({
                error
            });
        }

        updatePassword({
            password,
            newPassword,
            requestId
        }) {
            const body = {
                password,
                newPassword
            };
            const newState = {
                initialPassword: null
            };

            // Because we don't store the password in user state, we need a way
            // to indicate that the password has changed. Provide a dummy initialPassword
            // so we can track when it's changed
            this.setState({
                    initialPassword: 'CURRENT_PASSWORD'
                },
                () => this.callApi({
                    endpoint: 'password',
                    method: 'put',
                    body,
                    newState,
                    requestId,
                })
                .catch(() => {
                    // This error is handled in the form UI.
                })
            );
        }

        updateProfile({
            requestId,
            ...user
        }) {
            const {
                getUserAttribute
            } = this.props;
            const firstName = getUserAttribute(USER_NAME);
            const email = getUserAttribute(USER_EMAIL);

            return this.callApi({
                endpoint: 'profile',
                method: 'put',
                body: {
                    firstName,
                    email,
                    ...user,
                },
                requestId,
            });
        }

        updateUserData({
            contentIds,
            tokens,
            user,
            userRole,
            acceptPromotionalOffer
        }, newState) {
            this.setState(newState, () => this.props.updateUserData({
                contentIds,
                tokens,
                user,
                userRole,
                acceptPromotionalOffer
            }));
        }

        render() {
            // Don't pass down dispatch and other internal-facing props.
            const {
                updatePendingRequest: ignored2,
                updateUserData: ignored3,
                userRole: ignored4,
                ...props
            } = this.props;

            const {
                planChangePreview,
                countryCode,
                countryCodeOverride
            } = this.state;

            const baseProps = {
                ...props,
                countryCode,
                countryCodeOverride,
                createGift: this.createGift,
                createSocialConnection: this.createSocialConnection,
                deleteSocialConnection: this.deleteSocialConnection,
                deleteUser: this.deleteUser,
                getPlanChangePreview: this.getPlanChangePreview,
                hasFetchedSettings: this.state.hasFetchedSettings,
                magicLink: this.state.magicLink,
                initialPassword: this.state.initialPassword,
                loginUser: this.loginUser,
                loginUserWithAuth0Token: this.loginUserWithAuth0Token,
                logoutUser: this.logoutUser,
                planChangePreview: planChangePreview,
                requestResetPassword: this.requestResetPassword,
                resetFormState: this.resetFormState,
                resetPassword: this.resetPassword,
                updateCreditCard: this.updateCreditCard,
                updateEmail: this.updateEmail,
                updateEmailWithVerification: this.updateEmailWithVerification,
                updateError: this.updateError,
                updatePassword: this.updatePassword,
                updateProfile: this.updateProfile,
                userError: this.state.error,
            };

            return ( <
                WrappedComponent { ...baseProps
                }
                />
            );
        }
    }

    ComponentWithUserApi.propTypes = {
        getUserAttribute: PropTypes.func.isRequired,
        getUserSetting: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        match: PropTypes.object,
        notifyError: PropTypes.func.isRequired,
        notifySuccess: PropTypes.func.isRequired,
        pendingRequestId: PropTypes.string,
        updatePendingRequest: PropTypes.func.isRequired,
        updateUserData: PropTypes.func.isRequired,
        userRole: PropTypes.string.isRequired,
    };

    return compose(
        withClientSideUserData(),
        connect(mapStateToProps, mapDispatchToProps),
        withNotifications,
        withRouter
    )(ComponentWithUserApi);
};