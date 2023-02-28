import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {errors, FormErrorType} from "../messages/FormMessages";
import {Modal} from "react-bootstrap";
import {BiCheck, BiPencil, BiPlus, BiTrash} from "react-icons/bi";
import {JobTitle} from "../types/JobTitle";
import {CgUnavailable} from "react-icons/cg";

interface EditJobTitlesState {
    editedJobTitle?: JobTitle;
    name: string;
    validated?: boolean;
    error: FormErrorType;
}

interface EditJobTitlesProps {
    cancelEdit: () => void;
    jobTitles: JobTitle[];
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
        editedJobTitle: undefined,
        error: FormErrorType.NO_ERROR,
        name: "",
        validated: false
    };

    public props: EditJobTitlesProps;

    constructor(props: EditJobTitlesProps) {
        super(props);

        this.props = props;
    }

    public render(): JSX.Element {
        return <Modal show={this.props.showEdit} onHide={() => this.hideModal()} onExit={() => this.hideModal()}>

            <Modal.Header closeButton>
                <Modal.Title>Édition de corps d'emploi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    noValidate
                    validated={this.state.validated}
                    onSubmit={this.#handleEditSubmit}
                    onChange={this.#handleChange}
                    data-error={this.state.error}>
                    <Form.Label className="mt-2">Corps d'emplois</Form.Label>
                    {this.props.jobTitles.map((title: JobTitle) => (
                        <Row key={`row ${title.name}`} className="mb-3">
                            <Form.Group key={`group ${title.name}`} as={Col} md="10">
                                <Form.Control
                                    key={title.name}
                                    type="text"
                                    name={title.name}
                                    defaultValue={title.name}
                                    disabled={!this.state.editedJobTitle}
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
                    validated={this.state.validated}
                    onSubmit={this.#handleAddSubmit}
                    onChange={this.#handleChange}
                    data-error={this.state.error}
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
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.hideModal()}>
                    Fermer
                </Button>
                <Button variant="primary" type="submit">
                    Sauvegarder
                </Button>
            </Modal.Footer>
        </Modal>
    }

    private hideModal() {
        this.props.cancelEdit();
    }

    private renderActions(title: JobTitle): JSX.Element {
        if (this.state.editedJobTitle) {
            return <div><BiCheck/> <CgUnavailable/></div>
        } else {
            return <div><BiPencil onClick={() => this.editJobTitle(title)} className="adminActions me-2"/><BiTrash
                className="adminActions ms-2"/></div>
        }
    }

    private editJobTitle(title: JobTitle) {
        this.setState({editedJobTitle: title})
    }

    /**
     * Function that is called when the add form is submitted.
     * @param event The event that triggered the function
     * @private
     */
    readonly #handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        let errorType = this.validateForm(event);

        let eventTarget: any = event.target;
        let formData = new FormData(eventTarget);
        let formDataObj: JobTitle = Object.fromEntries(formData.entries()) as unknown as JobTitle;

        if (errorType === FormErrorType.NO_ERROR) {
            if(formDataObj.id) {
                await this.props.onEditJobTitle(formDataObj.id, formDataObj.name);
            }
        }
    }

    /**
     * Function that is called when the add form is submitted.
     * @param event The event that triggered the function
     * @private
     */
    readonly #handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        let errorType = this.validateForm(event);

        if (errorType === FormErrorType.NO_ERROR) {
            await this.props.onAddJobTitle(this.state.name);
        }
    }

    private validateForm(event: React.FormEvent<HTMLFormElement>) {
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
        return errorType;
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
}
