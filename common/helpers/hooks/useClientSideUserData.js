import {
    mapStateToData
} from 'helpers/wrappers/withClientSideUserData';
import {
    useSelector
} from 'react-redux';

function useClientSideUserData() {
    return useSelector(mapStateToData);
}

export default useClientSideUserData;