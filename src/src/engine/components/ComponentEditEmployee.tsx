import React, {ChangeEvent} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {errors, FormErrorType} from "../messages/FormMessages";
import {Container} from "react-bootstrap";
import {EditEmployeeProps, EmployeeEditDTO} from "../types/Employee";
import {Department} from "../types/Department";
import {API} from "../api/APIManager";
import {RegexUtil} from "../utils/RegexValidator";
import {JobTitle} from "../types/JobTitle";
import FormUtils from "../utils/FormUtils";
import {Skill} from "../types/Skill";
import {ComponentEditSkills} from "./ComponentEditSkills";
import {ComponentEditJobTitles} from "./ComponentEditJobTitles";
import {IoSettingsSharp} from "react-icons/io5";

interface ComponentEditEmployeeState {
    department?: string;
    role?: number;
    showEditJobTitles: boolean;
    showEditSkills: boolean;
    validated?: boolean;
    error: FormErrorType;
}

/**
 * This is the form to edit an employee
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory Employee
 * @hideconstructor
 */
export class ComponentEditEmployee extends React.Component<EditEmployeeProps, ComponentEditEmployeeState> {
    public state: ComponentEditEmployeeState = {
        department: "",
        role: 0,
        showEditJobTitles: false,
        showEditSkills: false,
        validated: false,
        error: FormErrorType.NO_ERROR,
    };

    public props: EditEmployeeProps;

    constructor(props: EditEmployeeProps) {
        super(props);
        this.props = props;
    }

    public render(): JSX.Element {
        return <Container>
            <Form
                noValidate
                validated={this.state.validated}
                onSubmit={this.#handleSubmit}
                onChange={this.#handleChange}
                data-error={this.state.error}>
                <Row className="mb-3 mt-3">
                    <Form.Group as={Col} md="3">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                            name="firstName"
                            required
                            type="text"
                            placeholder="Prénom"
                            defaultValue={this.props.editedEmployee?.firstName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.REQUIRED_FIRSTNAME}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            name="lastName"
                            required
                            type="text"
                            placeholder="Nom"
                            defaultValue={this.props.editedEmployee?.lastName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.REQUIRED_NAME}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Form.Label>Numéro de téléphone</Form.Label>
                        <Form.Control
                            name="phoneNumber"
                            required
                            type="tel"
                            pattern={RegexUtil.phoneNumberRegex}
                            placeholder="(000) 000-0000"
                            defaultValue={this.props.editedEmployee?.phoneNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.INVALID_PHONE_NUMBER}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                        <Form.Label>Département</Form.Label>
                        <Form.Select required name="department"
                                     value={this.state.department || this.props.editedEmployee?.department}
                                     onChange={this.#handleSelect}>
                            {this.props.departments.map((department: Department, index: number) =>
                                <option key={index} value={department.name}>{department.name}</option>)}
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
                            <IoSettingsSharp className="mb-05"/>
                        </Button>
                        {this.props.jobTitles.map((title: JobTitle) => (<Form.Check
                            key={title.name}
                            type="checkbox"
                            name="jobTitles"
                            label={title.name}
                            value={title.name}
                            defaultChecked={this.props.editedEmployee?.jobTitles.includes(title.name)}
                        />))}
                        <ComponentEditJobTitles cancelEdit={() => this.#onShowEditJobTitles(false)}
                                                showEdit={this.state.showEditJobTitles} jobTitles={this.props.jobTitles}
                                                onAddJobTitle={this.props.onAddJobTitle}
                                                onEditJobTitle={this.props.onEditJobTitle}
                                                onDeleteJobTitle={this.props.onDeleteJobTitle}/>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Compétences</Form.Label>
                        <Button onClick={() => this.#onShowEditSkills()} className="float-end">
                            <IoSettingsSharp className="mb-05"/>
                        </Button>
                        {this.props.skills.map((skill: Skill) => (<div key={skill.name}><Form.Check
                            type="checkbox"
                            name="skills"
                            label={skill.name}
                            value={skill.name}
                            defaultChecked={this.props.editedEmployee?.skills.includes(skill.name)}
                        />
                        </div>))}
                        <ComponentEditSkills cancelEdit={() => this.#onShowEditSkills(false)}
                                             showEdit={this.state.showEditSkills} skills={this.props.skills}
                                             onAddSkill={this.props.onAddSkill} onEditSkill={this.props.onEditSkill}
                                             onDeleteSkill={this.props.onDeleteSkill}/>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Rôle de l'employé</Form.Label>
                        <Form.Select required name="role" id="role"
                                     value={this.state.role || this.props.editedEmployee?.role}
                                     onChange={this.#handleSelect}>
                            {this.props.roles.map((role: string, index: number) => {
                                    if (API.hasLowerPermission(index)) {
                                        return <option key={index} value={index}>{role}</option>;
                                    }
                                }
                            )}
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
                        variant="secondary">
                        Retour
                    </Button>
                    <Button className="mb-3 btn-lg" variant="primary" type="submit">
                        Confirmer
                    </Button>
                </div>
            </Form>
        </Container>;
    }

    readonly #onShowEditJobTitles = (value: boolean = true): void => {
        this.setState({showEditJobTitles: value});
    };

    readonly #onShowEditSkills = (value: boolean = true): void => {
        this.setState({showEditSkills: value});
    };

    /**
     * Handle the form submission. Validate the form and attempt to edit the employee.
     * @param event The form submission event. Contains the form data to be validated.
     * @private
     * @returns {Promise<void>}
     * @memberof EditEmployee
     */
    readonly #handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        let errorType = FormUtils.validateForm(event);

        let eventTarget: any = event.target;
        let formData = new FormData(eventTarget);
        let formDataObj: any = {};
        formDataObj = {
            ...Object.fromEntries(formData.entries())
        };

        // Iterate over all checked checkbox elements and create an array that contains each of them
        document.querySelectorAll("input[type=\"checkbox\"]:checked").forEach((checkbox: any) => {
            let fieldName = checkbox.name;
            if (fieldName) {
                if (typeof (formDataObj[fieldName]) === "string") {
                    formDataObj[fieldName] = [];
                }
                formDataObj[fieldName].push(checkbox.value);
            }
        });
        this.setState({
            validated: true,
            error: errorType
        });
        if (errorType === FormErrorType.NO_ERROR && this.props.employeeId) {
            let employee: EmployeeEditDTO = {
                firstName: formDataObj.firstName,
                lastName: formDataObj.lastName,
                phoneNumber: formDataObj.phoneNumber,
                department: formDataObj.department,
                jobTitles: formDataObj.jobTitles ?? [],
                skills: formDataObj.skills ?? [],
                role: parseInt(formDataObj.role)
            };
            this.props.onEditEmployee(this.props.employeeId, employee);
        }
    };

    /**
     * Handle the change of a form element. Update the state with the new value.
     * @param event The change event. Contains the new value of the form element.
     * @returns {void}
     * @memberof EditEmployee
     * @private
     */
    readonly #handleChange = (event: React.ChangeEvent<HTMLFormElement>): void => {
        const target = event.target;
        let name: string = target.name;

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
            ...this.state, ...{
                [name]: value,
            }
        });
    };

    readonly #handleSelect = (event: ChangeEvent<HTMLSelectElement>): void => {
        const target = event.target;
        this.setState({
            ...this.state, ...{
                [target.name]: target.value
            }
        });
    };
}
