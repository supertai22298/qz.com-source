import { FieldPolicy, Reference } from '@apollo/client';

function makeEmptyData(): TExistingRelay<any> {
	return {
		nodes: [],
		pageInfo: {},
	};
}

type KeyArgs = FieldPolicy<any>['keyArgs'];

type TPageInfo = {
	hasPreviousPage?: boolean;
	hasNextPage?: boolean;
	startCursor?: string;
	endCursor?: string;
};

type TExistingRelay<TNode> = Readonly<{
	nodes: TNode[];
	pageInfo: TPageInfo;
}>;

type TIncomingRelay<TNode> = {
	nodes?: TNode[];
	pageInfo?: TPageInfo;
};

type RelayFieldPolicy<TNode> = FieldPolicy<
	TExistingRelay<TNode>,
	TIncomingRelay<TNode>,
	TIncomingRelay<TNode>
>;

/**
 * Adapted from @apollo/client’s official implementation of `relayStylePagination`
 * https://github.com/apollographql/apollo-client/blob/8e92be3e8b791187d8557fccd30ffc82feac5cd4/src/utilities/policies/pagination.ts#L90
 * This implementation expects a query with top level `nodes` and `pageInfo` fields
 * as opposed to `edges`, which the official implementation expects.
 */
export function relayStylePagination<TNode = Reference>(
	keyArgs: KeyArgs = false
): RelayFieldPolicy<TNode> {
	return {
		keyArgs,

		merge( existing = makeEmptyData(), incoming, { args } ) {
			const incomingEdges = incoming.nodes ?? [];

			let prefix = existing.nodes;
			const suffix: typeof prefix = [];

			if ( ! args?.after && ! args?.before && incoming.nodes ) {
				// If we have neither args.after nor args.before, the incoming
				// edges cannot be spliced into the existing edges, so they must
				// replace the existing edges. See #6592 for a motivating example.
				prefix = [];
			}

			const nodes = [
				...prefix,
				...incomingEdges,
				...suffix,
			];

			return {
				nodes,
				pageInfo: incoming.pageInfo ?? {},
			};
		},
	};
}
