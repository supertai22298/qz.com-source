import { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'helpers/compose';
import { withAmp, withProps } from 'helpers/wrappers';
import { startExperiment } from './actions/experiments';

const mapDispatchToProps = {
	startExperiment,
};

// The segmentValue prop is a number from 0 (inclusive) to 1 (exclusive). This
// keeps it agnostic to the number of segments, which could change over time.
const mapStateToProps = state => ( {
	segmentCount: state.experiments.segmentCount,
	segmentValue: state.experiments.segmentValue,
} );

const defaultResolver = ( variants, segmentValue ) => {
	// Find the component that matches the segmentValue given its order and
	// relative weight.
	const chooseVariant = ( floor = 0, index = 0 ) => {
		const component = variants[index];

		// If we've reached the end of the array (or we've been given bad
		// input), return the first array member.
		if ( !component ) {
			return variants[0] || null;
		}

		// We've found our component if the segment value is within the range
		// defined by its child order and its weight.
		const split = component.split / 100;
		if ( segmentValue >= floor && segmentValue < floor + split ) {
			return component;
		}

		return chooseVariant( floor + split, index + 1 );
	};

	return chooseVariant();
};

export const formatChildren = ( children ) => {
	const childrenArr =  Children.toArray( children );
	return childrenArr.map( child => child.props );
};

export const validateVariants = ( variants, segmentCount ) => {

	const variantSize = 100 / segmentCount;
	const totalWeight = variants.reduce( ( acc, variant ) => {
		const { split } = variant;

		if ( split % variantSize ) {
			throw new Error( `Variant weight of ${split} is not compatible with ${segmentCount} segments.` );
		}

		return acc + split;
	}, 0 );

	if ( totalWeight !== 100 ) {
		throw new Error( `Total weight of variants is ${totalWeight}; expected 100.` );
	}

	return true;
};

export const Variant = ( { children } ) => children || null;

Variant.propTypes = {
	children: PropTypes.node,
	name: PropTypes.string.isRequired,
	split: PropTypes.number.isRequired,
	variant: PropTypes.number.isRequired,
};

export class Experiment extends Component {
	constructor( props ) {
		super( props );

		const { amp, variants, segmentCount, ssr } = props;

		validateVariants( variants, segmentCount );

		// Initially set segment value to 0, corresponding to the first variant,
		// unless / until we're ready to start the experiment.
		this.state = {
			started: ssr && ! amp,
		};

		if ( this.state.started ) {
			this.startExperiment();
		}
	}

	getVariant() {
		const { resolver, segmentValue, variants } = this.props;

		// If the experiment hasn't started yet, return the first segment.
		if ( ! this.state.started ) {
			return resolver( variants, 0 );
		}

		return resolver( variants, segmentValue );
	}

	componentDidMount() {
		if ( this.state.started || this.props.amp ) {
			return;
		}

		// Start the experiment.
		this.setState( { started: true }, this.startExperiment );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.experimentId !== this.props.experimentId ) {
			throw new Error( 'Experiment ID must not change. Use a key prop if you have experiments that may collide with one another in the tree.' );
		}
	}

	startExperiment() {
		// Describe the experiment.
		const { name, startExperiment, experimentId } = this.props;
		const { variant, split } = this.getVariant();
		const experiment = {
			name,
			split,
			variant,
			experimentId,
		};

		startExperiment( experiment );
	}

	render() {
		return this.getVariant().children || null;
	}
}

Experiment.propTypes = {
	amp: PropTypes.bool.isRequired,
	experimentId: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	resolver: PropTypes.func.isRequired,
	segmentCount: PropTypes.number.isRequired,
	segmentValue: PropTypes.number.isRequired,
	ssr: PropTypes.bool.isRequired,
	startExperiment: PropTypes.func.isRequired, // for making sure Experiment updates its variants if its parent doesn't unmount (i.e. navigating from article to article),
	variants: PropTypes.arrayOf( PropTypes.shape( {
		children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.string ] ),
		name: PropTypes.string.isRequired,
		split: PropTypes.number.isRequired,
		variant: PropTypes.number.isRequired,
	} ) ),
};

Experiment.defaultProps = {
	resolver: defaultResolver,
	ssr: true,
	variants: [],
};

export default compose(
	connect( mapStateToProps, mapDispatchToProps ),
	withProps( ( { children, variants: propVariants } ) => {
		const variants = propVariants ? propVariants : formatChildren( children );
		return { variants };
	} ),
	withAmp()
)( Experiment );
