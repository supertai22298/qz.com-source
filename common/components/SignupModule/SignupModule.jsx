import React, { Fragment } from 'react';
import emails from 'config/emails';
import PropTypes from 'prop-types';
import EmailSignup from 'components/EmailSignup/EmailSignup';
import MembershipCTA from 'components/MembershipCTA/MembershipCTA';
import styles from './SignupModule.scss';

export const getTitle = ( listId, name ) => {
	let titleFragment = `Sign up for the ${name}`;
	const emailName = Object.keys( emails ).find( email => emails[email].listId === listId );

	if ( emails[emailName]?.title ) {
		titleFragment = emails[emailName].title;
	}

	// default
	return <Fragment><span role="img" aria-label="mailbox">📬</span>{` ${titleFragment}`}</Fragment>;
};

const SignupModule = ( {
	isLoggedIn,
	isMember,
	isPrivate,
	listId,
	name,
	slug,
} ) => {
	if ( isPrivate && isMember ) {
		return null;
	}

	if ( slug === 'quartz-japan' && !isMember ) {
		return (
			<MembershipCTA
				isLoggedIn={isLoggedIn}
				language={slug === 'quartz-japan' ? 'ja' : 'en'}
				trackingContext="email"
				type="paid"
			/>
		);
	}

	return (
		<div className={styles.container}>
			<EmailSignup
				title={getTitle( listId, name )}
				listIds={[ listId ]}
				location="email"
			/>
		</div>
	);
};

SignupModule.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	isMember: PropTypes.bool.isRequired,
	isPrivate: PropTypes.bool.isRequired,
	listId: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
};

export default SignupModule;
