import { getQueryParams } from 'helpers/urls';
import { useEffect, useState } from 'react';

const queryParams = getQueryParams();

export default function useQueryParam( name: string ) {
	const [ value, setValue ] = useState( null );

	useEffect( () => {
		const newValue = queryParams[ name ] ?? null;

		if ( value !== newValue ) {
			setValue( newValue );
		}
	}, [ name, value ] );

	return value;
}
