import React, { Fragment } from 'react';
import Link from 'components/Link/Link';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import SubscribeCTAs from 'components/SubscribeCTAs/SubscribeCTAs';
import styles from './MembershipCTA.scss';
import useLocalization from 'helpers/hooks/useLocalization';
import { offerCodeCtaText } from 'config/membership';

const cx = classnames.bind( styles );

export const MembershipHeader = ( { description, title } ) => (
	<Fragment>
		<h2 className={cx( 'title' )}>{title}</h2>
		<p className={cx( 'description' )}>{description}</p>
	</Fragment>
);

MembershipHeader.propTypes = {
	description: PropTypes.node.isRequired,
	title: PropTypes.node.isRequired,
};

const MembershipText = ( { type } ) => {
	if ( 'paid' === type ) {
		// currently quartz-japan is our only paid type of email
		// we may want to use localize to translate once there are more types of paid emails
		return (
			<MembershipHeader
				description={
					<Fragment>
						<Link to="/japan/subscribe/email/">7日間の無料トライアル</Link>に申し込むと、<Link to="/japan/subscribe/email/">Quartz Japan</Link>から「今知るべき」グローバルニュースを、平日の朝夕、ニュースレター（日本語）でお届けします。また、Quartz（英語）のウェブを含む、すべてのコンテンツにアクセスできます。
					</Fragment>
				}
				title="こちらはQuartz Japan会員限定の有料コンテンツです"
			/>
		);
	}

	return (
		<MembershipHeader
			description="Your membership supports a team of global Quartz journalists reporting on the forces shaping our world. We make sense of accelerating change and help you get ahead of it with business news for the next era, not just the next hour. Subscribe to Quartz today."
			title="Enrich your perspective. Embolden your work. Become a Quartz member."
		/>
	);
};

MembershipText.propTypes = {
	type: PropTypes.string.isRequired,
};

const dictionary = {
	ja: {
		'Log in': 'ログインして読む',
		[ offerCodeCtaText ]: 'Quartz Japanをはじめよう',
	},
};

const MembershipCTA = ( { isLoggedIn, language, showText, trackingContext, type } ) => {
	const localize = useLocalization( { dictionary, language } );
	return (
		<div className={cx( 'container', type, { unpadded: !showText } )}>
			{showText && <MembershipText type={type} />}
			<div className={cx( 'cta-container', { left: !showText } )}>
				<SubscribeCTAs
					isLoggedIn={isLoggedIn}
					loginLabel={localize( 'Log in' )}
					subscribeLabel={localize( offerCodeCtaText )}
					subscribeUrl={language === 'ja' ? '/japan/subscribe/email/' : '/subscribe/'}
					trackingContext={trackingContext}
					style="guide-cta"
				/>
			</div>
		</div>
	);
};

MembershipCTA.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	language: PropTypes.string.isRequired,
	showText: PropTypes.bool.isRequired,
	trackingContext: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
};

MembershipCTA.defaultProps = {
	language: 'en',
	showText: true,
};

export default MembershipCTA;
