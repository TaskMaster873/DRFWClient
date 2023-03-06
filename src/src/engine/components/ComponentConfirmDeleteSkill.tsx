import React from "react";
import {Modal} from "react-bootstrap";
import {Skill} from "../types/Skill";
import Button from "react-bootstrap/Button";

interface DeleteSkillProps {
    closePrompt: () => void;
    skill?: Skill | undefined;
    onDeleteSkill: (skillId: string) => PromiseLike<void> | Promise<void> | void;
}

/**
 * This is the modal popup to confirm the deletion of the Skill
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory Skill
 * @hideconstructor
 */
export class ComponentConfirmDeleteSkill extends React.Component<DeleteSkillProps, unknown> {
    public render(): JSX.Element {
        return (<Modal show={this.props.skill != undefined} onHide={this.#hideModal} onExit={() => this.#hideModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation de suppression</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Voulez-vous vraiment supprimer le corps d'emploi {this.props.skill?.name} ?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => this.#hideModal(true)}>
                    Oui
                </Button>
                <Button variant="secondary" onClick={() => this.#hideModal()}>
                    Non
                </Button>
            </Modal.Footer>
        </Modal>);
    }

    readonly #hideModal = (confirm: boolean = false) => {
        if (confirm && this.props.skill?.id) {
            this.props.onDeleteSkill(this.props.skill.id);
        }
        this.props.closePrompt();
    }
}
