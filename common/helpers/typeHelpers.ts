export function notUndefinedOrNull<T>( x: T | undefined | null ): x is T {
	if ( x !== undefined && x !== null ) {
		return true;
	}
	return false;
}
