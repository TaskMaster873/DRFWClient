import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {errors, FormErrorType} from "../messages/FormMessages";
import {CloseButton, Modal} from "react-bootstrap";
import {BiCheck, BiPencil, BiPlus, BiTrash} from "react-icons/bi";
import {JobTitle} from "../types/JobTitle";
import {CgUnavailable} from "react-icons/cg";
import FormUtils from "../utils/FormUtils";
import {ComponentConfirmDeleteJobTitle} from "./ComponentConfirmDeleteJobTitle";
import {JobTitleActions} from "../types/Employee";

interface EditJobTitlesState {
    jobTitleToDelete?: JobTitle;
    editedJobTitle?: JobTitle;
    name: string;
    addValidated?: boolean;
    editValidated?: boolean;
    addError: FormErrorType;
    editError: FormErrorType;
}

interface EditJobTitlesProps extends JobTitleActions {
    cancelEdit: () => void;
    jobTitles: JobTitle[];
    showEdit: boolean;
}

/**
 * This is the modal form to edit a JobTitle
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory JobTitle
 * @hideconstructor
 */
export class ComponentEditJobTitles extends React.Component<EditJobTitlesProps, EditJobTitlesState> {
    public state: EditJobTitlesState = {
        addError: FormErrorType.NO_ERROR,
        editError: FormErrorType.NO_ERROR,
        name: "",
        addValidated: false,
        editValidated: false
    };

    public props: EditJobTitlesProps;

    constructor(props: EditJobTitlesProps) {
        super(props);

        this.props = props;
    }

    public render(): JSX.Element {
        return <div><ComponentConfirmDeleteJobTitle closePrompt={this.#onShowConfirmDeleteJobTitle}
                                                    jobTitle={this.state.jobTitleToDelete}
                                                    onDeleteJobTitle={this.props.onDeleteJobTitle}/>
            <Modal show={this.props.showEdit} onHide={() => this.hideModal()}>
                <Modal.Header>
                    <Modal.Title>Édition de corps d'emploi</Modal.Title>
                    <CloseButton variant="white" onClick={() => this.hideModal()} />
                </Modal.Header>
                <Modal.Body>
                    <Form
                        noValidate
                        validated={this.state.editValidated}
                        onSubmit={this.#handleEditSubmit}
                        onChange={this.#handleChange}
                        data-error={this.state.editError}>
                        <Form.Label className="mt-2">Corps d'emplois</Form.Label>
                        {this.props.jobTitles.map((title: JobTitle) => (
                            <Row key={`row ${title.name}`} className="mb-3">
                                <Form.Group key={`group ${title.name}`} as={Col} md="10">
                                    <Form.Control
                                        key={title.name}
                                        type="text"
                                        name="name"
                                        defaultValue={title.name}
                                        disabled={this.state.editedJobTitle != title}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.REQUIRED_JOB_TITLE_NAME}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mt-1" as={Col} md="2">
                                    {this.renderActions(title)}
                                </Form.Group>
                            </Row>
                        ))}
                    </Form>
                    <Form
                        noValidate
                        validated={this.state.addValidated}
                        onSubmit={this.#handleAddSubmit}
                        onChange={this.#handleChange}
                        data-error={this.state.addError}
                    >
                        <Row className="mb-3">
                            <Form.Label className="mt-2">Nouveau corps d'emploi</Form.Label>
                            <Form.Group as={Col} md="10">
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
                            <Form.Group as={Col} md="2">
                                <Button type="submit"><BiPlus className="adminActions mb-1"/></Button>
                            </Form.Group>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>;
    }

    /**
     * The function that hides the modal when the exit button is clicked
     */
    readonly hideModal = (): void => {
        this.props.cancelEdit();
    };

    /**
     * When the delete button is clicked show the deletion confirmation window
     * @param value the Skill to delete
     * @private
     */
    readonly #onShowConfirmDeleteJobTitle = (value?: JobTitle): void => {
        this.setState({jobTitleToDelete: value});
    };

    /**
     * Render edit and delete actions of the jobTitle
     * @param title The JobTitle
     * @private
     */
    private renderActions(title: JobTitle): JSX.Element {
        if (this.state.editedJobTitle == title) {
            return <div>
                <button className="transparentButton me-2" type="submit">
                    <BiCheck className="adminActions"/>
                </button>
                <CgUnavailable onClick={() => this.#editJobTitle} className="adminActions ms-1"/></div>;
        } else {
            return <div>
                <BiPencil onClick={() => this.#editJobTitle(title)} className="adminActions me-2"/>
                <BiTrash onClick={() => this.#showDeletePrompt(title)} className="adminActions ms-2"/>
            </div>;
        }
    }

    /**
     * Change the current edited JobTitle
     * @param title The JobTitle to edit
     * @private
     */
    readonly #editJobTitle = (title?: JobTitle): void => {
        this.setState({editedJobTitle: title});
    };

    /**
     * Shows the deletion confirmation modal
     * @param title The JobTitle
     * @private
     */
    readonly #showDeletePrompt = (title: JobTitle): void => {
        this.setState({jobTitleToDelete: title});
    };

    /**
     * Function that is called when the add form is submitted.
     * @param event The event that triggered the function
     * @private
     */
    readonly #handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        let errorType = FormUtils.validateForm(event);

        let eventTarget: any = event.target;
        let formData = new FormData(eventTarget);
        let formDataObj: JobTitle = Object.fromEntries(formData.entries()) as unknown as JobTitle;

        if (errorType === FormErrorType.NO_ERROR) {
            formDataObj.id = this.state.editedJobTitle?.id;
            if (formDataObj.id) {
                await this.props.onEditJobTitle(formDataObj);
            }
            this.setState({editedJobTitle: undefined});
        }
    };

    /**
     * Function that is called when the add form is submitted.
     * @param event The event that triggered the function
     * @private
     */
    readonly #handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        let errorType = FormUtils.validateForm(event);

        this.setState({
            addValidated: true,
            addError: errorType,
        });
        if (errorType === FormErrorType.NO_ERROR) {
            await this.props.onAddJobTitle(this.state.name);
        }
    };

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
            ...this.state, ...{
                [name]: value,
            }
        });
    };
}
