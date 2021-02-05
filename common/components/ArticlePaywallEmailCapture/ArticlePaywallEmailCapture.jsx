import React, { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ArticlePaywallEmailCapture.scss';
import Link from 'components/Link/Link';
import { FormWithValidation } from 'components/FormWithValidation/FormWithValidation';
import { EmailInput } from 'components/Input/Input';
import SubscribeCTAs from 'components/SubscribeCTAs/SubscribeCTAs';
import { submitEmailRegwall, submitEmailExchange } from 'helpers/tracking/actions/newsletter';
import {
	trackCtaView,
	trackEmailExchangeSuccess,
	trackEmailRegwallSuccess,
} from 'helpers/tracking/actions';
import handleSignup from 'components/EmailSignup/handleSignup';
import emails from 'config/emails';
import useTracking, { useTrackingOnMount } from 'helpers/hooks/useTracking';
import useUserRegistration from 'helpers/hooks/useUserRegistration';
import useArticlePaywallState from 'helpers/hooks/useArticlePaywallState';

const ArticlePaywallWithEmail = ( {
	error,
	loading,
	trackingData,
	onSubmit: wrappedOnSubmit,
	submitText,
} ) => {
	const emailRef = useRef();

	const onSubmit = ( _, { captchaToken } = {} ) => {
		wrappedOnSubmit( { email: emailRef.current.value, captchaToken } );
	};

	// If this user is a return visitor who has already passed paywall once, the error prop is received as a React Fragment.
	// This error prop contains a link to the magic-link page (since it's the same response
	// as a user who would be trying to sign up again); but we want them to subscribe, not sign in.
	// Check to see if it's the fragment error and show them the subscribe CTAs. Other error messages we display as usual.
	const showCTA = !!error?.props;

	if ( showCTA ) {
		return (
			<Fragment>
				<p className={styles.cta}>It looks like you've used this email with us before. <Link to="/subscribe/">Become a member</Link> to read unlimited stories from Quartz.</p>
				<div className={styles.ctaContainer}>
					<SubscribeCTAs
						trackingContext="Member unlock paywall"
						showLogin={false}
					/>
				</div>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<FormWithValidation
				error={error}
				loading={loading}
				inline={true}
				onSubmit={onSubmit}
				submitText={submitText}
				trackingData={trackingData}
				useCaptcha={true}
			>
				<div className={styles.emailField} >
					<EmailInput
						placeholder="e.g. example@qz.com"
						inputRef={emailRef}
						required={true}
						id="email-exchange"
					/>
				</div>
			</FormWithValidation>
			<p className={styles.disclaimer}>By providing your email, you agree to the <Link to="/about/privacy-policy/">Quartz Privacy Policy</Link>.</p>
			<p className={styles.login}>Already a member? <Link to="/login/">Log in.</Link></p>
		</Fragment>
	);
};

ArticlePaywallWithEmail.propTypes = {
	error: PropTypes.node,
	loading: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	submitText: PropTypes.string.isRequired,
	trackingData: PropTypes.object.isRequired,
};

export function ArticlePaywallEmailExchange ( { submitText, id, source } ) {
	const trackingData = {
		ctaName: 'Email exchange paywall',
		context: 'one free article',
	};

	const onSuccess = useTracking( trackEmailExchangeSuccess, trackingData );
	useTrackingOnMount( trackCtaView, trackingData );

	const { registerUser, loading } = useUserRegistration();
	const [ error, setError ] = useState();

	function onSubmit ( { email, captchaToken } ) {
		// Register the user with a coupon code. Pass the article ID so that
		// we can store it in Redux.
		registerUser( {
			captchaToken,
			contentIds: [ id ],
			email,
			source,
		} )
			.then( onSuccess )
			.catch( message => setError( message ) );
	}

	const trackedOnSubmit = useTracking( submitEmailExchange, trackingData, onSubmit );

	return (
		<ArticlePaywallWithEmail
			error={error}
			loading={loading}
			onSubmit={trackedOnSubmit}
			submitText={submitText || 'Unlock story'}
			trackingData={trackingData}
		/>
	);
}

ArticlePaywallEmailExchange.propTypes = {
	id: PropTypes.string.isRequired,
	source: PropTypes.string,
	submitText: PropTypes.string,
};

export function ArticlePaywallDailyBrief( { submitText } ) {
	const trackingData = {
		ctaName: 'Regwall',
		context: 'Daily Brief',
	};

	const onSuccess = useTracking( trackEmailRegwallSuccess, trackingData );
	useTrackingOnMount( trackCtaView, trackingData );

	const { registerUser, loading } = useUserRegistration();
	const [ error, setError ] = useState();

	const [ ignored, resetDynamicPaywall ] = useArticlePaywallState();

	function registerUserWithErrorHandling ( args ) {
		return registerUser( args )
			.catch( message => setError( message ) );
	}

	function onSubmit ( { email, captchaToken } ) {
		handleSignup( {
			data: {
				emailAddress: email,
				listIds: [ emails['daily-brief'].listId ],
			},
			onSuccess,
			registerOptions: { captchaToken },
			registerUser: registerUserWithErrorHandling,
		} ).then( resetDynamicPaywall );
	}

	const trackedOnSubmit = useTracking( submitEmailRegwall, trackingData, onSubmit );

	return (
		<ArticlePaywallWithEmail
			error={error}
			loading={loading}
			onSubmit={trackedOnSubmit}
			submitText={submitText || 'Sign up'}
			trackingData={trackingData}
		/>
	);
}

ArticlePaywallDailyBrief.propTypes = {
	submitText: PropTypes.string,
};
