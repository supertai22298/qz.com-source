import React, {
    Component
} from 'react';

/** Manage some form state and get handlers for it. */
const withFormState = ({
        field,
        loading = false,
        submitted = false,
    }) => (WrappedComponent) =>
    class FormComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {
                field,
                loading,
                submitted,
            };

            this.handleFieldChange = this.handleFieldChange.bind(this);
            this.onError = this.onError.bind(this);
            this.onSuccess = this.onSuccess.bind(this);
            this.onSubmit = this.onSubmit.bind(this);
        }

        /** Called whenever a field changes. */
        handleFieldChange({
            value,
            error
        }) {
            this.setState({
                field: {
                    ...this.state.field,
                    value,
                    error,
                    touched: true,
                },
            });
        }

        onError(error) {
            this.setState({
                loading: false,
                field: {
                    error,
                    ...this.state.field,
                },
            });
        }

        onSubmit() {
            this.setState({
                loading: true,
                submitted: true,
            });
        }

        onSuccess() {
            this.setState({
                loading: false,
                submitted: true,
                succeeded: true,
            });
        }

        render() {
            const {
                touched,
                error
            } = this.state.field;

            return ( <
                WrappedComponent handleFieldChange = {
                    this.handleFieldChange
                }
                formState = {
                    {
                        ...this.state,
                        canSubmit: touched && !error,
                        onSubmit: this.onSubmit,
                        onSuccess: this.onSuccess,
                        onError: this.onError,
                    }
                } { ...this.props
                }
                />
            );
        }
    };

export default withFormState;