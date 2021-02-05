import {
    connect
} from 'react-redux';
import {
    hideModal,
    showModal
} from 'helpers/wrappers/actions/modal';

const mapStateToProps = state => ({
    currentModal: state.modal.currentModal,
    modalContentProps: state.modal.modalContentProps,
});

const mapDispatchToProps = dispatch => ({
    hideModal: () => dispatch(hideModal()),
    showModal: (currentModal, modalContentProps) => dispatch(showModal(currentModal, modalContentProps)),
});

export default connect(mapStateToProps, mapDispatchToProps);