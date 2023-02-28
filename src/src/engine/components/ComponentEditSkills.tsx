import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {errors, FormErrorType} from "../messages/FormMessages";
import {Modal} from "react-bootstrap";
import {BiCheck, BiPencil, BiPlus, BiTrash} from "react-icons/bi";
import {Skill} from "../types/Skill";
import {CgUnavailable} from "react-icons/cg";
import {FormUtils} from "../utils/FormUtils";
import {ComponentConfirmDeleteSkill} from "./ComponentConfirmDeleteSkill";

interface EditSkillsState {
    skillToDelete?: Skill;
    editedSkill?: Skill;
    name: string;
    addValidated?: boolean;
    editValidated?: boolean;
    addError: FormErrorType;
    editError: FormErrorType;
}

interface EditSkillsProps {
    cancelEdit: () => void;
    skills: Skill[];
    onAddSkill: (skill: string) => PromiseLike<void> | Promise<void> | void;
    onEditSkill: (skill: Skill) => PromiseLike<void> | Promise<void> | void;
    onDeleteSkill: (skill: Skill) => PromiseLike<void> | Promise<void> | void;
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
        return <div><ComponentConfirmDeleteSkill closePrompt={() => this.#onShowConfirmDeleteSkills(undefined)}
                                                    skill={this.state.skillToDelete} onDeleteSkill={this.props.onDeleteSkill}/>
            <Modal show={this.props.showEdit} onHide={() => this.hideModal()} onExit={() => this.hideModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Édition de corps d'emploi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        noValidate
                        validated={this.state.editValidated}
                        onSubmit={this.#handleEditSubmit}
                        onChange={this.#handleChange}
                        data-error={this.state.editError}>
                        <Form.Label className="mt-2">Corps d'emplois</Form.Label>
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
                </Modal.Footer>
            </Modal>
        </div>
    }

    private hideModal() {
        this.props.cancelEdit();
    }

    readonly #onShowConfirmDeleteSkills = (value: Skill | undefined): void => {
        this.setState({skillToDelete: value})
    }


    private renderActions(skill: Skill): JSX.Element {
        if (this.state.editedSkill == skill) {
            return <div><button className="transparentButton me-2" type="submit"><BiCheck className="adminActions"/></button> <CgUnavailable onClick={() => this.editSkill(undefined)} className="adminActions ms-1"/></div>
        } else {
            return <div>
                <BiPencil onClick={() => this.editSkill(skill)} className="adminActions me-2"/>
                <BiTrash onClick={() => this.showDeletePrompt(skill)} className="adminActions ms-2"/>
            </div>
        }
    }

    private editSkill(skill: Skill | undefined) {
        this.setState({editedSkill: skill})
    }

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
            if(formDataObj.id) {
                await this.props.onEditSkill(formDataObj);
            }
            this.setState({editedSkill: undefined});
        }
    }

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
