import { useGuidesQuery } from '@quartz/content';
import { getArticleProps } from 'helpers/data/article';
import { notUndefinedOrNull } from 'helpers/typeHelpers';
import { ResourceNotFoundError } from 'helpers/errors';

export default function useGuides ( perPage = 10, postsPerGuide = 1 ) {
	const { data, fetchMore, loading } = useGuidesQuery( {
		notifyOnNetworkStatusChange: true,
		variables: {
			// Over query so we can remove guides with no published posts.
			perPage: perPage + 2,
			postsPerGuide,
		},
	} );

	if ( ! data?.guides && ! loading ) {
		throw new ResourceNotFoundError();
	}

	return {
		guides: data?.guides?.nodes
			?.filter( guide => guide?.posts?.nodes?.length )
			?.filter( notUndefinedOrNull )
			.map( guide => ( {
				...guide,
				posts: guide?.posts?.nodes?.map( getArticleProps ),
			} ) ),
		loading,
		startCursor: data?.guides?.pageInfo?.startCursor,
		fetchMore,
	};
}
