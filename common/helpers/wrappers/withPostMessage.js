import React, {
    Component
} from 'react';
import {
    log
} from 'helpers/debug';
import {
    get,
    postMessage
} from 'helpers/utils';

// Exported for use by usePostMessage hook.
export const handlers = {
    add: handler => {
        handlers.stack.push(handler);
    },
    get: (eventName, frameId = null) => handlers.stack.filter(handler => {
        // If the handler provided a frameId, compare against the event's frameId
        // to make sure handlers only receive events they're interested in.
        if (handler.frameId && handler.frameId !== frameId) {
            return false;
        }

        return handler.eventName === eventName;
    }),
    remove: componentId => {
        handlers.stack = handlers.stack.filter(handler => handler.componentId !== componentId);
    },
    stack: [],
};

let componentId = 0;

const allowedDomains = [
    'qz.com',
    'qz.dev',
    'qz.test',
    'qz.vip',
    'qzprod.amc',
    'qzdev.amc',
    'quartz.cc',
    'quartz.work',
    'localhost',
];

// Confirm that the postMessage origin is an allowed domain.
const confirmOrigin = origin => {
    // Srcdoc iframes have an origin of null. Origins are usually strings.
    if (null === origin || 'null' === origin) {
        return true;
    }

    const matches = origin.match(/^https?:\/\/([^\/:]+)/);

    if (!matches || matches.length !== 2) {
        return false;
    }

    const [, hostname] = matches;
    const escapedDomainList = allowedDomains.join('|').replace(/\./g, '\\.');
    const domainMatch = new RegExp(`(${escapedDomainList})$`);

    return domainMatch.test(hostname);
};

const eventDataToObj = ({
    data
}) => {
    if (typeof data === 'object') {
        return data;
    }

    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (err) {}
    }

    return {};
};

const globalPostMessageListener = evt => {
    const {
        origin
    } = evt;
    const data = eventDataToObj(evt);

    // Don't accept messages from untrusted sources.
    if (!confirmOrigin(origin)) {
        return;
    }

    const eventName = get(data, 'eventName') || get(data, 'action');
    const frameId = get(data, 'fromId');
    const frameEl = document.getElementById(frameId); // null if fromId is undefined

    // If no event name is defined, it's not from us or our friends. A frameEl can
    // be undefined, however, since not every message expects a response.
    if (!eventName) {
        return;
    }

    // Log that the event was received.
    log('postMessage:receive', data, eventName);

    const handlersToCall = handlers.get(eventName, frameId);

    handlersToCall.forEach(handler => {
        const reply = handler.eventHandler(data, frameEl);

        // If the handler responds with an object, post it back to the frame.
        if ('object' === typeof reply && frameEl) {
            const action = eventName.replace(/^child:/, 'parent:');
            postMessage({
                action,
                data: reply,
                frameEl,
                origin
            });
        }
    });
};

if (typeof window !== 'undefined') {
    window.addEventListener('message', globalPostMessageListener);
}

/**
 * high order component to wrap a postMessage listener to a component and provides a method call to stop listening to the event.
 * @param  {Class} WrappedComponent react component, and needs to be a stateful component in order to be able to ref the wrapped component
 * @return {Class} react compontent that listens and acts on a postMessage event
 */
const withPostMessage = (WrappedComponent) => {

    class PostMessageComponent extends Component {

        constructor(props) {
            super(props);

            this._removeMessageListener = this._removeMessageListener.bind(this);
            this._addMessageListener = this._addMessageListener.bind(this);
            this.componentId = componentId;

            componentId += 1;
        }

        /**
         * internal function to stop listening to the event
         * @return
         */
        _removeMessageListener() {
            handlers.remove(this.componentId);
        }

        // internal method that will be pass down to the wrapper component so that you can set up the global handlers array
        _addMessageListener({
            eventHandler,
            eventName,
            frameId
        }) {

            if (typeof eventHandler === 'function') {

                handlers.add({
                    componentId: this.componentId,
                    eventName: eventName,
                    eventHandler: eventHandler,
                    frameId,
                });

            }

        }

        // remove the event when the component is unmounted
        componentWillUnmount() {
            this._removeMessageListener();
        }

        render() {
            return ( <
                WrappedComponent { ...this.props
                }
                addMessageListener = {
                    this._addMessageListener
                }
                removeMessageListener = {
                    this._removeMessageListener
                }
                />
            );
        }

    }

    return PostMessageComponent;

};

export default withPostMessage;