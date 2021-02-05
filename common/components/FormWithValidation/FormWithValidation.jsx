import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import compose from 'helpers/compose';
import useCaptchaSetup from 'helpers/hooks/useCaptchaSetup';
import { trackFormSubmit, trackFormView } from 'helpers/tracking/actions';
import { withTracking, withVisibilityTracking } from 'helpers/wrappers';
import { Button } from '@quartz/interface';
import styles from './FormWithValidation.scss';

const cx = classnames.bind( styles );

const CAPTCHA_BUTTON_ID = 'captcha_button';

export const FormWithValidation = ( {
	children,
	loading,
	error,
	inline,
	onSubmit: originalOnSubmit,
	submitText,
	useCaptcha,
} ) => {
	const wrappedOnSubmit = useCaptchaSetup( useCaptcha, originalOnSubmit );
	const formRef = useRef();

	const onSubmit = evt => {
		if ( evt ) {
			evt.preventDefault();
		}

		if ( !formRef.current.checkValidity() ) {
			return;
		}

		wrappedOnSubmit( evt );
	};

	return (
		<form
			className={cx( 'container', { styleInline: inline } )}
			noValidate // This disables HTML validation before the user submits the form. We run validation ourselves with .checkValidity()
			onSubmit={onSubmit}
			ref={formRef}
		>
			<div className={cx( 'contents', { styleInline: inline } )}>
				{children}
			</div>
			<div className={cx( 'button', { styleInline: inline } )}>
				<Button loading={loading} type="submit">{submitText}</Button>
			</div>
			{
				error &&
				<span className={cx( 'error' )}>{error}</span>
			}
			{
				useCaptcha && <div id={CAPTCHA_BUTTON_ID} />
			}
		</form>
	);
};

FormWithValidation.propTypes = {
	children: PropTypes.node,
	error: PropTypes.node,
	inline: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	submitText: PropTypes.string.isRequired,
	useCaptcha: PropTypes.bool.isRequired,
};

FormWithValidation.defaultProps = {
	inline: false,
	submitText: 'Submit',
	useCaptcha: false,
};

export default compose(
	withTracking( { onSubmit: trackFormSubmit } ),
	withVisibilityTracking( { onMount: trackFormView } )
)( FormWithValidation );
