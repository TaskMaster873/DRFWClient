import React from "react";
import { Logger } from "../Logger";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// @ts-ignore
import Logo from "../../deps/images/logo.png";

export class ComponentLogin extends React.Component {
  private logger: Logger = new Logger(`MyFunComponent`, `#20f6a4`, false);
  private errorMessage = "";

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
        <Form>
          <Form.Label className="mt-2">Numéro d'employé</Form.Label>
          <Form.Control
            className="row mt-1"
            type="text"
            placeholder="Entrez le numéro d'employé"
          />

          <Form.Label className="mt-4">Mot de passe </Form.Label>
          <Form.Control
            className="row mt-1"
            type="password"
            placeholder="Entrez votre mot de passe"
          />
          <Form.Text className="text-muted">{this.errorMessage}</Form.Text>
          <div className="me-4">
            <Button
              className="mt-4 d-block text-center mx-auto"
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
}
