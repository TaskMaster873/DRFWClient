import React from "react";
import {Form} from "react-bootstrap";
import {FormErrorType} from "../messages/FormMessages";
import {Department} from "../types/Department";

interface Props {
    departments: Department[];
    changeDepartment: (department: Department) => void;
}

interface State {
    validated: boolean;
    error: FormErrorType;
}

/**
 * This component displays the form to select a department.
 */
export class SelectDepartment extends React.Component<Props, State> {
    public state: State = {
        validated: false,
        error: FormErrorType.NO_ERROR,
    };

    public render(): JSX.Element {
        return (
            <Form
                noValidate
                validated={this.state.validated}
                data-error={this.state.error}
            >
                <Form.Label>Département</Form.Label>
                <Form.Select aria-label="Department selector" onChange={(e) => {
                    this.#handleChange(e);
                }}>
                    {this.props.departments.map((department, index: number) => (
                        <option value={index} key={index}>{department.name}</option>
                    ))}
                </Form.Select>
            </Form>
        );
    }

    /**
     * Handles the change of the department.
     * @param event - The event
     * @private
     * @return {Promise<void>} - A promise to nothing
     * @async
     */
    readonly #handleChange = async (event: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        let errorType = FormErrorType.NO_ERROR;

        if (!isValid) {
            errorType = FormErrorType.INVALID_FORM;
        }

        this.setState({
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR) {
            this.props.changeDepartment(this.props.departments[event.currentTarget.value]);
        }
    };
}
