import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {errors, FormErrorType, successes} from "../messages/FormMessages";
import { API } from "../api/APIManager";
import {NotificationManager} from 'react-notifications';

/* === Images === */
import Logo from "../../deps/images/logo.png";

interface ChangePasswordState {
    oldPassword: string;
    newPassword: string;
    validated: boolean;
    error: FormErrorType;
}

/**
 * This component displays the form to change the password for the current user.
 * @constructor
 * @param props - Not used
 * @return {JSX.Element} - The component
 */
export class ComponentChangePassword extends React.Component<unknown, ChangePasswordState> {
    public state: ChangePasswordState = {
        oldPassword: "",
        newPassword: "",
        validated: false,
        error: FormErrorType.NO_ERROR
    };

    constructor(props) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div className="auth-form">
                <div className="me-4">
                    <img
                        className="mx-auto d-block mt-5"
                        src={Logo as any}
                        alt="Logo TaskMaster"
                        width={50}
                        height={60}
                    />
                    <h4 className="text-center mt-4 mb-4">Changer de mot de passe</h4>
                </div>
                <Form noValidate validated={this.state.validated} onSubmit={this.#handleSubmit}
                      onChange={this.#handleChange}
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
                            {errors.REQUIRED_OLD_PASSWORD}
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
                            {errors.INVALID_NEW_PASSWORD}
                        </Form.Control.Feedback>
                    </Form.Group>
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

    /**
     * This function is called when the user submits the form.
     * @param event - The event that triggered the function
     * @return {Promise<void>}
     * @private
     */
    readonly #handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
            let error = await API.changePassword(this.state.oldPassword, this.state.newPassword); //voici le changement en async
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.CHANGE_PASSWORD);
            } else {
                NotificationManager.error(error, errors.ERROR_FORM);
            }
        }
    }

    /**
     * This function is called when the user changes a field in the form.
     * @param event - The event that triggered the function
     * @private
     */
    readonly #handleChange = async (event: React.ChangeEvent<HTMLFormElement>): Promise<void> => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.id;

        if (!name) {
            throw new Error("Id is undefined for element in form.");
        }

        this.setState({...this.state, ...{
            [name]: value,
        }});
    }
}
