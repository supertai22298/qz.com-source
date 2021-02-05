import { usePromotionsByTagQuery } from '@quartz/content';

export default function usePromotionsByTag ( slug: string, perPage = 10, ssr = true ) {
	const { data } = usePromotionsByTagQuery( {
		ssr,
		variables: {
			perPage,
			slug: [ slug ],
		},
	} );

	return data?.promotions?.nodes || [];
}
