import {
    GTM,
    TRACKING
} from 'helpers/types/tracking';

export function updateArticleScrollDepth(articleScrollDepth) {
    return {
        [TRACKING]: {
            [GTM]: {
                articleScrollDepth,
                event: 'ReadArticle',
            },
        },
        type: 'UPDATE_ARTICLE_SCROLL_DEPTH',
    };
}