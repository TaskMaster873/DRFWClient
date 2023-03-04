import React from "react";
import {Button, Modal} from "react-bootstrap";
import {Department, DepartmentModifyDTO} from "../types/Department";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {errors, FormErrorType} from "../messages/FormMessages";
import Row from "react-bootstrap/Row";
import {Employee} from "../types/Employee";

export interface DepartmentEditProps {
    employees: Employee[],
    onEditDepartment: (departmentId: string, department: DepartmentModifyDTO) => PromiseLike<void> | Promise<void> | void;
    departmentToEdit?: Department;
    cancelEdit: () => PromiseLike<void> | Promise<void> | void;
}

export interface DepartmentEditState {
    validated?: boolean;
    error: FormErrorType;
}

/**
 * This is the form to edit a department
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory Department
 * @hideconstructor
 */
export class ComponentEditDepartment extends React.Component<DepartmentEditProps, DepartmentEditState> {
    public state: DepartmentEditState = {
        validated: false,
        error: FormErrorType.NO_ERROR
    };

    public render(): JSX.Element {
        return <Modal show={this.props.departmentToEdit != null} onHide={() => this.hideModal()}>
            <Form
                noValidate
                validated={this.state.validated}
                onSubmit={this.#handleSubmit}
                data-error={this.state.error}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Édition de département</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row className="mb-4">
                        <Form.Group as={Col} md="6">
                            <Form.Label className="mt-2">Nom</Form.Label>
                            <Form.Control
                                required
                                name="name"
                                type="text"
                                placeholder="Nom"
                                defaultValue={this.props.departmentToEdit?.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.REQUIRED_DEPARTMENT_NAME}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                            <Form.Label className="mt-2">Directeur</Form.Label>
                            <Form.Select required name="director" defaultValue={this.props.departmentToEdit?.director}>
                                {this.props.employees.map((employee, index) => (
                                    <option key={`${index}`}
                                            value={`${employee.firstName} ${employee.lastName}`}>{`${employee.firstName} ${employee.lastName}`}</option>))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.REQUIRED_DEPARTMENT_DIRECTOR}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.hideModal()}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    }

    /**
     * Function that hides the modal when close button is clicked
     * @private
     */
    private hideModal(): void {
        this.props.cancelEdit();
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

        let eventTarget: any = event.target;
        let formData = new FormData(eventTarget);
        let formDataObj: Department = Object.fromEntries(formData.entries()) as unknown as Department;

        let errorType = FormErrorType.NO_ERROR;
        if (!isValid) {
            errorType = FormErrorType.INVALID_FORM;
        }

        this.setState({
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR && this.props.departmentToEdit?.id) {
            await this.props.onEditDepartment(this.props.departmentToEdit?.id, formDataObj);
        }
    }
}
