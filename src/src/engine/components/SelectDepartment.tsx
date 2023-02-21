import React from "react";
import {Form} from "react-bootstrap";
import {API} from "../api/APIManager";
import {FormErrorType} from "../messages/FormMessages";
import {Department} from "../types/Department";

interface Props {
    departments: Department[];
    changeDepartment: (department: Department) => {};
}

interface State {
    currentDepartmentIndex: string;
    validated: boolean;
    error: FormErrorType;
}

export class SelectDepartment extends React.Component<Props, State> {
    public state: State = {
        currentDepartmentIndex: "0",
        validated: false,
        error: FormErrorType.NO_ERROR,
    };

    readonly #handleChange = async (event: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        let errorType = FormErrorType.NO_ERROR;

        if (!isValid) {
            errorType = FormErrorType.INVALID_FORM;
        }

        event.preventDefault();
        event.stopPropagation();

        this.setState({
            currentDepartmentIndex: event.target.value,
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR) {
            this.props.changeDepartment(this.props.departments[event.currentTarget.value]);
        }
    };

    public render(): JSX.Element {
        return (
            <Form
                noValidate
                validated={this.state.validated}
                
                data-error={this.state.error}
            >
                <Form.Select aria-label="Department selector" onChange={(e) => {this.#handleChange(e)}}>
                    {this.props.departments.map((department, index: number) => (
                        <option value={index} key={index}>{department.name}</option>
                    ))}
                </Form.Select>
            </Form>
        );
    }
}
