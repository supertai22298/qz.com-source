import { useMenuItemsQuery, MenuLocationEnum } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

export default function useMenuItems( slug: MenuLocationEnum, perPage = 25 ) {
	return useMenuItemsQuery( { variables: { slug, perPage } } )
		.data?.menuItems?.nodes
		?.map( node => node?.connectedObject )
		.map( node => {
			if ( node?.__typename === 'Post' || node?.__typename === 'Promotion' ) {
				return node;
			}
			return null;
		} )
		.filter( notUndefinedOrNull );
}
