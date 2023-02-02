import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { constants } from "../../../Constants/Constants";
import { FormErrorType } from "../errors/FormErrorType";
import { Config } from "../config/Config";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";

export class ComponentLogin extends React.Component {
  private errorMessage = "";
  public state: {
    id: string;
    password: string;
    validated: boolean;
    error: FormErrorType;
  };

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      validated: false,
      error: FormErrorType.NO_ERROR,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
          <h4 className="text-center mt-4 mb-4">Se connecter à Task Master</h4>
        </div>
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
          data-error={this.state.error}
        >
          <Form.Group>
            <Form.Label className="mt-2">Numéro d'employé</Form.Label>
            <Form.Control
              required
              id="noLogin"
              name="id"
              className="row mt-1"
              type="number"
              placeholder="Entrez le numéro d'employé"
            />
            <Form.Control.Feedback type="invalid" id="invalidLoginNoEmployee">
              {constants.errorRequiredEmployeeNo}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-4">Mot de passe </Form.Label>
            <Form.Control
              required
              id="passwordLogin"
              name="password"
              className="row mt-1"
              type="password"
              placeholder="Entrez votre mot de passe"
            />
            <Form.Control.Feedback type="invalid" id="invalidLoginPassword">
              {constants.errorRequiredPassword}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Text
            className="text-muted"
            id="loginErrorMsg"
            aria-errormessage={this.errorMessage}
          ></Form.Text>
          <div className="me-4 mt-4 d-block text-center mx-auto">
            <Link className="d-block" to="/changePassword">
              Mot de passe oublié ?
            </Link>
            <Button
              data-testid="submitLogin"
              className="mt-4"
              variant="primary"
              size="lg"
              type="submit"
              value="Submit"
            >
              Connexion
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
      Config.loginWithPassword(this.state.id, this.state.password);
    }
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
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
