import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

const withPasswordToggle = () => WrappedComponent => {
    class PasswordToggle extends Component {
        constructor(props) {
            super(props);

            this.state = {
                type: props.type,
                toggleText: 'show',
                toggleActive: false,
            };

            this.toggleInputType = this.toggleInputType.bind(this);
        }

        toggleInputType(event) {
            event.preventDefault();

            const {
                type
            } = this.state;

            // switch between password and input types
            if (type === 'password') {
                this.setState({
                    type: 'text',
                    toggleText: 'hide',
                    toggleActive: true,
                });
            } else {
                this.setState({
                    type: 'password',
                    toggleText: 'show',
                    toggleActive: false,
                });
            }
        }

        render() {
            const {
                toggleText,
                type,
                toggleActive
            } = this.state;

            return ( <
                WrappedComponent { ...this.props
                }
                toggleText = {
                    toggleText
                }
                handleToggleClick = {
                    this.toggleInputType
                }
                toggleActive = {
                    toggleActive
                }
                type = {
                    type
                }
                />
            );
        }
    }

    PasswordToggle.propTypes = {
        type: PropTypes.string,
    };

    return PasswordToggle;
};

export default withPasswordToggle;