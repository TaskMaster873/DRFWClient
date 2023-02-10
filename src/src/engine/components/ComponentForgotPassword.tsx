import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { errors, FormErrorType, successes } from "../messages/FormMessages";
import { API } from "../api/APIManager";
import { NotificationManager } from "react-notifications";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";

/***
 * Ce composant affiche le formulaire pour réinitialiser son mot de passe avec un courriel
 */
export function ComponentForgotPassword(props) {
  const errorMessage = "";
  const [email, setEmail] = useState("");
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
      let success = await API.sendResetPassword(email);
      if (success) {
        NotificationManager.info(
          "Réinitialisation du mot de passe",
          "Un courriel a été envoyé à votre adresse courriel."
        );
      } else {
        NotificationManager.error(
          "Erreur",
          "Une erreur est survenue lors de la réinitialisation de votre mot de passe."
        );
      }
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
            {errors.invalidEmail}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Text
          className="text-muted"
          id="resetPasswordErrorMsg"
          aria-errormessage={errorMessage}
        ></Form.Text>
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
