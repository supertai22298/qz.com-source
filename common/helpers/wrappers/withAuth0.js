import React, {
    Component
} from 'react';
import {
    loadScriptOnce
} from 'helpers/utils';

// Can't destructure process.env
/* eslint-disable prefer-destructuring */
const AUTH0_CALLBACK_URL = process.env.AUTH0_CALLBACK_URL;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
/* eslint-enable prefer-destructuring */

const withAuth0 = () => WrappedComponent => {
    class ComponentWithAuth0 extends Component {
        constructor(props) {
            super(props);

            this.state = {
                auth0Ready: false,
            };

            this.authorize = this.authorize.bind(this);
        }

        componentDidMount() {
            loadScriptOnce('https://cdn.auth0.com/js/auth0/9.10/auth0.min.js')
                .then(() => {
                    this.webAuth = new window.auth0.WebAuth({
                        clientID: AUTH0_CLIENT_ID,
                        domain: AUTH0_DOMAIN,
                        redirectUri: AUTH0_CALLBACK_URL,
                        responseType: 'id_token',
                        scope: 'openid',
                    });

                    this.setState({
                        auth0Ready: true
                    });
                });
        }

        authorize(connection) {
            /*
            	Initialize the auth popup with the chosen social connection.
            	Provide a callback to be run after the user has completed the auth process.
            	The callback is triggered manually from the page at the callback URL using
            	WebAuth.popup.callback(). See server/middleware/sso/index.js
            */
            const authArgs = {
                connection,
            };

            // Request permission to post on LinkedIn users' behalf
            if ('linkedin' === connection) {
                authArgs.connectionScope = 'w_member_social';
            }

            return new Promise((resolve, reject) => {
                this.webAuth.popup.authorize(authArgs, (err, authResult) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(authResult);
                });
            });
        }

        render() {
            return ( <
                WrappedComponent auth0Ready = {
                    this.state.auth0Ready
                }
                authorize = {
                    this.authorize
                } { ...this.props
                }
                />
            );
        }
    }

    return ComponentWithAuth0;
};

export default withAuth0;