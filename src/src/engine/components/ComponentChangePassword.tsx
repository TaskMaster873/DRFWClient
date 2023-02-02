import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";

/***
 * La classe sert pour changer le mot de passe
 * 
 * state : no de l'employé , son mot de passe, si c'est valide
 */
export class ComponentChangePassword extends React.Component {
  private errorMessage = "";
  public state: { no: any; password?: string; validated?: boolean };

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = { no: "", password: "", validated: false };

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
        <Form onSubmit={this.handleSubmit}>
          <Form.Label className="mt-2">Ancien mot de passe</Form.Label>
          <Form.Control
            id="oldPassword"
            className="row mt-1"
            type="number"
            placeholder="Entrez l'ancien mot de passe"
            value={this.state.no}
          />

          <Form.Label className="mt-4">Nouveau mot de passe </Form.Label>
          <Form.Control
            id="newPassword"
            className="row mt-1"
            type="password"
            placeholder="Entrez le nouveau mot de passe"
          />
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

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
  }
}
