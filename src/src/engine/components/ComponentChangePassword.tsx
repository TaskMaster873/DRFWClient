import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";
import {FormErrorType} from "../errors/FormErrorType";
import {Config} from "../config/Config";
import {constants} from "../../../Constants/Constants";

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
                <Form noValidate onSubmit={this.handleSubmit} onChange={this.handleChange} data-error={this.state.error}>
                    <Form.Label id="oldPassword" className="mt-2">Ancien mot de passe</Form.Label>
                    <Form.Control
                        required
                        id="oldPassword"
                        className="row mt-1"
                        type="password"
                        pattern='^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$'
                        placeholder="Entrez l'ancien mot de passe"
                        value={this.state.oldPassword}
                    />
                    <Form.Control.Feedback type="invalid" id="invalidOldPassword">
                        {constants.errorRequiredEmployeeNo}
                    </Form.Control.Feedback>

                    <Form.Label id="newPassword" className="mt-4">Nouveau mot de passe </Form.Label>
                    <Form.Control
                        required
                        id="newPassword"
                        className="row mt-1"
                        type="password"
                        pattern='^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$'
                        placeholder="Entrez le nouveau mot de passe"
                        value={this.state.newPassword}
                    />
                    <Form.Control.Feedback type="invalid" id="invalidNewPassword">
                        {constants.errorRequiredEmployeeNo}
                    </Form.Control.Feedback>
                    <Form.Text
                        className="text-muted"
                        id="loginErrorMsg"
                        aria-errormessage={this.errorMessage}
                    ></Form.Text>
                    <div className="me-4">
                        <Button
                            id="submitLogin"
                            className="mt-4 d-block text-center mx-auto"
                            variant="primary"
                            size="lg"
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
        }

        event.preventDefault();
        event.stopPropagation();

        this.setState({
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR) {
            //Runs in WEBSOCKETMANAGER.ts
            Config.changePassword(this.state.oldPassword, this.state.newPassword);
        }
    }

    private handleChange(event: React.ChangeEvent<HTMLFormElement>): void  {
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
