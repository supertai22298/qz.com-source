import {
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    readLocalStorage,
    writeLocalStorage
} from 'helpers/localStorage';

const useLocalStorageState = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(initialValue);

    // window.localStorage is not available in ssr
    useEffect(() => {
        const localStorageValue = readLocalStorage(key);

        if (localStorageValue !== null) {
            setStoredValue(localStorageValue);
        }
    }, [key]);

    return [
        storedValue,
        useCallback((data, expires = 0) => {
            writeLocalStorage(key, data, expires);
            setStoredValue(data);
        }, [key]),
    ];
};

export default useLocalStorageState;