import React from 'react';
import compose from 'helpers/compose';
import PropTypes from 'prop-types';
import { Button, Spinner } from '@quartz/interface';
import Checkmark from 'svgs/check.svg';
import styles from './Input.scss';
import classnames from 'classnames/bind';
import { trackFormFieldFocus } from 'helpers/tracking/actions';
import {
	withTracking,
	withFieldState,
	defaultProps,
	withProps,
} from 'helpers/wrappers';
import withPasswordToggle from './components/withPasswordToggle';

const cx = classnames.bind( styles );

export class Input extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			invalid: false,
		};

		this.handleChange = this.handleChange.bind( this );
		this.onInvalid = this.onInvalid.bind( this );
	}

	handleChange( event ) {
		this.setState( {
			invalid: false,
		} );

		this.props.handleChange( event.target.value );
	}

	onInvalid() {
		this.setState( {
			invalid: true,
		} );
	}

	render() {
		const {
			autoComplete,
			buttonProps,
			defaultValue,
			handleBlur,
			handleClick,
			handleFocus,
			handleKeyPress,
			handleToggleClick,
			id,
			inputRef,
			isMultiline,
			label,
			maxLength,
			name,
			pattern,
			placeholder,
			readOnly,
			required,
			status,
			statusText,
			subtext,
			toggleActive,
			toggleText,
			type,
			value,
		} = this.props;
		const { invalid } = this.state;

		const descriptionElId = `${id}-description`;

		const requiredField = label && required;
		const optionalField = label && !requiredField;

		// Props used by both <input> and <textarea>.
		const sharedProps = {
			autoComplete,
			defaultValue,
			id,
			maxLength,
			name,
			placeholder,
			readOnly,
			value,
			'aria-describedby': subtext ? descriptionElId : undefined,
			'aria-invalid': invalid,
			onBlur: handleBlur,
			onChange: this.handleChange,
			onClick: handleClick,
			onFocus: handleFocus,
			onKeyPress: handleKeyPress,
			onInvalid: this.onInvalid,
			pattern,
			ref: inputRef,
			required,
			title: subtext,
		};

		// ClassNames used by both <input> and <textarea>.
		const sharedClassNames = {
			readOnly,
			[`status-${status}`]: status,
			[type]: type,
		};

		return (
			<div className={cx( 'container', { [`status-${status}`]: status, invalid } )}>
				<div className={cx( 'inner', { toggleVisibility: toggleText } )}>
					{
						requiredField &&
							<div
								className={cx( 'required-label' )}
								title="Required"
							>
								<label className={cx( 'label' )} htmlFor={id}>
									{label}
								</label>
								<sup className={cx( 'required-asterisk' )}> * </sup>
							</div>
					}

					{
						optionalField &&
						<label className={cx( 'label' )} htmlFor={id}>
							{label}
						</label>
					}

					{
						isMultiline &&
						<textarea
							className={cx( 'textarea', { ...sharedClassNames } )}
							rows={6}
							{...sharedProps}
						/>
					}

					{
						!isMultiline &&
						<div className={cx( 'input-group' )}>
							<input
								className={cx( 'input', { ...sharedClassNames } )}
								type={type}
								{...sharedProps}
							/>
							{
								buttonProps &&
								<div className={cx( 'input-button' )}>
									<Button {...buttonProps} />
								</div>
							}
						</div>
					}

					{
						toggleText && handleToggleClick &&
						<div className={cx( 'toggle' )}>
							<Button
								checked={toggleActive}
								inline={true}
								onClick={handleToggleClick}
								role="switch"
								type="button"
							>
								{toggleText}
							</Button>
						</div>
					}

					{
						[ 'confirmed', 'valid' ].includes( status ) &&
						<div className={cx( 'status' )}>
							<Checkmark
								className={cx( 'check' )}
							/>
							{statusText && <span className={cx( 'status-text' )}>{statusText}</span>}
						</div>
					}

					{
						status === 'loading' &&
						<div className={cx( 'spinner' )}>
							<Spinner />
						</div>
					}
				</div>
				{
					subtext &&
					<div
						id={descriptionElId}
						className={cx( 'subtext', { [`status-${status}`]: status, invalid } )}
					>
						{subtext}
					</div>
				}
			</div>
		);
	}
}

Input.propTypes = {
	autoComplete: PropTypes.string,
	buttonProps: PropTypes.shape( {
		children: PropTypes.node.isRequired,
		onClick: PropTypes.func.isRequired,
		loading: PropTypes.bool.isRequired,
	} ),
	defaultValue: PropTypes.string,
	handleBlur: PropTypes.func.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleClick: PropTypes.func,
	handleFocus: PropTypes.func.isRequired,
	handleKeyPress: PropTypes.func,
	handleToggleClick: PropTypes.func,
	id: PropTypes.string.isRequired,
	inputRef: PropTypes.object,
	isMultiline: PropTypes.bool.isRequired,
	label: PropTypes.string,
	maxLength: PropTypes.number,
	name: PropTypes.string,
	pattern: PropTypes.string,
	placeholder: PropTypes.string,
	readOnly: PropTypes.bool,
	required: PropTypes.bool.isRequired,
	status: PropTypes.string,
	statusText: PropTypes.string,
	subtext: PropTypes.node,
	toggleActive: PropTypes.bool,
	toggleText: PropTypes.string,
	type: PropTypes.oneOf( [ 'text', 'email', 'password' ] ),
	value: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.number,
	] ),
};

Input.defaultProps = {
	handleBlur: () => {},
	handleChange: () => {},
	handleFocus: () => {},
	isMultiline: false,
	required: false,
	type: 'text',
};

const WrappedInput = compose(
	withTracking( {
		handleFocus: trackFormFieldFocus,
	} )
)( Input );

export default WrappedInput;

export const PasswordInput = compose(
	withProps( { type: 'password' } ),
	withPasswordToggle()
)( Input );

export const EmailInput = compose(
	withProps( { type: 'email' } ),
	defaultProps( { placeholder: 'e.g. example@qz.com' } )
)( Input );

export const InputField = compose(
	withFieldState()
)( WrappedInput );

export const EmailField = compose(
	withProps( { type: 'email' } ),
	defaultProps( { placeholder: 'e.g. example@qz.com' } )
)( InputField );

export const PasswordField = compose(
	withProps( { type: 'password' } ),
	defaultProps( {
		placeholder: 'Enter a new password',
		maxLength: 64,
	} ),
	withPasswordToggle()
)( InputField );

export const TextAreaField = compose(
	withProps( { isMultiline: true } )
)( InputField );
