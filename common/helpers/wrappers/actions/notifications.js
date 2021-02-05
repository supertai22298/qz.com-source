export const addNotification = (status, data) => ({
    type: 'ADD_NOTIFICATION',
    payload: {
        status,
        ...data,
    },
});

export const dismissNotification = id => ({
    type: 'DISMISS_NOTIFICATION',
    payload: id,
});