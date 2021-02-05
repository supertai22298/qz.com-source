import React from 'react';

let listenerId = 0;

const delay = 1000 / 60; // 60fps
const handlers = {};
const windowProps = {};

let lastTime = 0;
let lastPageY = 0;

export const addHandler = fn => {
    listenerId = listenerId + 1;
    handlers[listenerId] = fn;

    return listenerId;
};

export const removeHandler = id => {
    delete handlers[id];
};

/**
 * Encapsulate scroll check. Don't call scroll handlers if scrollY has not
 * changed.
 */
const scrollLoop = () => {
    const {
        pageYOffset
    } = window; // This usually triggers reflow.

    if (pageYOffset === lastPageY) {
        return;
    }

    lastPageY = pageYOffset;

    const scrollProps = {
        pageYOffset,
        timestamp: lastTime,
        ...windowProps
    };

    // Call registered handlers.
    Object.values(handlers).forEach(fn => fn(scrollProps));
};

/**
 * Throttle scroll events. Don't call loop if not enough time has passed since
 * the last time we called it.
 */
const scrollLoopWithTimeout = timestamp => {
    if (timestamp - lastTime >= delay) {
        lastTime = timestamp;
        scrollLoop();
    }

    // Request another frame.
    window.requestAnimationFrame(scrollLoopWithTimeout);
};

const setWindowProps = () => {
    windowProps.innerHeight = window.innerHeight;
    windowProps.innerWidth = window.innerWidth;
};

// Start requestAnimationFrame loop.
if ('undefined' !== typeof window && window.requestAnimationFrame) {
    setWindowProps();
    window.addEventListener('resize', setWindowProps);
    window.requestAnimationFrame(scrollLoopWithTimeout);
}

const withScroll = WrappedComponent => {
    class ScrollComponent extends React.Component {

        constructor(props) {
            super(props);

            this.addScrollListener = this.addScrollListener.bind(this);

            this.ids = [];
        }

        addScrollListener(func) {
            const id = addHandler(func);
            this.ids.push(id);

            return id;
        }

        componentWillUnmount() {
            this.ids.forEach(removeHandler);
        }

        render() {
            return ( <
                WrappedComponent { ...this.props
                }
                addScrollListener = {
                    this.addScrollListener
                }
                />
            );
        }
    }

    return ScrollComponent;
};

/**
 * Get the lastPageY as tracked by our scroll listener. Not to be used by React
 * components!!! Use withScroll HOC or you'll be sorry. Trust me I'm a doctor.
 *
 * @return {Number}
 */
export const getLastPageY = () => lastPageY + windowProps.innerHeight;

export default withScroll;