import React, {ChangeEvent} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {errors, FormErrorType, successes} from "../messages/FormMessages";
import {Container} from "react-bootstrap";
import {API} from "../api/APIManager";
import {AddEmployeeProps, Employee} from "../types/Employee";
import {NotificationManager} from 'react-notifications';

/**
 *
 * Ceci est le composant pour ajouter les employés
 */
export class ComponentAddEmployee extends React.Component<AddEmployeeProps> {
    public state: {
        clientId: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        password: string;
        role: number;
        department: string;
        jobTitles: string[];
        skills: string[];
        validated?: boolean;
        error: FormErrorType;
    };
    private errorMessage = "";

    constructor(props: AddEmployeeProps) {
        super(props);
        this.state = {
            clientId: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            role: 0,
            department: "",
            jobTitles: [],
            skills: [],
            validated: false,
            error: FormErrorType.NO_ERROR,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidUpdate(prevProps: AddEmployeeProps) {
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
                    onSubmit={this.handleSubmit}
                    onChange={this.handleChange}
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
                                {errors.requiredFirstName}
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
                                {errors.requiredName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4">
                            <Form.Label>Adresse courriel</Form.Label>
                            <Form.Control
                                id="email"
                                required
                                type="email"
                                pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
                                placeholder="exemple@exemple.com"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.invalidEmail}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Row>
                    <Row className="mb-3">
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
                                {errors.invalidPhoneNumber}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4">
                            <Form.Label>Mot de passe initial</Form.Label>
                            <Form.Control
                                id="password"
                                required
                                type="password"
                                pattern='^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$'
                                placeholder="Mot de passe"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.invalidInitialPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4">
                            <Form.Label>Département</Form.Label>
                            <Form.Select required id="department" value={this.state.department} onChange={this.handleSelect}>
                                {this.props.departments.map((department, index) => (
                                    <option key={`${index}`} value={`${department.name}`}>{`${department.name}`}</option>))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredDepartmentName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label>Corps d'emploi</Form.Label>
                            {this.props.jobTitles.map((corps) => (<Form.Check
                                    key={`${corps}`}
                                    type="checkbox"
                                    id={`${corps}`}
                                    className="jobTitles"
                                    label={`${corps}`}
                                />))}
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                            <Form.Label>Rôle de l'employé</Form.Label>
                            <Form.Select required id="role" value={this.state.role} onChange={this.handleSelect}>
                                {this.props.roles.map((role, index) => (
                                    <option key={`${index}`} value={`${index}`}>{`${role}`}</option>))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredRole}
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
                            Créer
                        </Button>
                    </div>
                </Form>
            </Container>);
    }

    /**
     * TODO
     * Generate automatically a password for new employee and ask them to change it on the first login.
     */
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
            validated: true, error: errorType,
        });
        if (errorType === FormErrorType.NO_ERROR) {
            let error = await API.createEmployee(this.state.password, new Employee({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                phoneNumber: this.state.phoneNumber,
                department: this.state.department,
                jobTitles: this.state.jobTitles,
                skills: this.state.skills,
                role: this.state.role
            }));
            if (!error) {
                NotificationManager.success(successes.success, successes.employeeCreated);
            } else {
                NotificationManager.error(error, errors.error);
            }
        }
    }

    private handleChange(event: React.ChangeEvent<HTMLFormElement>): void {
        const target = event.target;
        let name = target.id;
        let value;
        if (target.type === "checkbox") {
            value = target.checked;
        } else {
            value = target.value;
        }
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
