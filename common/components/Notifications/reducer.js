const maxNotifications = 6;
const getUniqueId = (start => {
    let id = start;
    return () => id++;
})(0);

export default (state = [], action) => {
    const {
        payload,
        type
    } = action;

    switch (type) {
        case 'ADD_NOTIFICATION':
            const {
                message,
                status,
                timeVisible
            } = payload;

            return [
                ...state.slice(1 - maxNotifications),
                {
                    dismissed: false,
                    id: getUniqueId(),
                    message,
                    status,
                    timeVisible,
                },
            ];

        case 'DISMISS_NOTIFICATION':
            const newState = [
                ...state,
            ];
            newState.find(({
                id
            }) => id === payload).dismissed = true;
            return newState;
    }

    return state;
};