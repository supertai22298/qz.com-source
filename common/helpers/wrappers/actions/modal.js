export const showModal = (currentModal, modalContentProps = {}) => ({
    type: 'SHOW_MODAL',
    payload: {
        currentModal,
        modalContentProps,
    },
});

export const hideModal = () => ({
    type: 'HIDE_MODAL',
});