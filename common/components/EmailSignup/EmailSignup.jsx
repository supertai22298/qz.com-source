import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import compose from 'helpers/compose';
import styles from './EmailSignup.scss';
import Input from 'components/Input/Input';
import Link from 'components/Link/Link';
import SubscribeCTAs from 'components/SubscribeCTAs/SubscribeCTAs';
import EmailCheckboxList from './EmailCheckboxList/EmailCheckboxList';
import { Button } from '@quartz/interface';
import { viewNewsletterModule, clickNewsletterModule, submitNewsletterModule } from 'helpers/tracking/actions';
import useUserRegistration from 'helpers/hooks/useUserRegistration';
import {
	withProps,
	withQueryParamData,
} from 'helpers/wrappers';
import { useEmailSubmit, useClientSideUserData } from 'helpers/hooks';
import classnames from 'classnames/bind';
import emails from 'config/emails';
import { offerCodeDiscount } from 'config/membership';
import useTracking, { useTrackingOnView } from 'helpers/hooks/useTracking';

const cx = classnames.bind( styles );

// generic container that provides the styling for a "wrapped" EmailSignup container, i.e. with border + background
export const EmailSignupContainer = ( { children } ) => (
	<div className={cx( 'wrapper' )}>
		{children}
	</div>
);

EmailSignupContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export const EmailSignup = ( {
	buttonText,
	checkboxListIds,
	email,
	emailName,
	id,
	handleChange,
	hideEmailOptions,
	listIds,
	onSignupConfirmed,
	placeholder,
	referredByEmail,
	registerUser,
	title,
	trackingData,
	trackFocus,
	viewRef,
} ) => {
	const [ primarySignupConfirmed, setPrimarySignupConfirmed ] = useState( false );
	const [ allSignupsConfirmed, setAllSignupsConfirmed ] = useState( false );
	const { isLoggedIn, isMember } = useClientSideUserData();

	const {
		emailAddress,
		handleEmailSubmit,
		setEmail,
		toggleCheckbox,
		inputStatus,
		selectedIds,
		loading,
		error,
		showErrors,
	} = useEmailSubmit( {
		email,
		handleChange,
		isLoggedIn,
		listIds,
		onSignupConfirmed: useCallback( ( response ) => {
			// if this is the first signup step (email input), set primary signup confirmed
			if ( !primarySignupConfirmed ) {
				setPrimarySignupConfirmed( true );
			}
			// if this is the second signup step (checkboxes), show thank you message
			// if we're hiding additional email options, skip the checkbox step
			if ( primarySignupConfirmed || hideEmailOptions ) {
				setAllSignupsConfirmed( true );
			}
			onSignupConfirmed( response );
		}, [ hideEmailOptions, primarySignupConfirmed, setAllSignupsConfirmed, onSignupConfirmed ] ),
		referredByEmail,
		registerUser,
	} );

	const trackSubmit = useTracking( submitNewsletterModule, { ...trackingData, listIds: selectedIds } );

	if ( allSignupsConfirmed && !loading ) {
		// "stage 3" - thank-you message for signing up & CTA to subscribe
		return (
			<div className={cx( 'container', inputStatus )}>
				<p className={cx( 'confirmation-text' )}>
					You’re all set.
					{
						!isMember && <span> Since you’re here, take {offerCodeDiscount} off Quartz Membership today.</span>
					}
				</p>
				{
					!isMember && (
						<Fragment>
							<p className={cx( 'member-link' )}>Membership gets you <Link to="/subscribe/">unlimited access</Link> to our business journalism with a global perspective.</p>
							<SubscribeCTAs
								showLogin={false}
								style="side-by-side"
								subscribeLabel={<Fragment>Let’s do it <span role="img" aria-label="thumbs-up">👍</span></Fragment>}
								trackingContext="email-signup"
							/>
						</Fragment>
					)
				}
			</div>
		);
	}

	return (
		<form
			onSubmit={( e ) => {
				e.preventDefault();
				handleEmailSubmit();
				trackSubmit();
			}}
			className={cx( 'container' )}
			ref={viewRef}
		>
			{
				title &&
				primarySignupConfirmed
					? <Fragment>
						<p className={cx( 'thanks' )}>
							<span role="img" className={cx( 'party' )} aria-label="party-popper">🎉</span>
							{`You’re signed up${emailName ? ` for ${emailName}.` : '.' }`}
						</p>
						<p className={cx( 'want-more' )}>Want more Quartz in your inbox?</p>
					</Fragment>
					: <p className={cx( 'title' )}>{title}</p>
			}
			<div className={cx( 'content' )}>
				{
					// "stage 1" - email input + primary email signup
					!primarySignupConfirmed && (
						<Fragment>
							<div className={cx( 'email' )}>
								<Input
									id={id}
									handleChange={setEmail}
									placeholder={placeholder}
									value={emailAddress}
									status={inputStatus}
									handleFocus={trackFocus}
									type="email"
									aria-label={placeholder}
									invalid={!!error}
								/>
								{showErrors && error && (
									<div
										className={cx( 'error-message' )}
										dangerouslySetInnerHTML={{ __html: error }}
									/>
								)}
							</div>
							<div className={cx( 'button-wrapper' )}>
								<Button loading={loading} type="submit">{buttonText}</Button>
							</div>
						</Fragment>
					)
				}
				{
					// "stage 2" - show a list of checkboxes for additional email signups
					primarySignupConfirmed && (
						<Fragment>
							<EmailCheckboxList
								checkboxListIds={checkboxListIds}
								selectedIds={selectedIds}
								toggleCheckbox={toggleCheckbox}
							/>
							<div className={cx( 'check-ctas' )}>
								<div className={cx( 'button' )}>
									<Button loading={loading} type="submit">
										{buttonText}
									</Button>
								</div>
								<div className={cx( 'button' )}>
									<Button onClick={() => setAllSignupsConfirmed( true )} variant="secondary">
										No thanks
									</Button>
								</div>
							</div>
							{showErrors && error && (
								<div
									className={cx( 'error-message' )}
									dangerouslySetInnerHTML={{ __html: error }}
								/>
							)}
						</Fragment>
					)
				}
			</div>
			<p
				className={cx( 'disclaimer' )}
			>
				By providing your email, you agree to the <Link to="/about/privacy-policy/">Quartz Privacy Policy</Link>.
			</p>
		</form>
	);
};

