import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './EmailCheckboxList.scss';
import ExpandArrowDown from 'svgs/expand-arrow-down.svg';
import { Button, Checkbox } from '@quartz/interface';
import {
	withProps,
} from 'helpers/wrappers';
import classnames from 'classnames/bind';
import emails, { emailList } from 'config/emails';

const cx = classnames.bind( styles );

const EmailCheckbox = ( { handleChange, checkboxLabel, checked, emailDescription } ) => (
	<li className={cx( 'checkbox-wrapper' )}>
		<Checkbox
			checked={checked}
			onChange={handleChange}
			size="large"
		>
			<p className={cx( 'checkbox-title' )}>
				{checkboxLabel}
			</p>
			{emailDescription && (
				<span className={cx( 'checkbox-copy' )}>{emailDescription}</span>
			)}
		</Checkbox>
	</li>
);

EmailCheckbox.propTypes = {
	checkboxLabel: PropTypes.string,
	checked: PropTypes.bool.isRequired,
	emailDescription: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
};

const EmailCheckboxInner = ( { checkboxes } ) => {
	const [ visible, setVisible ] = useState( false );
	return (
		<ul className={cx( 'checks' )}>
			{
				checkboxes.map( ( { listId, checked, description, label, toggle }, idx ) => {
					// don't show all the checkboxes unless the user clicks the button
					if ( !visible && idx > 2 ) {
						return null;
					}
					return (
						<EmailCheckbox
							key={listId}
							checkboxLabel={label || 'E-mail'}
							checked={checked}
							handleChange={toggle}
							emailDescription={description}
						/>
					);
				} )
			}
			{
				!visible && (
					<li className={cx( 'view-more' )}>
						<Button inline={true} onClick={() => setVisible( true )}>
							View all newsletters
							<ExpandArrowDown className={cx( 'arrow-down' )} />
						</Button>
					</li>
				)
			}
		</ul>
	);
};

EmailCheckboxInner.propTypes = {
	checkboxes: PropTypes.arrayOf( PropTypes.object ),
};

const EmailCheckboxList = withProps( ( { checkboxListIds, selectedIds, toggleCheckbox } ) => ( {
	// use the ordered email list to create a props object
	checkboxes: emailList.reduce( ( accum, slug ) => {
		const email = emails[slug];
		const isCheckbox = checkboxListIds.includes( email?.listId );
		// don't create a checkbox for something like Quartz Japan
		if ( !email || !isCheckbox ) {
			return accum;
		}
		const { listId, name, shortDescription } = email;
		const toggle = () => toggleCheckbox( listId );
		const checked = selectedIds.includes( listId );
		return [ ...accum, {
			listId,
			toggle,
			checked,
			label: name,
			description: shortDescription,
		} ];
	}, [] ),
} ) )( EmailCheckboxInner );

EmailCheckboxList.propTypes = {
	checkboxListIds: PropTypes.arrayOf( PropTypes.number ).isRequired,
	selectedIds: PropTypes.arrayOf( PropTypes.number ).isRequired,
	toggleCheckbox: PropTypes.func.isRequired,
};

export default EmailCheckboxList;
