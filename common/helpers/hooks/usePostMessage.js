import {
    useEffect
} from 'react';
import {
    handlers
} from 'helpers/wrappers/withPostMessage';

/**
 * A simple hook to help implement postMessage communication. This piggybacks on
 * top of withPostMessage, using the same global event listener and shared
 * handlers array. This means we can have a single listener instead of one per
 * frame. Eventually we might phase out withPostMessage and bring that shared
 * listener here.
 *
 * @param  {string}   eventName    Name of the event you would like to listen to.
 * @param  {function} eventHandler Callback to fire when the listened-for event arrives.
 * @param  {string}   frameId      Frame ID to restrict listening to a specific frame.
 * @return {undefined}
 */
export default (eventName, eventHandler, frameId) => {
    useEffect(() => {
        // The withPostMessage HOC generates a component ID to remove all listeners
        // that were added by the component on unmount. This hook will only be used
        // with a single listener and a single iframe, so we will use the frame ID as
        // the component ID.
        //
        // Push into the shared handlers array. When a message is posted to the
        // parent, it will call the event handler if (1) it matches the event name
        // and (2) it matches the frameId, if supplied.
        handlers.add({
            componentId: frameId,
            eventName,
            eventHandler,
            frameId
        });

        // On unmount, remove this listener from the shared handlers array.
        return () => {
            handlers.remove(frameId);
        };
    }, [eventHandler, eventName, frameId]);
};