import {
    useEffect,
    useState
} from 'react';
import {
    useSelector
} from 'react-redux';
import {
    getUserSetting,
    userHasPermission
} from 'helpers/user';
import useUserApi from './useUserApi';
import useClientSideUserData from './useClientSideUserData';

function useUserSettings() {
    const {
        isLoggedIn
    } = useClientSideUserData();

    const user = useSelector(({
        auth: {
            membership,
            user
        }
    }) => ({
        ...user,
        membership,
    }));

    const {
        callApi
    } = useUserApi();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn) {
            callApi({
                    endpoint: 'settings'
                })
                .then(() => setLoading(false));
        }

    }, [callApi, isLoggedIn]);

    return {
        getUserSetting: setting => getUserSetting(user, setting),
        userHasPermission: permission => userHasPermission(user, permission),
        loading,
    };
}

export default useUserSettings;