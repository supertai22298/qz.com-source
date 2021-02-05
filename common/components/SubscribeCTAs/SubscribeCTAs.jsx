import React from 'react';
import PropTypes from 'prop-types';
import compose from 'helpers/compose';
import { LoginLink, SubscribeLink } from 'components/AccountLink/AccountLink';
import styles from './SubscribeCTAs.scss';
import classnames from 'classnames/bind';
import { withUserRole } from 'helpers/wrappers';
import withConditionalRendering from '../../helpers/wrappers/withConditionalRendering';

const cx = classnames.bind( styles );

export const SubscribeCTAs = ( {
	isLoggedIn,
	loginLabel,
	showLogin,
	showSubscribe,
	style,
	subscribeLabel,
	subscribeUrl,
	trackingContext,
} ) => (
	<div
		className={cx( 'container', { [`style-${style}`]: style } )}
	>
		<div className={cx( 'primary', { [`style-${style}`]: style } )}>
			{
				showSubscribe && (
					<SubscribeLink
						buttonVariant="primary"
						url={subscribeUrl}
						trackingContext={trackingContext}
					>
						{subscribeLabel}
					</SubscribeLink>
				)
			}
		</div>
		{
			!isLoggedIn && showLogin &&
			<div className={cx( 'secondary', { [`style-${style}`]: style } )}>
				<LoginLink
					buttonVariant="secondary"
					trackingContext={trackingContext}
				>{loginLabel}</LoginLink>
			</div>
		}
	</div>
);

SubscribeCTAs.defaultProps = {
	showLogin: true,
	showSubscribe: true,
};

SubscribeCTAs.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	loginLabel: PropTypes.string,
	showLogin: PropTypes.bool,
	showSubscribe: PropTypes.bool,
	style: PropTypes.oneOf( [ 'side-by-side', 'side-by-side-small', 'guide-cta' ] ),
	subscribeLabel: PropTypes.oneOfType( [ PropTypes.string, PropTypes.node ] ),
	subscribeUrl: PropTypes.string,
	trackingContext: PropTypes.string.isRequired,
};

export default compose(
	withUserRole(),
	withConditionalRendering( ( { isMember } ) => !isMember )
)( SubscribeCTAs );
