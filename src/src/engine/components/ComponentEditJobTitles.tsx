import React, {ChangeEvent} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {errors, FormErrorType} from "../messages/FormMessages";
import {Modal} from "react-bootstrap";

interface EditJobTitlesState {
    name: string;
    validated?: boolean;
    error: FormErrorType;
}

interface EditJobTitlesProps {
    cancelEdit: () => void;
    jobTitles: string[];
    onAddJobTitle: (title: string) => PromiseLike<void> | Promise<void> | void;
    onEditJobTitle: (titleId: string, title: string) => PromiseLike<void> | Promise<void> | void;
    showEdit: boolean;
}

/**
 * This is the form to add a department
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory Department
 * @hideconstructor
 */
export class ComponentEditJobTitles extends React.Component<EditJobTitlesProps, EditJobTitlesState> {
    public state: EditJobTitlesState = {
        name: "",
        validated: false,
        error: FormErrorType.NO_ERROR
    };

    public props: EditJobTitlesProps;

    constructor(props: EditJobTitlesProps) {
        super(props);

        this.props = props;
    }

    public render(): JSX.Element {
        return <Modal show={this.props.showEdit} onHide={() => this.hideModal()} onExit={() => this.hideModal()}>
            <Form
                noValidate
                validated={this.state.validated}
                onSubmit={this.#handleSubmit}
                onChange={this.#handleChange}
                data-error={this.state.error}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Édition de corps d'emploi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-3">
                        {this.props.jobTitles.map((corps: string) => (<Form.Control
                            key={corps}
                            type="text"
                            name={corps}
                            className="jobTitles"
                        />))}
                        <Form.Group as={Col} md="6">
                            <Form.Label className="mt-2">Nom</Form.Label>
                            <Form.Control
                                name="name"
                                required
                                type="text"
                                placeholder="Nom"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.REQUIRED_JOB_TITLE_NAME}
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

    private hideModal() {
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

        let errorType = FormErrorType.NO_ERROR;
        if (!isValid) {
            errorType = FormErrorType.INVALID_FORM;
        }

        this.setState({
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR) {
            await this.props.onAddJobTitle(this.state.name);
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
            throw new Error("Id is undefined for element in form.");
        }

        this.setState({
            ...{}, ...{
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
