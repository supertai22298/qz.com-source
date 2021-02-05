import {
    connect
} from 'react-redux';
import {
    addNotification
} from 'helpers/wrappers/actions/notifications';

const mapDispatchToProps = dispatch => ({
    notifyError: (message, timeVisible) => dispatch(addNotification('error', {
        message,
        timeVisible
    })),
    notifySuccess: (message, timeVisible) => dispatch(addNotification('success', {
        message,
        timeVisible
    })),
    notifyWarning: (message, timeVisible) => dispatch(addNotification('warning', {
        message,
        timeVisible
    })),
});

export default connect(null, mapDispatchToProps);