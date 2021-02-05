import {
    TRACK_PAGE_VIEW
} from 'helpers/tracking/actions';

export const initialState = {
    currentArticle: null, // the current article relay ID (or null)
    visitedArticles: [], // list of previously visited article relay IDs
};

export default (state = initialState, action) => {

    switch (action.type) {

        case TRACK_PAGE_VIEW:
            const {
                relayId
            } = action.payload;
            const visitedArticles = relayId ? [relayId, ...state.visitedArticles] : state.visitedArticles;
            const currentArticle = relayId || null;

            return {
                ...state,
                currentArticle,
                visitedArticles,
            };

        default:
            return state;

    }
};