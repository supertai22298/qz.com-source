import React from 'react';
import PropTypes from 'prop-types';
import Gpt from './Gpt.jsx';
import { connect } from 'react-redux';
import compose from 'helpers/compose';
import styles from './AdUnit.scss';
import classnames from 'classnames/bind';
import { decodeRelayId } from 'helpers/graphql';
import { uppercaseFirstLetter } from 'helpers/text';
import { trackError as onError } from 'helpers/tracking/actions';
import { getUrlParameter } from 'helpers/urls';
import { withTracking } from 'helpers/wrappers';
import { setMarqueeAdUnit } from 'components/Ad/Marquee/action/index.js';
import usePageVariant from 'helpers/hooks/usePageVariant';
import useUserRole from 'helpers/hooks/useUserRole';

const adTypeMapping = {
	'medium-rectangle': [ [ 300, 250 ] ],
	concert: [ [ 360, 560 ], [ 520, 313 ], [ 640, 380 ] ],
	halfpage: [ [ 300, 600 ] ],
	inline: [ [ 360, 203 ], [ 520, 293 ], [ 640, 363 ] ],
	engage: [ [ 600, 431 ], [ 1400, 521 ], [ 1600, 521 ] ],
	spotlight: [ [ 600, 600 ], [ 1200, 1200 ], [ 2000, 2000 ] ],
	bulletin: [ [ 1, 1 ] ],
	marquee: [ [ 640, 360 ], [ 1400, 520 ], [ 1600, 520 ] ],
	billboard: [ [ 970, 250 ] ],
	leaderboard: [ [ 728, 90 ] ],
	'mobile-leaderboard': [ [ 320, 50 ] ],
	'super-leaderboard': [ [ 970, 90 ] ],
};

const cx = classnames.bind( styles );

// pass a split targeting param into every ad call thats either a or b
const split = Math.round( Math.random() ) ? 'a' : 'b';

// query string params that can be key/value targets
const queryStringKeys = [ 'apt', 'utm_source' ];

// the entry targeting keys
const entryTargetingKeys = [ 'topic', 'obsession' ];

// flag to tell us when to get entry targeting
let getEntryTargeting = true;

// store entry targeting here
const entryTargeting = {};

/**
 * Combine the passed targeting params with global params
 * @param {object} targets
 * @return {object}
 */
export const addGlobalTargeting = ( targets ) => {
	const newTargets = { ...targets };

	// add query string targeting params
	queryStringKeys.forEach( ( key ) => {
		const param = getUrlParameter( key );
		if ( param.length ) {
			newTargets[key] = param;
		}
	} );

	// add split param
	newTargets.split = split;

	// gather entry targeting if this is the first ad call
	if ( getEntryTargeting ) {

		entryTargetingKeys.forEach( ( key ) => {
			if ( targets[key] ) {
				const newKey = uppercaseFirstLetter( key );
				entryTargeting[`entry${newKey}`] = targets[key];
			}
		} );

		getEntryTargeting = false;
	}

	// set entry targeting
	Object.keys( entryTargeting ).forEach( ( key ) => {
		newTargets[key] = entryTargeting[key];
	} );

	return newTargets;
};

/**
 * Determines the ad type based on the size
 * @param {string} size
 * @param {string} defaultType
 * @return {string}
 */
export const getAdType = ( size, defaultType = 'unknown' ) => {
	const keys = Object.keys( adTypeMapping );
	const type = keys.find( key => adTypeMapping[key].some( slotSize => slotSize[0] === size[0] && slotSize[1] === size[1] ) );

	if ( type ) {
		return type;
	}

	return defaultType;
};

