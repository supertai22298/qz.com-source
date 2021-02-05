/**
 * Is the path an AMP path?
 */
export const isAmpPath = ( path: string ) => /\/amp\/?$/.test( path );

/**
 * Helper function to determine if an article can be displayed in AMP
 */
export const isAmpSafe = ( article ) => {

	const { disableAmp, bulletin, subtype, blocks } = article;

	// make sure amp isnt disabled
	// dont allow bulletins
	// cant be a video or interactive
	// check for interactive block type
	if (
		disableAmp ||
		bulletin ||
		[ 'video', 'interactive' ].includes( subtype ) ||
		blocks.find( ( block ) => 'SHORTCODE_QZ_INTERACTIVE' === block.type )
	) {
		return false;
	}

	return true;
};

/**
 * Converts a boolean attribute so it's safe to use in a amp-* component
 *
 * In HTML5, <video controls="true"> is considered valid, but in AMP it is not.
 * AMP wants you to write your boolean attributes as <video controls>, but this is not possible in React
 * AMP does seem to allow <video controls=""> which is what this function does
 */
export const getAmpBool = ( attr: boolean ) => attr ? '' : null;
