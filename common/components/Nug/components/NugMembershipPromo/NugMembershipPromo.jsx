import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './NugMembershipPromo.scss';
import { SubscribeLink } from 'components/AccountLink/AccountLink';
import useUserRole from 'helpers/hooks/useUserRole';
import { offerCode, offerCodeDiscount } from 'config/membership';

const NugMembershipPromo = ( { promoText } ) => {

	const { isMember } = useUserRole();

	if ( isMember || ! promoText ) {
		return null;
	}

	return (
		<Fragment>
			<p className={styles.description}>
				{promoText}
				{
					offerCodeDiscount && offerCode &&
					<span>{` For a limited time, become a Quartz member for ${offerCodeDiscount} off. Use promo code `}<strong>{`${offerCode}`}</strong> at checkout.</span>
				}
			</p>
			<SubscribeLink trackingContext="center well nug promo" buttonVariant="primary">
				<span role="img" aria-label="sparkles">✨</span> Become a Quartz member <span role="img" aria-label="sparkles">✨</span>
			</SubscribeLink>
		</Fragment>
	);
};

NugMembershipPromo.propTypes = {
	promoText: PropTypes.string.isRequired,
};

export default NugMembershipPromo;
