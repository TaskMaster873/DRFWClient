import React from "react";
import {Modal} from "react-bootstrap";
import {Department} from "../types/Department";
import Button from "react-bootstrap/Button";

interface DeleteDepartmentProps {
    closePrompt: () => void;
    department?: Department | undefined;
    onDeleteDepartment: (department: Department) => PromiseLike<void> | Promise<void> | void;
}

/**
 * This is the modal popup to confirm the deletion of the Department
 * @param props The props of the component
 * @constructor
 * @category Components
 * @subcategory Department
 * @hideconstructor
 */
export class ComponentConfirmDeleteDepartment extends React.Component<DeleteDepartmentProps, unknown> {
    public render(): JSX.Element {
        return (<Modal show={this.props.department != undefined} onHide={this.#hideModal} onExit={() => this.#hideModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Voulez-vous vraiment supprimer le département {this.props.department?.name} ?</p>
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
        if(confirm && this.props.department) {
            this.props.onDeleteDepartment(this.props.department);
        }
        this.props.closePrompt();
    }
}
