import {
    useCallback,
    useEffect,
    useRef
} from 'react';
import {
    useDispatch
} from 'react-redux';
import {
    useParams
} from 'react-router-dom';
import {
    encodeRelayId
} from 'helpers/graphql';
import useInView from './useInView';

/**
 * Provide a function that will dispatch a tracking action, optionally calling
 * a wrapped event handler.
 *
 * @param  {Function} actionCreator Redux action creator.
 * @param  {Object}   data          Additional data to pass to action creator.
 * @param  {Function} fn            Event handler to call after action is dispatched.
 */
export default function useTracking(actionCreator, data, fn = undefined) {
    const dispatch = useDispatch();

    // If this action is being dispatched on an article page, we want to include
    // the article ID. It is named "post" to conform with Vent naming standards.
    const {
        postId
    } = useParams();
    const post = parseInt(postId, 10) || null;
    const relayId = post ? encodeRelayId('post', post) : null;

    // Use a ref to create a stable version of our tracking payload that we can use
    // in our useCallback dependency array.
    const payload = useRef({ ...data,
        post,
        relayId
    });

    return useCallback((...args) => {
        // If your action creator uses the args passed through
        // at dispatch time (not just trackingData) make sure it expects the
        // signature it's getting.
        dispatch(actionCreator(payload.current, ...args));
        fn ? .(...args);
    }, [actionCreator, dispatch, fn]);
}

/**
 * Sometimes we need to track clicks on any link within a container. This is
 * especially useful for, say, a blob of HTML that we "dangerously set". This
 * hook returns a ref that should be passed to the container element. It will
 * intercept link clicks inside the container, fire the tracking action, and let
 * the event continue to bubble up the DOM.
 *
 * If you have structured markup, don't use this hook. Use the Link component
 * and its onClick prop.
 */
export function useTrackingOnInnerHtmlLinkClick(actionCreator, data) {
    const onClick = useTracking(actionCreator, data);
    const ref = useRef(null);

    useEffect(() => {
        // Store a reference for the cleanup function.
        const el = ref.current;

        function trackLinkClick(evt) {
            // Not a link? Nothing to track.
            if ('a' !== evt.target ? .nodeName.toLowerCase()) {
                return;
            }

            // Pass additional context about the link to the action creator.
            onClick({
                destinationHeadline: evt.target ? .innerText || null,
                destinationUrl: evt.target ? .href,
            });
        }

        // Listen for link clicks on the container element and fire the tracking
        // action (but do not stop propagation of the event). Also listen for a user
        // opening the context-menu (right-clicking, but also possible via the
        // keyboard). This doesn't necessarily mean they opened in a new tab, but is
        // a good-enough proxy.
        el ? .addEventListener('click', trackLinkClick);
        el ? .addEventListener('contextmenu', trackLinkClick);

        // Clean up.
        return () => {
            el ? .removeEventListener('click', trackLinkClick);
            el ? .removeEventListener('contextmenu', trackLinkClick);
        };
    }, [onClick]);

    return ref;
}

/**
 * Provide a function that will dispatch a tracking action once
 *
 * @param  {Function} actionCreator Redux action creator.
 * @param  {Object}   data          Additional data to pass to action creator.
 */
export function useTrackingOnMount(actionCreator, data) {
    const onMountDispatch = useTracking(actionCreator, data);

    useEffect(() => {
        onMountDispatch();
    }, [onMountDispatch]);
}

/**
 * Provide a function that will dispatch a tracking action when the component
 * comes into view. Returns a ref that MUST be passed to a DOM element.
 *
 * @param  {Function} actionCreator Redux action creator.
 * @param  {Object}   data          Additional data to pass to action creator.
 */
export function useTrackingOnView(actionCreator, data) {
    const [ref, inView] = useInView();
    const onView = useTracking(actionCreator, data);

    useEffect(() => {
        if (inView) {
            onView();
        }
    }, [inView, onView]);

    return ref;
}