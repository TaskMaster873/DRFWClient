import React, {ChangeEvent} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { errors, FormErrorType } from "../messages/FormMessages";
import { Container } from "react-bootstrap";
import {EditEmployeeProps, EmployeeEditDTO} from "../types/Employee";

interface ComponentEditEmployeeState {
    employeeId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    department: string;
    jobTitles: string[];
    skills: string[];
    role: number;
    validated?: boolean;
    error: FormErrorType;
}

/**
 * This is the form to add an employee
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory Employee
 * @hideconstructor
 */
export class ComponentEditEmployee extends React.Component<EditEmployeeProps, ComponentEditEmployeeState> {
    public state: ComponentEditEmployeeState = {
        employeeId: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        department: "",
        jobTitles: [],
        skills: [],
        validated: false,
        role: 0,
        error: FormErrorType.NO_ERROR,
    };

    public props: EditEmployeeProps;

    constructor(props: EditEmployeeProps) {
        super(props);

        this.props = props;
    }

    public componentDidUpdate(prevProps: EditEmployeeProps) : void {
        if (prevProps.departments !== this.props.departments && this.props.departments.length > 0) {
            this.setState({
                department: this.props.departments[0].name
            });
        }
    }

    public render(): JSX.Element {
        return (<Container>
            <Form
                noValidate
                validated={this.state.validated}
                onSubmit={this.#handleSubmit}
                onChange={this.#handleChange}
                data-error={this.state.error}
            >
                <Row className="mb-3 mt-3">

                    <Form.Group as={Col} md="4">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                            id="firstName"
                            required
                            type="text"
                            placeholder="Prénom"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.REQUIRED_FIRSTNAME}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            id="lastName"
                            required
                            type="text"
                            placeholder="Nom"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.REQUIRED_NAME}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Numéro de téléphone</Form.Label>
                        <Form.Control
                            id="phoneNumber"
                            required
                            type="tel"
                            pattern="^(\+?1 ?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$"
                            placeholder="000-000-0000"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.INVALID_PHONE_NUMBER}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4">
                        <Form.Label>Département</Form.Label>
                        <Form.Select required id="department" value={this.state.department}
                                     onChange={this.#handleSelect}>
                            {this.props.departments.map((department, index) => (
                                <option key={`${index}`} value={`${department.name}`}>{`${department.name}`}</option>))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.REQUIRED_DEPARTMENT_NAME}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Corps d'emploi</Form.Label>
                        {this.props.jobTitles.length != 0 ? this.props.jobTitles.map((corps) => (<Form.Check
                            key={`${corps}`}
                            type="checkbox"
                            id={`${corps}`}
                            className="jobTitles"
                            label={`${corps}`}
                        />)) : <p className="mt-1 noneJobTitle">Aucun corps d'emplois</p>}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Rôle de l'employé</Form.Label>
                        <Form.Select required id="role" value={this.state.role} onChange={this.#handleSelect}>
                            {this.props.roles.map((role, index) => (
                                <option key={`${index}`} value={`${index}`}>{`${role}`}</option>))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.REQUIRED_ROLE}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <div className="d-flex justify-content-center">
                    <Button
                        onClick={() => history.back()}
                        className="mb-3 me-4 btn-lg"
                        variant="secondary"
                    >
                        Retour
                    </Button>
                    <Button className="mb-3 btn-lg" variant="primary" type="submit">
                        Confirmer
                    </Button>
                </div>
            </Form>
        </Container>);
    }

    /**
     * TODO
     * Generate automatically a password for new employee and ask them to change it on the first login.
     */

    /**
     * Handle the form submission. Validate the form and attempt to create the employee.
     * @param event The form submission event. Contains the form data to be validated.
     * @private
     * @returns {Promise<void>}
     * @memberof CreateEmployee
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
            validated: true, error: errorType,
        });
        if (errorType === FormErrorType.NO_ERROR) {
            let employee: EmployeeEditDTO = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                department: this.state.department,
                jobTitles: this.state.jobTitles,
                skills: this.state.skills, // @ts-ignore
                role: parseInt(this.state.role)
            }
            this.props.onEditEmployee(this.state.employeeId, employee);
        }
    }

    /**
     * Handle the change of a form element. Update the state with the new value.
     * @param event The change event. Contains the new value of the form element.
     * @returns {void}
     * @memberof CreateEmployee
     * @private
     */
    readonly #handleChange = (event: React.ChangeEvent<HTMLFormElement>): void => {
        const target = event.target;
        let name: string = target.id;

        let value;
        if (target.type === "checkbox") {
            value = target.checked;
        } else {
            value = target.value;
        }

        if (!name) {
            throw new Error("Id is undefined for element in form.");
        }

        this.setState({...this.state, ...{
                [name]: value,
            }});
    }

    readonly #handleSelect = (event: ChangeEvent<HTMLSelectElement>) : void => {
        const target = event.target;
        this.setState({...this.state, ...{
                [target.id]: target.value
            }});
    }
}
