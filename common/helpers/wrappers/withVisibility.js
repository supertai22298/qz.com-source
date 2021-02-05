import React, {
    Component
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import withAmp from 'helpers/wrappers/withAmp';

const callbacks = {};
const observers = {};

/**
 * withVisibility
 *
 * Provides a "setRef" function prop required for this to work
 *
 * Use IntersectionObserver to provide a "visible" boolean prop when
 * element becomes visible on the page.
 *
 * @option {bool}   initialVisibility Whether element should be initially
 *                                    visible (default false).
 * @option {number} rootMargin Margin around viewport included in visibility
 *                             calculation (default 0).
 * @option {bool}   persistent Continue to subscribe even after element becomes
 *                             visible (default false).
 * @option {number} threshold  Number representing amount of element that must
 *                             be visible. Rounded to nearest of these values to
 *                             maximise reuse: 0, 0.5, 1 (default 0).
 * @option {function} shouldUpdate Function to calculate if the component should update based on child component props
 *
 */
export default (options = {}) => WrappedComponent => {
    const initialVisibility = options.initialVisibility || false;
    const rootMargin = options.rootMargin || 0;
    const threshold = Math.max(0, Math.min(1, options.threshold || 0));
    const shouldUpdate = options.shouldUpdate || (() => false);

    class ComponentWithVisibility extends Component {
        constructor(props) {
            super(props);

            this.state = {
                hasDeterminedInitialVisibility: false,
                visible: props.amp || initialVisibility,
            };

            this.onIntersect = this.onIntersect.bind(this);
            this.setRef = this.setRef.bind(this);
            this.reset = this.reset.bind(this);
            this.setupListener = this.setupListener.bind(this);
        }

        componentDidMount() {
            const {
                lazyLoad
            } = this.props;

            if (lazyLoad) {
                this.setupListener();
            }
        }

        componentWillUnmount() {
            const {
                lazyLoad
            } = this.props;

            if (lazyLoad) {
                this.unsubscribe(true);
            }
        }

        setupListener() {
            if (this.supportsObserver()) {
                this.observer = this.getObserver();
                this.subscribe();
                return;
            }
        }

        getObserver() {
            // If an observer doesn't exist for this rootMargin, create it.
            if (!observers[rootMargin]) {
                const observerOptions = {
                    rootMargin: `${rootMargin}px`,
                    threshold: [0, 0.5, 1],
                };

                const taskRunner = entries => callbacks[rootMargin].forEach(cb => cb(entries));

                callbacks[rootMargin] = [this.onIntersect];
                observers[rootMargin] = new IntersectionObserver(taskRunner, observerOptions);
            }

            callbacks[rootMargin].push(this.onIntersect);
            return observers[rootMargin];
        }

        stopObserving() {
            if (!this.observer) {
                return;
            }

            // Stop observing.
            this.el && this.observer.unobserve(this.el);
            callbacks[rootMargin] = callbacks[rootMargin].filter(cb => cb !== this.onIntersect);
        }

        onIntersect(allEntries) {
            // Entries is an array of entries for all observed elements; find ours.
            const entries = allEntries.filter(entry => entry.target === this.el);

            // Only update if there are elements to consider.
            if (entries.length) {
                // Determine if the element passes the threshold (which may be 0).
                const visible = entries.some(entry => entry.intersectionRatio > threshold);
                this.update(visible);
            }
        }

        setRef(ref) {
            if (!ref) {
                this.unsubscribe(true);
                this.el = null;
                return;
            }

            this.el = ref;
            if (ref.isReactComponent) {
                this.el = ReactDOM.findDOMNode(ref);
            }

            this.subscribe();
        }

        shouldComponentUpdate(nextProps, nextState) {
            const {
                hasDeterminedInitialVisibility,
                visible
            } = this.state;

            return (
                visible !== nextState.visible ||
                hasDeterminedInitialVisibility !== nextState.hasDeterminedInitialVisibility ||
                shouldUpdate(this.props, nextProps)
            );
        }

        subscribe() {
            if (!this.el) {
                console.error('An el is required for withVisibility to work. Please use the setRef prop on this component:', {
                    WrappedComponent
                });
                return;
            }

            if (this.observer) {
                this.observer.observe(this.el);
                return;
            }
        }

        // https://github.com/w3c/IntersectionObserver/blob/master/polyfill
        supportsObserver() {
            return (
                'IntersectionObserver' in window &&
                'IntersectionObserverEntry' in window &&
                'intersectionRatio' in window.IntersectionObserverEntry.prototype
            );
        }

        unsubscribe(force = false) {
            if (!force && options.persistent) {
                return;
            }

            this.stopObserving();
            delete this.el;
        }

        update(newVisibility) {
            const {
                hasDeterminedInitialVisibility,
                visible
            } = this.state;

            if (visible === newVisibility && hasDeterminedInitialVisibility) {
                return;
            }

            // Attempt to unsubscribe if element is now visible.
            if (newVisibility) {
                this.unsubscribe();
            }

            this.setState({
                hasDeterminedInitialVisibility: hasDeterminedInitialVisibility || newVisibility,
                visible: newVisibility,
            });
        }

        reset() {
            this.setState({
                hasDeterminedInitialVisibility: false,
                visible: initialVisibility || !this.props.lazyLoad,
            }, this.setupListener);
        }

        render() {
            const {
                hasDeterminedInitialVisibility,
                visible
            } = this.state;
            const {
                lazyLoad,
                amp
            } = this.props;

            return ( <
                WrappedComponent setRef = {
                    this.setRef
                }
                hasDeterminedInitialVisibility = {
                    hasDeterminedInitialVisibility
                }
                resetVisibility = {
                    this.reset
                }
                visible = {!lazyLoad || amp ? true : visible
                } { ...this.props
                }
                />
            );
        }
    }

    ComponentWithVisibility.propTypes = {
        amp: PropTypes.bool.isRequired,
        lazyLoad: PropTypes.bool.isRequired,
    };

    ComponentWithVisibility.defaultProps = {
        amp: false,
        lazyLoad: true,
    };

    return withAmp()(ComponentWithVisibility);
};