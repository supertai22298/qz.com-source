import {
    connect
} from 'react-redux';
import {
    getRoleProperties
} from 'helpers/user';

/**
 * This is where user roles map to permission props that can be consumed by
 * components. Use this HOC when you need to vary behavior SERVER-SIDE based on
 * what kind of user is visiting.
 *
 * If you only need to know this information client-side, use
 * withClientSideUserData instead.
 */

export const mapStateToProps = state => getRoleProperties(state.auth.userRole);

export default () => WrappedComponent => connect(mapStateToProps)(WrappedComponent);