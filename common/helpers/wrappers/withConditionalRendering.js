import React from 'react';

const withConditionalRendering = testFunction => WrappedComponent => props => {
    if (testFunction(props)) {
        return <WrappedComponent { ...props
        }
        />;
    }

    return null;
};

export default withConditionalRendering;