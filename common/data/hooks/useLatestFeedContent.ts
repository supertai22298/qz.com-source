import getUpdateQuery from 'data/apollo/getUpdateQuery';
import { useLatestFeedContentQuery } from '@quartz/content';
import { getArticleOrEmailProps } from 'helpers/data/email';

export default function useLatestFeedContent( props?: { postsPerPage?: number } ) {
	const { data, fetchMore, loading } = useLatestFeedContentQuery( {
		variables: { perPage: props?.postsPerPage || 10 },
		notifyOnNetworkStatusChange: true,
	} );

	const posts = data?.feedContent?.nodes?.map( getArticleOrEmailProps );

	const fetch = () => fetchMore( {
		variables: {
			perPage: props?.postsPerPage || 10,
			after: data?.feedContent?.pageInfo?.endCursor,
		},
		updateQuery: getUpdateQuery( 'feedContent.nodes' ),
	} );

	return {
		posts,
		loading,
		endCursor: data?.feedContent?.pageInfo?.endCursor,
		fetchMore: fetch,
	};
}
