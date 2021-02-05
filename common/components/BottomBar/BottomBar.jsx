import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './BottomBar.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

// In-memory indicator of whether bar has been dismissed.
let hasBeenDismissed = false;

const BottomBar = ( {
	children,
	dismissible,
	id,
	visible,
} ) => {
	const [ dismissed, setDismissed ] = useState( hasBeenDismissed );
	const onDismiss = () => {
		hasBeenDismissed = true;
		setDismissed( true );
	};

	return (
		<div
			aria-labelledby="bottom-bar-primary-text"
			className={cx( 'container', { visible: ! dismissed && visible } )}
			id={id}
			role="dialog"
		>
			<div className={cx( 'inner-container' )} id="bottom-bar-primary-text">
				{children}
			</div>
			{
				dismissible &&
					<button
						className={cx( 'close' )}
						onClick={onDismiss}
						type="button"
					>
						<span className={cx( 'label' )}>Close</span>
					</button>
			}
		</div>
	);
};

BottomBar.propTypes = {
	children: PropTypes.node.isRequired,
	dismissible: PropTypes.bool.isRequired,
	id: PropTypes.string,
	visible: PropTypes.bool.isRequired,
};

BottomBar.defaultProps = {
	dismissible: true,
	visible: true,
};

export default BottomBar;