export class AdUnit extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			type: props.type,
			loaded: props.loaded,
		};

		this.onSlotRenderEnded = this.onSlotRenderEnded.bind( this );
	}

	// Catch and report any ad errors so they don't ruin our day.
	componentDidCatch( error ) {
		this.props.onError( error );
	}

	onSlotRenderEnded( event ) {
		const { isEmpty, size } = event;
		const { onSlotRenderEnded, type, onSetMarqueeAdUnit } = this.props;

		if ( !isEmpty ) {
			this.setState( {
				type: getAdType( size, type ),
				loaded: true,
			}, () => {
				if ( 'marquee' === type ) {
					onSetMarqueeAdUnit( `${this.state.type}-${type}` );
				}
			} );
		}

		if ( onSlotRenderEnded ) {
			onSlotRenderEnded( event );
		}
	}

	render() {
		const {
			className,
			context,
			currentArticleId,
			edition,
			id,
			isAmp,
			isMember,
			marqueeActive,
			path,
			targeting,
			waitForMarquee,
			type: adType,
			visitorId: permanentId,
		} = this.props;

		// add is/is not member logic to whatever other targets exist
		const newTargeting = addGlobalTargeting( { ...targeting, member: isMember ? '1' : '0', permanentId } );
		newTargeting.adType = adType; // for differentiating 1x1 ad slots

		// The ID of the currently-viewed content, if applicable. This may get more
		// complex over time by providing additional context to the ad.
		newTargeting.contentId = currentArticleId;

		const { type: slot } = this.props;
		const { type, loaded } = this.state;
		const adClassName = cx( 'container', `${slot}-slot`, type, className, { amp: isAmp, [context]: context, loaded } );
		const adUnitPath = `/56091333/${edition}/${path}`;
		const newProps = {
			...this.props,
			id,
			targeting: newTargeting,
			adUnitPath,
			onSlotRenderEnded: this.onSlotRenderEnded,
		};

		if ( isAmp ) {

			// add amp as a targeting param
			newTargeting.amp = 1;

			// we use OOP slots to render things like bulletins, they won't work in AMP
			if ( newProps.outOfPage ) {
				return null;
			}

			// default attributes for amp-ad
			const atts = {
				type: 'doubleclick',
				'data-slot': adUnitPath,
				json: JSON.stringify( { targeting: newTargeting } ),
				// how many viewports before it loads the ad
				'data-loading-strategy': 1.5,
				// connects the ad to the amp-consent component
				'data-block-on-consent': undefined,
				// if we dont dont know consent status, still show personalized ads
				'data-npa-on-unknown-consent': false,
			};

			// pull the sizes from the sizeMapping
			if ( newProps.sizeMapping ) {

				// get the first size defined in the size map, which is mobile
				const sizes = newProps.sizeMapping[0].slot;

				// ad has multiple sizes
				if ( Array.isArray( sizes[0] ) ) {

					// order sizes by height, largest to smallest
					sizes.sort( ( a, b ) => b[1] - a[1] );

					// still needs a width and height
					[ [ atts.width, atts.height ] ] = sizes;

					// add the sizes
					atts['data-multi-size'] = sizes.map( dimensions => {
						const [ width, height ] = dimensions;
						return `${width}x${height}`;
					} ).join( ',' );

					// dont enforce validation related to AMPs rules for multiple sizes
					atts['data-multi-size-validation'] = false;

				// size mapping w/ a single size
				} else {
					[ atts.width, atts.height ] = sizes;
				}

			// uses slotSize
			} else {
				[ [ atts.width, atts.height ] ] = newProps.slotSize;
			}

			// determine layout based on size use
			atts.layout = atts['data-multi-size'] ? 'fixed' : 'responsive';

			return (
				<div className={adClassName}>
					<amp-ad {...atts}></amp-ad>
				</div>
			);
		}

		// if we should wait for marquee, dont call ads until redux state has been updated indicating marquee is active
		if ( waitForMarquee && !marqueeActive ) {
			return null;
		}

		return (
			<div className={adClassName}>
				<Gpt {...newProps}/>
			</div>
		);
	}
}

AdUnit.propTypes = {
	className: PropTypes.string,
	collapseEmptyDiv: PropTypes.bool.isRequired,
	context: PropTypes.string,
	currentArticleId: PropTypes.number,
	edition: PropTypes.string.isRequired,
	id: PropTypes.string,
	isAmp: PropTypes.bool.isRequired,
	isMember: PropTypes.bool.isRequired,
	loaded: PropTypes.bool.isRequired,
	marqueeActive: PropTypes.bool.isRequired,
	onError: PropTypes.func.isRequired,
	onSetMarqueeAdUnit: PropTypes.func.isRequired,
	onSlotRenderEnded: PropTypes.func,
	path: PropTypes.string.isRequired,
	renderWhenViewable: PropTypes.bool.isRequired,
	targeting: PropTypes.object.isRequired,
	type: PropTypes.string.isRequired,
	viewableThreshold: PropTypes.number.isRequired,
	visitorId: PropTypes.string,
	waitForMarquee: PropTypes.bool.isRequired,
};

AdUnit.defaultProps = {
	collapseEmptyDiv: true,
	onError: () => {},
	renderWhenViewable: true,
	targeting: {},
	viewableThreshold: 0.01,
	loaded: false,
	waitForMarquee: false,
	type: 'unknown',
};

const mapStateToProps = state => ( {
	currentArticleId: state.session.currentArticle ? decodeRelayId( state.session.currentArticle ).id : null,
	marqueeActive: state.marquee.active,
	visitorId: state.preferences.visitorId,
} );

const mapDispatchToProps = dispatch => ( {
	onSetMarqueeAdUnit: adUnit => {
		dispatch( setMarqueeAdUnit( adUnit ) );
	},
} );

function AdUnitWithContext ( props ) {
	const { edition, isAmp } = usePageVariant();
	const { isMember } = useUserRole();

	return (
		<AdUnit
			{...props}
			edition={edition}
			isAmp={isAmp}
			isMember={isMember}
		/>
	);
}

export default compose(
	withTracking( { onError } ),
	connect( mapStateToProps, mapDispatchToProps )
)( AdUnitWithContext );
