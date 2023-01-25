import React from "react";
import { Logger } from "../Logger";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export class ComponentLogin extends React.Component {
  private logger: Logger = new Logger(`MyFunComponent`, `#20f6a4`, false);
  private errorMessage = "";

  public render(): JSX.Element {
    this.logger.log(`Rendering my fun component...`);

    return (
      <div className="container">
        <Form>
          <Form.Group
            className="d-flex flex-column form-outline w-25 "
            controlId="formBasicEmail"
          >
            <Form.Label>Numéro d'employé</Form.Label>
            <Form.Control
              className="row"
              type="text"
              placeholder="Entrez le numéro d'employé"
            />
            <Form.Text className="text-muted">
              C'est le numéro que votre employeur vous a donné.
            </Form.Text>
          </Form.Group>
          <Form.Group
            className="flex-column form-outline w-25"
            controlId="formBasic"
          >
            <Form.Label>Mot de passe </Form.Label>
            <Form.Control
              className="row"
              type="password"
              placeholder="Entrez votre mot de passe"
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Form.Group className="flex-column" controlId="formBasicEmai">
            <Button variant="dark" size="lg" type="submit" value="Submit">
              Connexion
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
