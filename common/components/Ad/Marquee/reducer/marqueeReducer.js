export const initialState = {
    path: '',
    targeting: undefined,
    visible: false,
    active: false,
    adUnit: 'default-marquee',
};

export default (state = initialState, action) => {

    switch (action.type) {

        case 'FETCH_MARQUEE':
            return {
                ...state,
                path: action.payload.path,
                targeting: action.payload.targeting,
            };

        case 'ACTIVATE_MARQUEE':
            return {
                ...state,
                active: true,
            };

        case 'RENDER_MARQUEE':
            return {
                ...state,
                visible: true,
            };

        case 'SET_MARQUEE_AD_UNIT':
            return {
                ...state,
                adUnit: action.payload.adUnit,
            };

        case 'CLEAR_MARQUEE':
            return {
                ...initialState,
            };

        default:
            return state;

    }

};