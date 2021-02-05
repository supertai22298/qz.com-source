import React from 'react';

/**
 * Similar to mapProps, except the new props are merged with the owner props.
 * We came up with this ourselves, but turns out we are just ripping off recompose.
 * https://github.com/acdlite/recompose/blob/master/docs/API.md#withprops
 *
 * @param {function|object} mapOrProps Props or a function that returns props.
 */
export default (mapOrProps = {}) => WrappedComponent => props => {
    const newProps = 'function' === typeof mapOrProps ? mapOrProps(props) : mapOrProps;
    return <WrappedComponent { ...props
    } { ...newProps
    }
    />;
};