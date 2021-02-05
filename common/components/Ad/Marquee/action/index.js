export const fetchMarquee = ({
    path,
    targeting
}) => ({
    type: 'FETCH_MARQUEE',
    payload: {
        path,
        targeting,
    },
});

export const clearMarquee = () => ({
    type: 'CLEAR_MARQUEE',
});

export const renderMarquee = () => ({
    type: 'RENDER_MARQUEE',
});

export const activateMarquee = () => ({
    type: 'ACTIVATE_MARQUEE',
});

export const setMarqueeAdUnit = adUnit => ({
    type: 'SET_MARQUEE_AD_UNIT',
    payload: {
        adUnit,
    },
});