export const initialState = {
    currentModal: null,
    modalContentProps: {},
};

export default (state = initialState, action) => {
    const {
        payload,
        type
    } = action;
    switch (type) {
        case 'SHOW_MODAL':
            return {
                ...state,
                currentModal: payload.currentModal,
                modalContentProps: {
                    ...state.modalContentProps,
                    ...payload.modalContentProps,
                },
            };

        case 'HIDE_MODAL':
            return initialState;
    }

    return state;
};