import {
    useSelector
} from 'react-redux';
import {
    getRoleProperties
} from 'helpers/user';

export default function useUserRole() {
    return useSelector(state => getRoleProperties(state.auth.userRole));
}