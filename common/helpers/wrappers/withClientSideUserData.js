import {
    connect
} from 'react-redux';
import {
    getUserAttribute,
    userHasSocialConnection,
    getRoleProperties,
} from 'helpers/user';

export const mapStateToData = state => {
    const {
        promotionalContentIds,
        user,
        userRole
    } = state.auth;

    const roleProps = getRoleProperties(userRole);

    return {
        getUserAttribute: getUserAttribute.bind(null, user),
        promotionalContentIds,
        userHasSocialConnection: userHasSocialConnection.bind(null, user),
        ...roleProps,
    };
};

export default () => WrappedComponent => connect(mapStateToData)(WrappedComponent);