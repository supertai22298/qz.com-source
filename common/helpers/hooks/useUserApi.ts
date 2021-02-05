import { useCallback, useState } from 'react';
import { getErrorMessage } from 'helpers/errors';
import { useDispatch } from 'react-redux';
import { apiFetchOptions } from 'config/http';
import { updateUserData } from 'helpers/wrappers/actions/auth';

interface ApiArgs{
	endpoint: string,
	method: string,
	body?: any,
}

function useUserApi(): { callApi: ( args: ApiArgs ) => Promise<any>, loading: boolean } {
	const dispatch = useDispatch();

	const [ loading, setLoading ] = useState( false );

	const callApi = useCallback( ( args: ApiArgs ) => {
		const fetchOptions = {
			...apiFetchOptions,
			body: args.body && JSON.stringify( args.body ),
			method: ( args.method || 'get' ).toUpperCase(),
		};

		setLoading( true );

		return fetch( `/api/user/${args.endpoint}`, fetchOptions as RequestInit )
			.then( response => response.json() )
			.then( ( { error, ...data } ) => {
				setLoading( false );

				if ( error ) {
					// Don't throw the result of getErrorMessage. It could be a ReactNode,
					// which doesn't work as an Error#message (it gets coerced to
					// [Object object]).
					return Promise.reject( getErrorMessage( error ) );
				}

				if ( !data.user ) {
					return data;
				}

				// We store user and membership data separately.
				const { user: { membership, ...user } } = data;

				dispatch( updateUserData( { ...data, membership, user } ) );

				return data;
			} );
	}, [ dispatch ] );

	return {
		loading,
		callApi,
	};
}

export default useUserApi;
