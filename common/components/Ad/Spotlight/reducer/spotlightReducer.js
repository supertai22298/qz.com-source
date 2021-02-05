const initialState = {
    ads: {},
    color: '#000000',
};

export default (state = initialState, action) => {

    switch (action.type) {

        case 'RENDER_SPOTLIGHT':

            return {
                ads: Object.assign({}, state.ads, {
                    [action.payload.id]: action.payload.el
                }),
                color: state.color,
            };

        case 'CLEAR_SPOTLIGHT':
            const {
                [action.payload.id]: ignored,
                ...remainingAds
            } = state.ads;

            return {
                ads: remainingAds,
                color: state.color,
            };

        case 'UPDATE_SPOTLIGHT':

            return {
                ads: state.ads,
                color: action.payload.color,
            };

        default:
            return state;

    }

};