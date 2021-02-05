import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'helpers/compose';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames/bind';
import styles from './DrawerMenu.scss';
import { withAmp } from 'helpers/wrappers';

const cx = classnames.bind( styles );

// @TODO: This should be an AMP-compatibile replacement.
const DrawerMenuAmp = () => null;

export class DrawerMenu extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			hideFromTabIndex: true,
			showChildren: false,
		};

		this.clickOutsideDetection = this.clickOutsideDetection.bind( this );
		this.setContentsRef = this.setContentsRef.bind( this );
	}

	static getDerivedStateFromProps( props ) {
		// The first time the component receives inView: true, we will show children and
		// continue to do so as many times as the drawer is opened/closed.
		if ( props.inView ) {
			return {
				showChildren: true,
			};
		}

		return null;
	}

	componentDidMount() {
		const { closeDropdown, history } = this.props;

		this.unlistenToRouteChange = history.listen( closeDropdown );
	}

	componentWillUnmount() {
		this.unlistenToRouteChange();
		clearAllBodyScrollLocks();
	}

	componentDidUpdate( prevProps ) {
		const { inView } = this.props;

		if ( inView && ! prevProps.inView ) {
			return this.onDrawerOpen();
		}

		if ( ! inView && prevProps.inView ) {
			return this.onDrawerClose();
		}
	}

	clickOutsideDetection( e ) {
		if ( ! this.contentsEl.contains( e.target ) ) {
			this.props.closeDropdown();
		}
	}

	onDrawerOpen() {
		// Focus the element for good accessiblity
		this.contentsEl.focus();

		disableBodyScroll( this.contentsEl );

		this.setState( {
			hideFromTabIndex: false,
		} );

		// Jump-scroll past the marquee ad, if necessary
		const elTop = parseInt( window.getComputedStyle( this.contentsEl ).top, 10 );
		const { y } = this.contentsEl.parentElement.getBoundingClientRect();
		const elOffsetY = y - elTop;

		// Detect clicks outside the menu container
		document.addEventListener( 'click', this.clickOutsideDetection );

		if ( elOffsetY > 0 ) {
			window.scrollTo( 0, elOffsetY + window.scrollY );
		}
	}

	onDrawerClose() {
		clearAllBodyScrollLocks();
		document.removeEventListener( 'click', this.clickOutsideDetection );

		window.setTimeout( () => {
			this.setState( {
				hideFromTabIndex: true,
			} );
		}, 250 );
	}

	setContentsRef( el ) {
		this.contentsEl = el;
	}

	render() {
		const { hideFromTabIndex, showChildren } = this.state;
		const { align, children, inView } = this.props;

		return (
			<div aria-hidden={!inView} className={cx( 'container' )}>
				<div className={cx( 'menu-container', align, { hideFromTabIndex } )} ref={this.setContentsRef}>
					{showChildren && children}
				</div>
				<div className={cx( 'background', { visible: inView } )} />
			</div>
		);
	}
}

DrawerMenu.propTypes = {
	align: PropTypes.oneOf( [ 'left', 'right' ] ).isRequired,
	children: PropTypes.node,
	closeDropdown: PropTypes.func.isRequired,
	history: PropTypes.shape( {
		listen: PropTypes.func.isRequired,
	} ).isRequired,
	inView: PropTypes.bool.isRequired,
};

DrawerMenu.defaultProps = {
	align: 'left',
	inView: false,
};

export default compose(
	withAmp( DrawerMenuAmp ),
	withRouter
)( DrawerMenu );
