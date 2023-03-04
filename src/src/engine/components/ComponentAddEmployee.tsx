import React, {ChangeEvent} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { errors, FormErrorType } from "../messages/FormMessages";
import { Container } from "react-bootstrap";
import {AddEmployeeProps, Employee, EmployeeCreateDTO} from "../types/Employee";
import {RegexUtil} from "../utils/RegexValidator";
import {API} from "../api/APIManager";
import {ComponentEditSkills} from "./ComponentEditSkills";
import {ComponentEditJobTitles} from "./ComponentEditJobTitles";
import {Skill} from "../types/Skill";
import FormUtils from "../utils/FormUtils";
import {JobTitle} from "../types/JobTitle";
import {IoSettingsSharp} from "react-icons/io5";

interface ComponentAddEmployeeState extends Employee {
    showEditJobTitles: boolean;
    showEditSkills: boolean;
    validated?: boolean;
    error: FormErrorType;
    password: string;
}

/**
 * This is the form to add an employee
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory Employee
 * @hideconstructor
 */
export class ComponentAddEmployee extends React.Component<AddEmployeeProps, ComponentAddEmployeeState> {
    public state: ComponentAddEmployeeState = {
        department: "",
        email: "",
        error: FormErrorType.NO_ERROR,
        firstName: "",
        jobTitles: [],
        lastName: "",
        password: "",
        phoneNumber: "",
        role: 0,
        showEditJobTitles: false,
        showEditSkills: false,
        skills: [],
        validated: false,
        isActive: false,
        hasChangedDefaultPassword: false,
    };

    public props: AddEmployeeProps;

    constructor(props: AddEmployeeProps) {
        super(props);

        this.props = props;
    }

    public componentDidUpdate(prevProps: AddEmployeeProps) : void {
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
                            name="firstName"
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
                            name="lastName"
                            required
                            type="text"
                            placeholder="Nom"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.REQUIRED_NAME}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Adresse courriel</Form.Label>
                        <Form.Control
                            name="email"
                            required
                            type="email"
                            pattern={RegexUtil.emailGoodRegex}
                            placeholder="exemple@exemple.ca"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.INVALID_EMAIL}
                        </Form.Control.Feedback>
                    </Form.Group>

                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4">
                        <Form.Label>Numéro de téléphone</Form.Label>
                        <Form.Control
                            name="phoneNumber"
                            required
                            type="tel"
                            pattern={RegexUtil.phoneNumberRegex}
                            placeholder="0 (000)-000-0000"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.INVALID_PHONE_NUMBER}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Mot de passe initial</Form.Label>
                        <Form.Control
                            name="password"
                            required
                            type="password"
                            pattern={RegexUtil.goodPasswordRegex}
                            placeholder="Mot de passe"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.INVALID_INITIAL_PASSWORD}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Département</Form.Label>
                        <Form.Select required name="department" value={this.state.department}
                                     onChange={this.#handleSelect}>
                            {this.props.departments.map((department, index) => (
                                <option key={`${index}`} value={`${department.name}`}>{`${department.name}`}</option>))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.REQUIRED_DEPARTMENT_NAME}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4">
                        <Form.Label>Corps d'emploi</Form.Label>
                        <Button onClick={() => this.#onShowEditJobTitles()} className="float-end">
                            <IoSettingsSharp className="mb-05" />
                        </Button>
                        {this.props.jobTitles.map((title: JobTitle) => (<Form.Check
                            key={title.name}
                            type="checkbox"
                            name="jobTitles"
                            label={title.name}
                            value={title.name}
                        />))}
                        <ComponentEditJobTitles cancelEdit={() => this.#onShowEditJobTitles(false)}
                            showEdit={this.state.showEditJobTitles} jobTitles={this.props.jobTitles}
                            onAddJobTitle={this.props.onAddJobTitle} onEditJobTitle={this.props.onEditJobTitle}
                            onDeleteJobTitle={this.props.onDeleteJobTitle}></ComponentEditJobTitles>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Compétences</Form.Label>
                        <Button onClick={() => this.#onShowEditSkills()} className="float-end">
                            <IoSettingsSharp className="mb-05" />
                        </Button>
                        {this.props.skills.map((skill: Skill) => (<Form.Check
                            key={skill.name}
                            type="checkbox"
                            name="skills"
                            label={skill.name}
                            value={skill.name}
                        />))}
                        <ComponentEditSkills cancelEdit={() => this.#onShowEditSkills(false)}
                            showEdit={this.state.showEditSkills} skills={this.props.skills}
                            onAddSkill={this.props.onAddSkill} onEditSkill={this.props.onEditSkill}
                            onDeleteSkill={this.props.onDeleteSkill}></ComponentEditSkills>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Rôle de l'employé</Form.Label>
                        <Form.Select required name="role" value={this.state.role} onChange={this.#handleSelect}>
                            {this.props.roles.map((role: string, index: number) => {
                                if(API.hasLowerPermission(index)) {
                                    return <option key={index} value={index}>{role}</option>
                                }
                            })}
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
                        Créer
                    </Button>
                </div>
            </Form>
        </Container>);
    }

    readonly #onShowEditJobTitles = (value: boolean = true): void => {
        this.setState({showEditJobTitles: value})
    }

    readonly #onShowEditSkills = (value: boolean = true): void => {
        this.setState({showEditSkills: value})
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
        let errorType = FormUtils.validateForm(event);
        this.setState({
            validated: true,
            error: errorType
        });

        if (errorType === FormErrorType.NO_ERROR) {
            let employee: EmployeeCreateDTO = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                phoneNumber: this.state.phoneNumber,
                department: this.state.department,
                isActive: this.state.isActive,
                jobTitles: this.state.jobTitles,
                skills: this.state.skills, // @ts-ignore
                role: parseInt(this.state.role),
                hasChangedDefaultPassword: this.state.hasChangedDefaultPassword
            };
            console.log(employee);
            this.props.onAddEmployee(this.state.password, employee);
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
        let name: string = target.name;

        let value = target.value;
        if (target.type === "checkbox") {
            let array: string[] = this.state[name];
            if(target.checked) {
                array.push(value);
            } else {
                let index = array.findIndex((elem: string) => elem === value);
                array.splice(index, 1);
            }
            this.setState({...this.state, ...{
                    [name]: array,
                }});
        } else {
            this.setState({...this.state, ...{
                    [name]: value,
            }});
        }

        if (!name) {
            throw new Error("Name is undefined for element in form.");
        }
    }

    readonly #handleSelect = (event: ChangeEvent<HTMLSelectElement>) : void => {
        const target = event.target;
        this.setState({...this.state, ...{
            [target.name]: target.value
        }});
    }
}