EmailSignup.propTypes = {
	buttonText: PropTypes.string,
	checkboxListIds: PropTypes.array,
	email: PropTypes.string,
	emailName: PropTypes.string,
	handleChange: PropTypes.func,
	hideEmailOptions: PropTypes.bool,
	id: PropTypes.string.isRequired,
	// note - listIds order matters
	// first ID in the list is the primary ID for the component
	listIds: PropTypes.arrayOf( PropTypes.number ).isRequired,
	onSignupConfirmed: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	referredByEmail: PropTypes.string,
	registerUser: PropTypes.func.isRequired,
	title: PropTypes.node,
	trackFocus: PropTypes.func.isRequired,
	trackingData: PropTypes.object.isRequired,
	viewRef: PropTypes.func,
};

EmailSignup.defaultProps = {
	buttonText: 'Sign me up',
	handleChange: () => {},
	hideEmailOptions: false,
	placeholder: 'Enter your email',
	onSignupConfirmed: () => {},
	title: '',
	referredByEmail: null,
};

function EmailSignupWithHooks( { trackingData, ...props } ) {
	const { registerUser } = useUserRegistration();
	const trackFocus = useTracking( clickNewsletterModule, trackingData );
	const viewRef = useTrackingOnView( viewNewsletterModule, trackingData );

	return (
		<EmailSignup
			registerUser={registerUser}
			trackingData={trackingData}
			trackFocus={trackFocus}
			viewRef={viewRef}
			{...props}
		/>
	);
}

EmailSignupWithHooks.propTypes = {
	trackingData: PropTypes.object,
};

const getEmailName = ( listId ) => {
	const emailSlug = Object.keys( emails ).find( email => emails[email].listId === listId );
	return emailSlug ? emails[emailSlug].name : '';
};

export default compose(
	withQueryParamData(),
	withProps( ( { listIds, location } ) => ( {
		id: `email-signup-${listIds.join( '-' )}`,
		// remove the primary email ID from the checkbox list
		checkboxListIds: Object.keys( emails ).reduce( ( accum, email ) => {
			const listEmailId = emails[email].listId;
			if ( !listIds.includes( listEmailId ) ) {
				return [ ...accum, listEmailId ];
			}
			return accum;
		}, [] ),
		emailName: getEmailName( listIds[0] ),
		trackingData: {
			location,
			listId: listIds.join( '|' ),
		},
	} ) )
)( EmailSignupWithHooks );
