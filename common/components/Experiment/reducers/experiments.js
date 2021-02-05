export const initialState = {
    segmentCount: 0,
    segmentValue: 0,
    started: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'START_EXPERIMENT':
            // If it's already been added, don't add it again (e.g., on rerender).
            // NOTE: Sets cannot be serialized, so they don't work in state.
            const experimentExists = exp => exp.name === action.experiment.name && exp.variant === action.experiment.variant;
            if (state.started.some(experimentExists)) {
                return state;
            }

            return {
                ...state,
                started: [
                    ...state.started,
                    action.experiment,
                ],
            };
    }

    return state;
};