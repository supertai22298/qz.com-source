import { useLatestArticlesQuery, EditionName, ArticleTeaserPartsFragment } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

/** EditionName if not Quartz since we want to show content from all editions by default. */
function editionNameIfNotQuartz( edition?: string ): EditionName | undefined {
	const quartzEdition = edition?.toUpperCase();
	if ( quartzEdition === 'AFRICA' || quartzEdition === 'INDIA' || quartzEdition === 'WORK' ) {
		return quartzEdition;
	}
	return;
}

export default function useLatestArticles ( props?: { edition?: string, postsPerPage?: number } ) {
	const editionName = editionNameIfNotQuartz( props?.edition );

	const { data, fetchMore, loading } = useLatestArticlesQuery( {
		variables: { edition: editionName, postsPerPage: props?.postsPerPage },
		notifyOnNetworkStatusChange: true,
	}  );

	const posts: ArticleTeaserPartsFragment[] | undefined = data?.posts?.nodes?.filter( notUndefinedOrNull );

	return {
		posts,
		loading,
		endCursor: data?.posts?.pageInfo?.endCursor,
		fetchMore,
	};
}
