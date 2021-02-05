import {
    createElement
} from 'react';

/**
 * An HOC that sets default props on a component.
 * Yet another recompose knockoff.
 * Their explanation: https://github.com/acdlite/recompose/blob/master/docs/API.md#defaultprops
 * Their code: https://github.com/acdlite/recompose/blob/master/src/packages/recompose/defaultProps.js
 * but createFactory is deprecated in favor of createElement.
 */
const defaultProps = props => BaseComponent => {

    const DefaultProps = ownerProps => createElement(BaseComponent, ownerProps);
    DefaultProps.defaultProps = props;

    return DefaultProps;
};

export default defaultProps;