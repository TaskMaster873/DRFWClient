import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {FormErrorType, constants} from "../messages/FormMessages";
import { SocketManager } from "../networking/WebsocketManager";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";

/***
 * Ce composant affiche le formulaire pour changer le mot de passe
 *
 * state : ancien mot de passe, nouveau mot de passe, validation requis et regex de mot de passe
 */
export class ComponentChangePassword extends React.Component {
    private errorMessage = "";
    public state: { oldPassword: string; newPassword: string; validated: boolean, error: FormErrorType };

    constructor(props) {
        super(props);
        this.state = {oldPassword: "", newPassword: "", validated: false, error: FormErrorType.NO_ERROR};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render(): JSX.Element {
        return (
            <div className="auth-form">
                <div className="me-4">
                    <img
                        className="mx-auto d-block mt-5"
                        src={Logo}
                        alt="Logo TaskMaster"
                        width={50}
                        height={60}
                    />
                    <h4 className="text-center mt-4 mb-4">Changer de mot de passe</h4>
                </div>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}
                      onChange={this.handleChange}
                      data-error={this.state.error}>
                    <Form.Group>
                        <Form.Label htmlFor="newPassword" className="mt-2">Ancien mot de passe</Form.Label>
                        <Form.Control
                            required
                            name="newPassword"
                            id="oldPassword"
                            className="row mt-1"
                            type="password"
                            placeholder="Entrez l'ancien mot de passe"
                        />
                        <Form.Control.Feedback type="invalid" id="invalidOldPassword">
                            {constants.errorRequiredOldPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="newPassword" className="mt-4">Nouveau mot de passe </Form.Label>
                        <Form.Control
                            required
                            name="newPassword"
                            id="newPassword"
                            className="row mt-1"
                            type="password"
                            pattern='^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$'
                            placeholder="Entrez le nouveau mot de passe"
                        />
                        <Form.Control.Feedback type="invalid" id="invalidNewPassword">
                            {constants.errorInvalidNewPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Text
                        className="text-muted"
                        id="loginErrorMsg"
                        aria-errormessage={this.errorMessage}
                    ></Form.Text>
                    <div className="mt-4 me-4 d-block text-center mx-auto">
                        <Button onClick={() => history.back()} className="me-4 mt-4" size="lg" variant="secondary">
                            Retour
                        </Button>
                        <Button
                            id="submitChangePassword"
                            className="mt-4"
                            size="lg"
                            variant="primary"
                            type="submit"
                            value="Submit"
                        >
                            Confirmer
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }

    private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        let errorType = FormErrorType.NO_ERROR;

        if (!isValid) {
            errorType = FormErrorType.INVALID_FORM;
            event.preventDefault();
            event.stopPropagation();
        }

        this.setState({
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR) {
            SocketManager.changePassword(this.state.oldPassword, this.state.newPassword);
        }
    }

    private handleChange(event: React.ChangeEvent<HTMLFormElement>): void {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.id;

        if (!name) {
            throw new Error("Id is undefined for element in form.");
        }

        this.setState({
            [name]: value,
        });
    }
}
