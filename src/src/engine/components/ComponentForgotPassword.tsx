import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {errors, FormErrorType, info} from "../messages/FormMessages";
import {API} from "../api/APIManager";
import Logo from "../../deps/images/logo.png";
import {NotificationManager} from "../api/NotificationManager";
import {FormUtils} from "../utils/FormUtils";
/***
 * Ce composant affiche le formulaire pour réinitialiser son mot de passe avec un courriel
 */
export function ComponentForgotPassword() {
    const [email, setEmail] = useState("");
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(FormErrorType.NO_ERROR);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        let errorType = FormUtils.validateForm(event);

        setValidated(true);
        setError(errorType);

        if (errorType === FormErrorType.NO_ERROR) {
            let errorMessage = await API.sendResetPassword(email);
            //Regarde si l'erreur est null
            if (!errorMessage) {
                NotificationManager.info(info.EMAIL_SENT, info.PASSWORD_RESET);
            } else {
                NotificationManager.error(errorMessage, errors.ERROR_GENERIC_MESSAGE);
            }
        }
    };

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
                <h4 className="text-center mt-4 mb-4">Mot de passe oublié</h4>
            </div>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                data-error={error}
            >
                <Form.Group>
                    <Form.Label htmlFor="email" className="mt-2">
                        Adresse courriel
                    </Form.Label>
                    <Form.Control
                        required
                        id="email"
                        name="email"
                        className="row mt-1"
                        type="email"
                        pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
                        placeholder="Entrez votre adresse courriel"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <Form.Control.Feedback type="invalid" id="invalidEmail">
                        {errors.INVALID_EMAIL}
                    </Form.Control.Feedback>
                </Form.Group>
                <div className="mt-4 me-4 d-block text-center mx-auto">
                    <Button
                        onClick={() => history.back()}
                        className="me-4 mt-4"
                        size="lg"
                        variant="secondary"
                    >
                        Retour
                    </Button>
                    <Button
                        id="submitForgotPassword"
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
