import React from 'react';
import {
    debounce
} from 'helpers/utils';

let handlers = [];
let listenerId = 0;
const delay = 500;

const onResize = debounce(() => {
    handlers.forEach(handler => handler.func());
}, delay);

if ('undefined' !== typeof window) {
    window.addEventListener('resize', onResize);
}

const withResize = (WrappedComponent) => {
    class ResizeComponent extends React.Component {
        constructor(props) {
            super(props);

            this.listenerId = listenerId;
            this.removeResizeListener = this.removeResizeListener.bind(this);
            this.addResizeListener = this.addResizeListener.bind(this);

            // increment the event id
            listenerId++;
        }

        addResizeListener(func) {
            handlers.push({
                id: this.listenerId,
                func: func,
            });
        }

        removeResizeListener() {
            handlers = handlers.filter((handler) => handler.id !== this.listenerId);
        }

        componentWillUnmount() {
            this.removeResizeListener();
        }

        render() {
            return ( <
                WrappedComponent { ...this.props
                }
                addResizeListener = {
                    this.addResizeListener
                }
                removeResizeListener = {
                    this.removeResizeListener
                }
                />
            );
        }
    }

    return ResizeComponent;
};

export default withResize;