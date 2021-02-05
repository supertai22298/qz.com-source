import React from 'react';

const mapProps = func => WrappedComponent => props => {
    const newProps = func(props);
    return <WrappedComponent { ...newProps
    }
    />;
};

export default mapProps;