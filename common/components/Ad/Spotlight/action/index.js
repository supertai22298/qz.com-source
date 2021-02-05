export const renderSpotlight = (id, el) => ({
    type: 'RENDER_SPOTLIGHT',
    payload: {
        id,
        el,
    },
});

export const clearSpotlight = (id) => ({
    type: 'CLEAR_SPOTLIGHT',
    payload: {
        id,
    },
});

export const updateSpotlight = ({
    color
}) => ({
    type: 'UPDATE_SPOTLIGHT',
    payload: {
        color,
    },
});