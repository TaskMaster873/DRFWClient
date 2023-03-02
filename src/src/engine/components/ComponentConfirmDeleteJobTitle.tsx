import React from "react";
import {Modal} from "react-bootstrap";
import {JobTitle} from "../types/JobTitle";
import Button from "react-bootstrap/Button";

interface DeleteJobTitleProps {
    closePrompt: () => void;
    jobTitle?: JobTitle | undefined;
    onDeleteJobTitle: (titleId: string) => PromiseLike<void> | Promise<void> | void;
}

export class ComponentConfirmDeleteJobTitle extends React.Component<DeleteJobTitleProps, unknown> {
    public render(): JSX.Element {
        return (<Modal show={this.props.jobTitle != undefined} onHide={this.#hideModal} onExit={() => this.#hideModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Voulez-vous vraiment supprimer le corps d'emploi {this.props.jobTitle?.name} ?</p>
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
        if(confirm && this.props.jobTitle?.id) {
            this.props.onDeleteJobTitle(this.props.jobTitle.id);
        }
        this.props.closePrompt();
    }
}
