import {
    TRACKING,
    VENT
} from 'helpers/types/tracking';

export const trackSession = () => ({
    [TRACKING]: {
        [VENT]: {
            event: 'SESSION',
        },
    },
    type: 'TRACK_SESSION',
});