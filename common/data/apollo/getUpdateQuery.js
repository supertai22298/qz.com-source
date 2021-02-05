import {
    get,
    set
} from 'helpers/utils';

/**
 * Given a accessor path to the paginated array in a query result object, return
 * a function that can correctly update the Apollo cache when another page of
 * results is fetched.
 *
 * See:
 * https://www.apollographql.com/docs/react/data/queries/
 *
 * @param  {String}  Accessor path to nested object property (e.g., 'tag.nodes[0].posts.nodes')
 */
export default function getUpdateQuery(accessPaginatedArray) {
    return function(previousResult, {
        fetchMoreResult
    }) {
        if (!fetchMoreResult) {
            return previousResult;
        }

        const oldNodes = get(previousResult, accessPaginatedArray);
        const nodes = get(fetchMoreResult, accessPaginatedArray);

        // Merge the new results into the old and return a new object. It is critical
        // that the shape of this data matches the shape returned by the query (before
        // any transformations you apply) and that you provide the correct __typename
        // at each level of the tree.
        //
        // The best way to do this is is to create a shallow copy of the new result,
        // then assign the merged results. A shallow copy is sufficient to trigger a
        // rerender.
        const newData = { ...fetchMoreResult
        };

        set(newData, accessPaginatedArray, [...oldNodes, ...nodes]);
        return newData;
    };
}