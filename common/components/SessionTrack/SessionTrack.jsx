import compose from 'helpers/compose';
import { withVisibilityTracking } from 'helpers/wrappers';
import { trackSession as onMount } from 'helpers/tracking/actions';

const SessionTrack = () => null;

export default compose(
	withVisibilityTracking( { onMount } )
)( SessionTrack );
