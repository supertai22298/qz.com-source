import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './Notification.scss';
import { dismissNotification } from 'helpers/wrappers/actions/notifications';
import NotificationErrorIcon from 'svgs/notification-error-icon.svg';
import NotificationSuccessIcon from 'svgs/notification-success-icon.svg';
import NotificationWarningIcon from 'svgs/notification-warning-icon.svg';

const cx = classnames.bind( styles );

export class Notification extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			hidden: false,
		};

		this.closeButtonRef = React.createRef();

		this.stopDismissTimer = this.stopDismissTimer.bind( this );
		this.startDismissTimer = this.startDismissTimer.bind( this );
	}

	stopDismissTimer() {
		clearTimeout( this.dismissTimeout );
	}

	startDismissTimer() {
		const { dismiss, timeVisible } = this.props;

		if ( timeVisible ) {
			this.dismissTimeout = setTimeout( dismiss, timeVisible );
		}
	}

	componentDidMount() {
		this.startDismissTimer();

		/*
			If this is an error notification, its aria role will be 'alertdialog'.
			Screen readers will announce the notification when it appears, so
			we should focus the close button to allow the user to close it straight
			away. From https://mzl.la/2LDPGyF:

			> "Unlike regular alerts, an alert dialog must have at least one focusable
			control and focus must be moved to that control when the alert dialog appears."
		*/
		if ( this.props.status === 'error' ) {
			this.closeButtonRef.current.focus();
		}
	}

	componentDidUpdate( prevProps ) {
		if ( !prevProps.dismissed && this.props.dismissed ) {
			this.stopDismissTimer();
			// Once the dismissal CSS animation has run, hide the notification
			this.hideTimeout = setTimeout( () => this.setState( { hidden: true } ), 250 );
		}
	}

	componentWillUnmount() {
		this.stopDismissTimer();
		clearTimeout( this.hideTimeout );
	}

	render() {
		const { hidden } = this.state;
		const { dismiss, dismissed, id, message, status } = this.props;

		return (
			<div
				aria-describedby={`dialog-message-${id}`}
				aria-hidden={hidden}
				aria-label={`${status} message`}
				className={cx( 'container', { dismissed, hidden } )}
				onMouseEnter={this.stopDismissTimer}
				onMouseLeave={this.startDismissTimer}
				role={status === 'error' ? 'alertdialog' : 'dialog'}
			>
				<div className={cx( 'icon-container' )}>
					{status === 'error' && <NotificationErrorIcon />}
					{status === 'success' && <NotificationSuccessIcon />}
					{status === 'warning' && <NotificationWarningIcon />}
				</div>
				<p className={cx( 'message' )} id={`dialog-message-${id}`}>{message}</p>
				<button
					className={cx( 'dismiss' )}
					onClick={dismiss}
					ref={this.closeButtonRef}
				>
					<span className={cx( 'label' )}>Dismiss</span>
				</button>
			</div>
		);
	}
}

Notification.propTypes = {
	dismiss: PropTypes.func.isRequired,
	dismissed: PropTypes.bool.isRequired,
	id: PropTypes.number.isRequired,
	message: PropTypes.string.isRequired,
	status: PropTypes.oneOf( [ 'error', 'success', 'warning' ] ),
	timeVisible: PropTypes.number.isRequired,
};

Notification.defaultProps = {
	dismissed: false,
	timeVisible: 3000,
};

const mapDispatchToProps = ( dispatch, ownProps ) => ( {
	dismiss: () => dispatch( dismissNotification( ownProps.id ) ),
} );

export default connect( null, mapDispatchToProps )( Notification );
