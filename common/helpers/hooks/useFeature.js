import {
    useSelector
} from 'react-redux';

/**
 * Whether a feature (defined as a string) is enabled.
 * @param {String} feature
 * @return {Boolean}
 */
export default function useFeature(feature) {
    const selector = state => true === state.features[feature];

    return useSelector(selector);
}