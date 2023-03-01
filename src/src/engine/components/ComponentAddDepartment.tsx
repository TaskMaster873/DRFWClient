import React, {ChangeEvent} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {errors, FormErrorType} from "../messages/FormMessages";
import {Department} from "../types/Department";
import {Employee} from "../types/Employee";
import FormUtils from "../utils/FormUtils";

interface AddDepartmentState {
    name: string;
    director: string;
    validated?: boolean;
    error: FormErrorType;
}

interface AddDepartmentProps {
    employees: Employee[];
    onAddDepartment: (department) => PromiseLike<void> | Promise<void> | void;
}

/**
 * This is the form to add a department
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory Department
 * @hideconstructor
 */
export class ComponentAddDepartment extends React.Component<AddDepartmentProps, AddDepartmentState> {
    public state: AddDepartmentState = {
        name: "",
        director: "",
        validated: false,
        error: FormErrorType.NO_ERROR
    };

    public props: AddDepartmentProps;

    constructor(props: AddDepartmentProps) {
        super(props);

        this.props = props;
    }

    public componentDidUpdate(prevProps: AddDepartmentProps): void {
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
                onSubmit={this.#handleSubmit}
                onChange={this.#handleChange}
                data-error={this.state.error}
            >
                <Row className="mb-3">
                    <h5 className="mt-4 mb-3">Ajouter un département</h5>
                    <Form.Group as={Col} md="3">
                        <Form.Label className="mt-2">Nom</Form.Label>
                        <Form.Control
                            name="name"
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
                        <Form.Select required name="director" value={this.state.director} onChange={this.#handleSelect}>
                            {this.props.employees.map((employee: Employee, index: number) => (
                                <option key={`${index}`}
                                        value={`${employee.firstName} ${employee.lastName}`}>{`${employee.firstName} ${employee.lastName}`}</option>))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.REQUIRED_DEPARTMENT_DIRECTOR}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button className="mt-3 mb-3" variant="primary" type="submit">
                    Ajouter
                </Button>
            </Form>
        );
    }

    /**
     * Function that is called when the form is submitted.
     * @param event The event that triggered the function
     * @private
     */
    readonly #handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        let errorType = FormUtils.validateForm(event);

        this.setState({
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR) {
            let department = new Department({name: this.state.name, director: this.state.director});
            await this.props.onAddDepartment(department);
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
        const name = target.name;

        if (!name) {
            throw new Error("Name is undefined for element in form.");
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
                [target.name]: target.value
            }
        });
    }
}
