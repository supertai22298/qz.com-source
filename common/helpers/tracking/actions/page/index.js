import {
    GTM,
    TRACKING,
    VENT
} from 'helpers/types/tracking';
import {
    slugify
} from 'helpers/text';

export const TRACK_PAGE_VIEW = 'TRACK_PAGE_VIEW';

export const trackPageView = ({
    data,
    pageName,
    pageType,
    ventName,
    ventType,
    ...payload
}) => ({
    [TRACKING]: {
        [GTM]: {
            event: 'PageLoaded',
            data,
            pageName,
            pageType,
        },
        [VENT]: {
            event: 'VIEW',
            data: {
                type: 'page',
                subtype: ventType || slugify(pageType),
                name: ventName || slugify(pageName),
                post: data ? .article ? .postId || null,
            },
        },
    },
    payload: {
        data,
        ...payload,
    },
    type: TRACK_PAGE_VIEW,
});