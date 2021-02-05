import {
    GTM,
    TRACKING
} from 'helpers/types/tracking';

export const startExperiment = (experiment) => ({
    [TRACKING]: {
        [GTM]: {
            event: 'Experiment',
            eventAction: 'Start experiment',
            eventCategory: 'experiment',
            eventLabel: null,
            experimentId: experiment.experimentId,
            experimentVariant: experiment.variant,
        },
    },
    type: 'START_EXPERIMENT',
    experiment,
});