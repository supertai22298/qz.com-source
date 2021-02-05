// Please use this HOC or getQueryParamData instead
// of checking the query params from a component.
import {
    withProps
} from 'helpers/wrappers';
import {
    getQueryParamData
} from 'helpers/queryParams';

export default () => withProps(getQueryParamData);