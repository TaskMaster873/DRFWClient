import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {errors, FormErrorType, successes} from "../messages/FormMessages";
import {API} from "../api/APIManager";

import {useNavigate} from "react-router-dom";
import {RoutesPath} from "../RoutesPath";
import {Container} from "react-bootstrap";
import Logo from "../../deps/images/logo.png";
import {NotificationManager} from "../api/NotificationManager";
import FormUtils from "../utils/FormUtils";
import {ParticlesOpts} from "../types/Particles";
import Particles from "react-particles";
import {Engine} from "tsparticles-engine";
import {loadFull} from "tsparticles";

type Props = {
    actionCode: string,
    email: string;
};

/***
 * Ce composant affiche le formulaire pour rĂ©initialiser son mot de passe avec un nouveau
 */
export function ComponentResetPassword(props: Props) {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(FormErrorType.NO_ERROR);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        let errorType = FormUtils.validateForm(event);

        setValidated(true);
        setError(errorType);

        if (errorType === FormErrorType.NO_ERROR) {
            let error = await API.applyResetPassword(props.actionCode, newPassword);

            if (!error) {
                NotificationManager.info(successes.RESET_PASSWORD, successes.SUCCESS_GENERIC_MESSAGE);
            } else {
                NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
            }
            navigate(RoutesPath.LOGIN);
        }
    };

    const customInit = async (engine: Engine) => {
        await loadFull(engine);
    };

    return (
        <Container>
            <Particles options={ParticlesOpts} init={customInit}/>
            <div className="auth-form">
                <div className="me-4">
                    <img
                        className="mx-auto d-block mt-5"
                        src={Logo}
                        alt="Logo TaskMaster"
                        width={50}
                        height={60}
                    />
                    <h4 id="email" className="text-center mt-4 mb-4">
                        RĂ©initialisation de mot de passe pour {props.email}
                    </h4>
                </div>
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    data-error={error}
                >
                    <Form.Group>
                        <Form.Label htmlFor="password" className="mt-2">
                            Nouveau mot de passe
                        </Form.Label>
                        <Form.Control
                            required
                            id="newPassword"
                            name="newPassword"
                            className="row mt-1"
                            type="password"
                            pattern='^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$'
                            placeholder="Entrez votre nouveau mot de passe"
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                            }}
                        />
                        <Form.Control.Feedback type="invalid" id="invalidPassword">
                            {errors.INVALID_NEW_PASSWORD}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="mt-4 me-4 d-block text-center mx-auto">
                        <Button
                            id="submitResetPassword"
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
        </Container>
    );
}
