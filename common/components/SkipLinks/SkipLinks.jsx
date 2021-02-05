import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './SkipLinks.scss';
import { makeTabbableOnceAndFocus } from 'helpers/dom';

class SkipLinks extends Component {
	constructor( props ) {
		super( props );

		this.focusTargetElement = this.focusTargetElement.bind( this );
	}

	focusTargetElement( e ) {
		/*
			When the user clicks the skip link we want to focus the target
			element. This means adding a tabindex attribute, focusing, then
			removing the attribute.

			This addresses a bug in Safari iOS where a user may get
			tab-trapped using skip links that only go to anchors and do not
			move focus (https://axesslab.com/skip-links/)
		*/
		const destinationId = e.target.getAttribute( 'href' ).substr( 1 );
		const destination = document.getElementById( destinationId );

		if ( destination ) {
			makeTabbableOnceAndFocus( destination );
		}
	}

	render() {
		return (
			<Fragment>
				{
					! this.props.hideNavigation &&
						<a onClick={this.focusTargetElement} className={styles.link} href="#site-navigation">Skip to navigation</a>
				}
				<a onClick={this.focusTargetElement} className={styles.link} href="#site-content">Skip to content</a>
			</Fragment>
		);
	}
}

SkipLinks.propTypes = {
	hideNavigation: PropTypes.bool.isRequired,
};

export default SkipLinks;
