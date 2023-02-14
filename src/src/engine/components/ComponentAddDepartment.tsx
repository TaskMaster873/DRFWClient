import React, {ChangeEvent} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {errors, FormErrorType, successes} from "../messages/FormMessages";
import {API} from "../api/APIManager";
import {NotificationManager} from 'react-notifications';
import {AddDepartmentProps} from "../types/Department";
import { Employee } from "../types/Employee";

/**
 *
 * Ceci est le composant pour ajouter les employés
 */
export class ComponentAddDepartment extends React.Component<AddDepartmentProps> {
    public state: {
        name: string;
        director: string;
        validated?: boolean;
        error: FormErrorType;
    };

    constructor(props: AddDepartmentProps) {
        super(props);
        this.state = {
            name: "",
            director: "",
            validated: false,
            error: FormErrorType.NO_ERROR
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps: AddDepartmentProps) {
        if (prevProps.employees !== this.props.employees && this.props.employees.length > 0) {
            let firstEmployee: Employee = this.props.employees[0];
            this.setState({
                director: `${firstEmployee.firstName} ${firstEmployee.lastName}`
            });
        }
    }

    public render(): JSX.Element {
        return (
            <Form
                noValidate
                validated={this.state.validated}
                onSubmit={this.handleSubmit}
                onChange={this.handleChange}
                data-error={this.state.error}
            >
                <Row className="mb-3">
                    <h5 className="mt-4 mb-3">Ajouter un département</h5>
                    <Form.Group as={Col} md="3">
                        <Form.Label htmlFor="name" className="mt-2">Nom</Form.Label>
                        <Form.Control
                            name="name"
                            id="name"
                            required
                            type="text"
                            placeholder="Nom"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requiredDepartmentName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Form.Label htmlFor="director" className="mt-2">Directeur</Form.Label>
                        <Form.Select required name="director" id="director" value={this.state.director} onChange={this.handleSelect}>
                            {this.props.employees.map((employee, index) => (
                                <option key={`${index}`} value={`${employee.firstName} ${employee.lastName}`}>{`${employee.firstName} ${employee.lastName}`}</option>))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.requiredDepartmentDirector}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button className="mt-3 mb-3" variant="primary" type="submit">
                    Ajouter
                </Button>
            </Form>
        );
    }

    private async handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        const form = event.currentTarget;
        let isValid = form.checkValidity();

        event.preventDefault();
        event.stopPropagation();

        let errorType = FormErrorType.NO_ERROR;
        if (!isValid) {
            errorType = FormErrorType.INVALID_FORM;
        }

        this.setState({
            validated: true,
            error: errorType,
        });
        console.log(this.state)
        if (errorType === FormErrorType.NO_ERROR) {
            let error = await API.createDepartment(this.state.name, this.state.director);
            if (!error) {
                NotificationManager.success(successes.success, successes.departmentCreated);
            } else {
                NotificationManager.error(error, errors.error);
            }
        }
    }

    private handleChange(event: React.ChangeEvent<HTMLFormElement>): void {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.id;

        if (!name) {
            throw new Error("Id is undefined for element in form.");
        }

        this.setState({
            [name]: value,
        });
    }

    private handleSelect(event: ChangeEvent<HTMLSelectElement>) {
        const target = event.target;
        this.setState({[target.id]: target.value});
    }
}
