import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

export const fieldStateProps = PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    errors: PropTypes.arrayOf(PropTypes.node),
    blurred: PropTypes.bool,
});

export default () => WrappedComponent => {
    class FieldState extends Component {

        constructor(props) {
            super(props);

            this.state = {
                blurred: false
            };

            this.handleFieldChange = this.handleFieldChange.bind(this);
            this.handleBlur = this.handleBlur.bind(this);
        }

        handleBlur() {
            const {
                fieldName,
                fieldState
            } = this.props;

            this.props.handleFieldChange(fieldName, { ...fieldState,
                blurred: true
            });
        }

        handleFieldChange(value) {
            const {
                fieldName,
                fieldState
            } = this.props;

            this.props.handleFieldChange(fieldName, { ...fieldState,
                value
            });
        }

        render() {
            const {
                fieldState,
                hint
            } = this.props;
            const {
                errors,
                value,
                blurred
            } = fieldState;

            const showErrors = blurred && errors && errors.length;

            return ( <
                WrappedComponent handleBlur = {
                    this.handleBlur
                }
                errors = {
                    errors
                }
                value = {
                    value
                }
                subtext = {
                    showErrors ? errors[0] : hint
                }
                status = {
                    showErrors ? 'error' : ''
                } { ...this.props
                }
                handleChange = {
                    this.handleFieldChange
                }
                />
            );
        }
    }

    FieldState.propTypes = {
        fieldName: PropTypes.string.isRequired,
        fieldState: fieldStateProps,
        handleFieldChange: PropTypes.func.isRequired,
        hint: PropTypes.node,
    };

    FieldState.defaultProps = {
        hint: '',
        fieldState: {},
    };

    return FieldState;
};