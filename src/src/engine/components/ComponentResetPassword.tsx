import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {errors, FormErrorType, success} from "../messages/FormMessages";

import {NotificationManager} from 'react-notifications';

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";
import {API} from "../api/APIManager";

/***
 * Ce composant affiche le formulaire pour changer le mot de passe
 *
 * state : ancien mot de passe, nouveau mot de passe, validation requis et regex de mot de passe
 */
export class ComponentResetPassword extends React.Component {
    private errorMessage = "";
    public state: { email: string; validated: boolean, error: FormErrorType };

    constructor(props) {
        super(props);
        this.state = {email: "", validated: false, error: FormErrorType.NO_ERROR};

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
                    <h4 className="text-center mt-4 mb-4">Réinitialisation de mot de passe</h4>
                </div>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}
                      onChange={this.handleChange}
                      data-error={this.state.error}>
                    <Form.Group>
                        <Form.Label htmlFor="email" className="mt-2">Adresse courriel</Form.Label>
                        <Form.Control
                            required
                            id="email"
                            name="email"
                            className="row mt-1"
                            type="email"
                            pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
                            placeholder="Entrez votre adresse courriel"
                        />
                        <Form.Control.Feedback type="invalid" id="invalidEmail">
                            {errors.errorInvalidEmail}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid" id="validEmail">
                            {success.emailSent}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Text
                        className="text-muted"
                        id="resetPasswordErrorMsg"
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

    private async handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        let errorType = FormErrorType.NO_ERROR;

        if (!isValid) {
            errorType = FormErrorType.INVALID_FORM;
        }

        event.preventDefault();
        event.stopPropagation();

        this.setState({
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR) {
            let success = await API.resetPassword(this.state.email);

            if(success) {
                NotificationManager.info('Réinitialisation du mots de passe', 'Un courriel a bien été envoyé à votre adresse courriel.');
            } else {
                NotificationManager.error('Erreur', 'Une erreur est survenue lors de la réinitialisation de votre mot de passe.');
            }
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