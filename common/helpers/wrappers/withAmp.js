import React from 'react';
import PropTypes from 'prop-types';
import {
    connect
} from 'react-redux';

const mapStateToProps = (state) => ({
    amp: state.amp,
});

const withAmp = (AmpComponent = null) => WrappedComponent => {
    const ComponentWithAmp = ({
        amp,
        ...props
    }) => {

        if (amp && AmpComponent) {
            return <AmpComponent { ...props
            }
            />;
        }

        return <WrappedComponent amp = {
            amp
        } { ...props
        }
        />;
    };

    ComponentWithAmp.propTypes = {
        amp: PropTypes.bool.isRequired,
    };

    return connect(mapStateToProps)(ComponentWithAmp);
};

export default withAmp;