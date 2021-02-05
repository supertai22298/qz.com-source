import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Notification from './components/Notification/Notification';
import compose from 'helpers/compose';
import {
	withNotifications,
	withQueryParamData,
} from 'helpers/wrappers';
import classnames from 'classnames/bind';
import styles from './Notifications.scss';

const cx = classnames.bind( styles );

const Notifications = ( {
	isPollResponse,
	notifications,
	notifySuccess,
} ) => {
	// Spawn a notification if the user is landing from a poll prompt. Do this
	// here since this component sits above the tree from all page routes.
	useEffect( () => {
		if ( isPollResponse ) {
			notifySuccess( 'Thanks for participating' );
		}
	}, [ isPollResponse, notifySuccess ] );

	return (
		<div className={cx( 'notifications-container' )}>
			{
				notifications.map( notification => <Notification key={notification.id} {...notification} /> )
			}
		</div>
	);
};

Notifications.propTypes = {
	isPollResponse: PropTypes.bool.isRequired,
	notifications: PropTypes.array.isRequired,
	notifySuccess: PropTypes.func.isRequired,
};

const mapStateToProps = ( { notifications } ) => ( { notifications: [ ...notifications ].reverse() } );

export default compose(
	withQueryParamData(),
	withNotifications,
	connect( mapStateToProps, null )
)( Notifications );
