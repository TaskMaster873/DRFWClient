import React, {ChangeEvent} from "react";
import {Button, Modal} from "react-bootstrap";
import {Department} from "../types/Department";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {errors, FormErrorType} from "../messages/FormMessages";
import Row from "react-bootstrap/Row";
import {Employee} from "../types/Employee";

export interface DepartmentEditProps {
    employees: Employee[],
    onEditDepartment: (department) => PromiseLike<void> | Promise<void> | void;
}

export interface DepartmentEditState {
    showModal: boolean;
    name: string;
    director: string;
    validated?: boolean;
    error: FormErrorType;
}

export class ComponentEditDepartment extends React.Component<DepartmentEditProps, DepartmentEditState> {
    public state: DepartmentEditState = {
        showModal: false,
        name: "",
        director: "",
        validated: false,
        error: FormErrorType.NO_ERROR
    };

    public render(): JSX.Element {
        return <Modal show={this.state.showModal} onHide={() => this.modalVisibility(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Édition d'employé</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    noValidate
                    validated={this.state.validated}
                    onSubmit={this.#handleSubmit}
                    onChange={this.#handleChange}
                    data-error={this.state.error}
                >
                    <Row className="mb-3">
                        <Form.Group as={Col} md="3">
                            <Form.Label className="mt-2">Nom</Form.Label>
                            <Form.Control
                                id="name"
                                required
                                type="text"
                                placeholder="Nom"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.REQUIRED_DEPARTMENT_NAME}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3">
                            <Form.Label className="mt-2">Directeur</Form.Label>
                            <Form.Select required id="director" value={this.state.director}
                                         onChange={this.#handleSelect}>
                                {this.props.employees.map((employee, index) => (
                                    <option key={`${index}`}
                                            value={`${employee.firstName} ${employee.lastName}`}>{`${employee.firstName} ${employee.lastName}`}</option>))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.REQUIRED_DEPARTMENT_DIRECTOR}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.modalVisibility(false)}>
                    Close
                </Button>
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    }

    private modalVisibility(visible: boolean): void {
        this.setState({showModal: visible});
    }

    /**
     * Function that is called when the form is submitted.
     * @param event The event that triggered the function
     * @private
     */
    readonly #handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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

        if (errorType === FormErrorType.NO_ERROR) {
            let department = new Department({name: this.state.name, director: this.state.director});
            await this.props.onEditDepartment(department);

        }
    }

    /**
     * Function that is called when the form is changed. This update the state of the component.
     * @param event The event that triggered the function
     * @private
     */
    readonly #handleChange = (event: React.ChangeEvent<HTMLFormElement>): void => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.id;

        if (!name) {
            throw new Error("Id is undefined for element in form.");
        }

        this.setState({
            ...this.state, ...{
                [name]: value,
            }
        });
    }

    /**
     * Function that is called when the select is changed. This update the state of the component.
     * @param event The event that triggered the function
     * @private
     */
    readonly #handleSelect = (event: ChangeEvent<HTMLSelectElement>): void => {
        const target = event.target;

        this.setState({
            ...this.state, ...{
                [target.id]: target.value
            }
        });
    }


}
