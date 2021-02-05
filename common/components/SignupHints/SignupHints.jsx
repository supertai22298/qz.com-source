import React from 'react';
import PropTypes from 'prop-types';
import styles from './SignupHints.scss';
import Link from 'components/Link/Link';

function LoginLink ( { language } ) {
	if ( 'ja' === language ) {
		return <>すでにアカウントをお持ちですか <Link to="/login/">ログイン</Link></>;
	}

	return <>Already have an account? <Link to="/login/">Log in.</Link></>;
}

LoginLink.propTypes = {
	language: PropTypes.oneOf( [ 'en', 'ja' ] ).isRequired,
};

function SignupHints ( {
	align,
	language,
	showQuartzJapanContext,
	showQuartzJapanLink,
	showLogin,
} ) {
	return (
		<div className={`${styles.container} ${styles[ align ]}`}>
			{
				showLogin &&
					<p className={styles.hint}>
						<LoginLink language={language} />
					</p>
			}
			{
				showQuartzJapanLink &&
					<p className={styles.hint}>
						{
							showQuartzJapanContext &&
							<>こちらは英語版への登録ページです。<br /></>
						}
						Quartz Japanへの登録をご希望の方は<Link to="/japan/">こちら</Link>から。
					</p>
			}
		</div>
	);
}

SignupHints.propTypes = {
	align: PropTypes.oneOf( [ 'center', 'left' ] ).isRequired,
	language: PropTypes.oneOf( [ 'en', 'ja' ] ).isRequired,
	showLogin: PropTypes.bool.isRequired,
	showQuartzJapanContext: PropTypes.bool.isRequired,
	showQuartzJapanLink: PropTypes.bool.isRequired,
};

SignupHints.defaultProps = {
	align: 'left',
	language: 'en',
	showLogin: true,
	showQuartzJapanContext: true,
	showQuartzJapanLink: false,
};

export default SignupHints;
