import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {errors, FormErrorType} from "../messages/FormMessages";
import {CloseButton, Modal} from "react-bootstrap";
import {BiCheck, BiPencil, BiPlus, BiTrash} from "react-icons/bi";
import {Skill} from "../types/Skill";
import {CgUnavailable} from "react-icons/cg";
import FormUtils from "../utils/FormUtils";
import {ComponentConfirmDeleteSkill} from "./ComponentConfirmDeleteSkill";
import {SkillActions} from "../types/Employee";
import { IconContext } from "react-icons/lib";

interface EditSkillsState {
    skillToDelete?: Skill;
    editedSkill?: Skill;
    name: string;
    addValidated?: boolean;
    editValidated?: boolean;
    addError: FormErrorType;
    editError: FormErrorType;
}

interface EditSkillsProps extends SkillActions {
    cancelEdit: () => void;
    skills: Skill[];
    showEdit: boolean;
}

/**
 * This is the modal form to edit a Skill
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory JobTitle
 * @hideconstructor
 */
export class ComponentEditSkills extends React.Component<EditSkillsProps, EditSkillsState> {
    public state: EditSkillsState = {
        addError: FormErrorType.NO_ERROR,
        editError: FormErrorType.NO_ERROR,
        name: "",
        addValidated: false,
        editValidated: false
    };

    public props: EditSkillsProps;

    constructor(props: EditSkillsProps) {
        super(props);

        this.props = props;
    }

    public render(): JSX.Element {
        return <div><ComponentConfirmDeleteSkill closePrompt={this.#onShowConfirmDeleteSkills}
                                                 skill={this.state.skillToDelete}
                                                 onDeleteSkill={this.props.onDeleteSkill}/>
            <Modal variant='dark' show={this.props.showEdit} onHide={this.hideModal}>
                <Modal.Header>
                    <Modal.Title>Édition de compétence</Modal.Title>
                    <CloseButton variant="white" onClick={() => this.hideModal()} />
                </Modal.Header>
                <Modal.Body>
                    <Form
                        noValidate
                        validated={this.state.editValidated}
                        onSubmit={this.#handleEditSubmit}
                        onChange={this.#handleChange}
                        data-error={this.state.editError}>
                        <Form.Label className="mt-2">Compétences</Form.Label>
                        {this.props.skills.map((skill: Skill) => (
                            <Row key={`row ${skill.name}`} className="mb-3">
                                <Form.Group key={`group ${skill.name}`} as={Col} md="10">
                                    <Form.Control
                                        key={skill.name}
                                        type="text"
                                        name="name"
                                        defaultValue={skill.name}
                                        disabled={this.state.editedSkill != skill}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.REQUIRED_JOB_TITLE_NAME}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mt-1" as={Col} md="2">
                                    {this.renderActions(skill)}
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
                            <Form.Label className="mt-2">Nouvelle compétence</Form.Label>
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
                                <Button type="submit">
                                    <IconContext.Provider value={{ color: 'white' }}>
                                        <BiPlus className="adminActions mb-1"/>
                                    </IconContext.Provider>
                                </Button>
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
    readonly #onShowConfirmDeleteSkills = (value?: Skill): void => {
        this.setState({skillToDelete: value});
    };

    /**
     * Render edit and delete actions
     * @param skill The Skill
     * @private
     */
    private renderActions(skill: Skill): JSX.Element {
        if (this.state.editedSkill == skill) {
            return <div>
                <button className="transparentButton me-2" type="submit">
                    <IconContext.Provider value={{ color: 'white' }}>
                        <BiCheck className="adminActions"/>
                    </IconContext.Provider>
                </button>
                <IconContext.Provider value={{ color: 'white' }}>
                    <CgUnavailable onClick={() => this.editSkill()} className="adminActions ms-1"/>
                </IconContext.Provider>
            </div>;
        } else {
            return <div>
                <IconContext.Provider value={{ color: 'white' }}>
                    <BiPencil onClick={() => this.editSkill(skill)} className="adminActions me-2"/>
                    <BiTrash onClick={() => this.showDeletePrompt(skill)} className="adminActions ms-2"/>
                </IconContext.Provider>
            </div>;
        }
    }

    /**
     * Change the current edited skill
     * @param skill The skill to edit
     * @private
     */
    private editSkill(skill?: Skill) {
        this.setState({editedSkill: skill});
    }

    /**
     * Shows the deletion confirmation modal
     * @param skill
     * @private
     */
    private showDeletePrompt(skill: Skill) {
        this.setState({skillToDelete: skill});
    }

    /**
     * Function that is called when the add form is submitted.
     * @param event The event that triggered the function
     * @private
     */
    readonly #handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        let errorType = FormUtils.validateForm(event);

        let eventTarget: any = event.target;
        let formData = new FormData(eventTarget);
        let formDataObj: Skill = Object.fromEntries(formData.entries()) as unknown as Skill;

        if (errorType === FormErrorType.NO_ERROR) {
            formDataObj.id = this.state.editedSkill?.id;
            if (formDataObj.id) {
                await this.props.onEditSkill(formDataObj);
            }
            this.setState({editedSkill: undefined});
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
            await this.props.onAddSkill(this.state.name);
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
