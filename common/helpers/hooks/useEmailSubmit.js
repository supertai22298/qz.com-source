import {
    useReducer,
    useEffect
} from 'react';
import handleSignup from 'components/EmailSignup/handleSignup';
import {
    isValidEmail
} from 'helpers/validation';

import {
    getUtmQueryParams
} from 'helpers/queryParams';

const {
    utm_campaign,
    utm_source
} = getUtmQueryParams();

const SET_FIELD_VAL = 'SET_FIELD_VAL';
const TOGGLE_CHECKBOX = 'TOGGLE_CHECKBOX';
const SET_ERROR = 'SET_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_SUCCESS = 'SET_SUCCESS';
const RESET = 'RESET';

// use for lazy initialization / reset of the email state
const init = ({
    email,
    listIds
}) => ({
    emailAddress: email || '',
    error: '',
    inputStatus: '',
    initialIds: listIds,
    selectedIds: listIds,
    loading: false,
    showErrors: false,
});

// reducer function for state mutations
const reducer = (state, action) => {
    switch (action.type) {
        case SET_FIELD_VAL:
            return {
                ...state,
                [action.payload.field]: action.payload.val,
            };
        case TOGGLE_CHECKBOX:
            const {
                selectedIds
            } = state;
            const isIncluded = selectedIds.includes(action.payload.id);
            const newIds = isIncluded ?
                selectedIds.filter(id => id !== action.payload.id) :
                [...selectedIds, action.payload.id];
            // if they check a new box, reset errors
            return {
                ...state,
                inputStatus: '',
                error: '',
                showErrors: false,
                selectedIds: newIds,
            };
        case SET_ERROR:
            return { ...state,
                inputStatus: 'error',
                loading: false,
                error: action.payload.val,
                showErrors: true
            };
        case CLEAR_ERROR:
            return { ...state,
                inputStatus: '',
                loading: false,
                error: '',
                showErrors: false
            };
        case SET_SUCCESS:
            return { ...state,
                inputStatus: 'confirmed',
                loading: false,
                selectedIds: []
            };
        case RESET:
            return init({
                email: action.payload.email,
                listIds: action.payload.listIds
            });
        default:
            return state;
    }
};

export default ({
    email,
    handleChange,
    isLoggedIn,
    listIds,
    onError: onErrorFromProps = () => {},
    onSignupConfirmed = () => {},
    referredByEmail,
    registerUser,
}) => {
    // setup state & action creators
    const [{
        emailAddress,
        selectedIds,
        initialIds,
        inputStatus,
        loading,
        error,
        showErrors,
    }, dispatch] = useReducer(reducer, {
        email,
        listIds
    }, init);

    const handleFieldChange = (field, val) => dispatch({
        payload: {
            field,
            val
        },
        type: SET_FIELD_VAL
    });
    const toggleCheckbox = (id) => dispatch({
        payload: {
            id
        },
        type: TOGGLE_CHECKBOX
    });
    const clearError = () => dispatch({
        type: CLEAR_ERROR
    });

    const setEmail = (newEmail) => {
        handleFieldChange('emailAddress', newEmail);
        handleChange({
            email: newEmail
        });
        clearError();
    };

    const onError = ({
        message
    }) => {
        dispatch({
            payload: {
                val: message
            },
            type: SET_ERROR
        });
        onErrorFromProps(message);
    };

    const onSuccess = (respJson) => {
        dispatch({
            type: SET_SUCCESS
        });
        // we need to pass the user's email back into any onSignupConfirmed callback
        // since the response only returns hashed PII...
        onSignupConfirmed({
            listIds,
            email: emailAddress,
            ...respJson
        });
    };

    // handle signup
    const handleEmailSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }

        if (selectedIds.length === 0) {
            return onError({
                message: 'Please select at least one email'
            });
        }

        // If the email address is invalid, don't attempt to send anything.
        if (!isValidEmail(emailAddress)) {
            return onError({
                message: 'Please enter a valid email'
            });
        }

        const customFieldData = {
            referred_by_email: referredByEmail,
            utm_campaign,
            utm_source
        };

        // Format identifying info about the request (utm params, referring email) to
        // save in Sendgrid on the contact's custom fields.
        // Only pass these if they're present.
        const customFields = Object.keys(customFieldData).reduce((acc, key) => {
            if (customFieldData[key]) {
                return { ...acc,
                    [key]: customFieldData[key]
                };
            }
            return acc;
        }, {});

        handleFieldChange('loading', true);

        const data = {
            emailAddress,
            listIds: selectedIds,
            customFields,
        };

        handleSignup({
            data,
            isLoggedIn,
            onError,
            onSuccess,
            registerUser,
        });
    };

    useEffect(() => {
        const reset = (newListIds) => dispatch({
            payload: {
                email: emailAddress,
                listIds: newListIds
            },
            type: RESET
        });

        // if we're adding new ids to the list of initial ids (see email form), reset
        if (listIds.length !== initialIds.length) {
            reset(listIds);
        }
    }, [emailAddress, initialIds.length, listIds]);

    // return state props & submission function
    return {
        emailAddress,
        handleEmailSubmit,
        setEmail,
        toggleCheckbox,
        selectedIds,
        inputStatus,
        loading,
        error,
        showErrors,
    };
};