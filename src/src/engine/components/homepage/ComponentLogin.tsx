import React from "react";
import { Logger } from "../../Logger";
import '../../../deps/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';


export class ComponentLogin extends React.Component {
    private logger: Logger = new Logger(`MyFunComponent`, `#20f6a4`, false);

    public render(): JSX.Element {
        this.logger.log(`Rendering my fun component...`);

        return (
            <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Numéro d'employé</Form.Label>
              <Form.Control type="text" placeholder="Entrez le numéro d'employé" />
              <Form.Text className="text-muted">
                C'est le numéro que votre employeur vous a donné.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Mot de passe </Form.Label>
              <Form.Control type="text" placeholder="Entrez votre mot de passe" />
              <Form.Text className="text-muted">
                Il doit avoir au moins 32 caractères.
              </Form.Text>
            </Form.Group>
            </Form>
        );

    }


}