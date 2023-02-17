import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {errors, FormErrorType, info, successes} from "../messages/FormMessages";
import { API } from "../api/APIManager";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";

type Props = {
    actionCode: string,
    email: string
}

/***
 * Ce composant affiche le formulaire pour réinitialiser son mot de passe avec un nouveau
 */
export function ComponentResetPassword(props: Props) {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(FormErrorType.NO_ERROR);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    let isValid = form.checkValidity();
    let errorType = FormErrorType.NO_ERROR;

    if (!isValid) {
      errorType = FormErrorType.INVALID_FORM;
    }

    event.preventDefault();
    event.stopPropagation();

    setValidated(true);
    setError(errorType);

    if (errorType === FormErrorType.NO_ERROR) {
      let error = await API.applyResetPassword(props.actionCode, newPassword);

      if (!error) {
        NotificationManager.info(successes.resetPassword, successes.successGenericMessage);
      } else {
        NotificationManager.error(
          error,
          errors.errorGenericMessage
        );
      }
      navigate("/login")
    }
  };
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
        <h4 id="email" className="text-center mt-4 mb-4">
          Réinitialisation de mot de passe pour {props.email}
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
            {errors.invalidNewPassword}
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
  );
}
