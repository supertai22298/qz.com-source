import usePageVariant from 'helpers/hooks/usePageVariant';
import { useObsessionsQuery, MenuLocationEnum } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

export default function useObsessions() {
	const { edition } = usePageVariant();
	const { data } = useObsessionsQuery( { variables: {
		perPage: 25,
		location: `OBSESSIONS_${edition.toUpperCase()}` as MenuLocationEnum,
	} } );
	return data?.menuItems?.nodes
		?.map( node => node?.connectedObject )
		.map( node => {
			if ( node?.__typename === 'Obsession' ) {
				return node; // selecting the connected type we want to help TypeScript narrow down the type
			}
			return null;
		} )
		.filter( notUndefinedOrNull );
}
