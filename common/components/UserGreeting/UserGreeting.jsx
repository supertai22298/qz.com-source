import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withClientSideUserData } from 'helpers/wrappers';
import { USER_NAME } from 'helpers/types/account';
import { timeBasedGreeting } from 'helpers/dates';
import styles from './UserGreeting.scss';

const getGreeting = name => {
	const hours = new Date().getHours();

	if ( name ) {
		return `${timeBasedGreeting( hours )}, ${name}.`;
	}

	return `${timeBasedGreeting( hours )}.`;
};

const UserGreetingBase = ( { getUserAttribute } ) => {
	const [ greeting, setGreeting ] = useState( null );
	const firstName = getUserAttribute( USER_NAME );

	useEffect( () => {
		setGreeting( getGreeting( firstName ) );
	}, [ firstName ] );

	if ( greeting ) {
		return <p className={styles.container}>{greeting}</p>;
	}

	// Display a placeholder before client-side render
	return <p className={`${styles.container} ${styles.placeholder}`} aria-hidden={true}>&nbsp;</p>;
};

UserGreetingBase.propTypes = {
	getUserAttribute: PropTypes.func.isRequired,
};

export default withClientSideUserData()( UserGreetingBase );
