import React from "react";
import { Container } from "react-bootstrap";
import { ComponentChangePassword } from "../components/ComponentChangePassword";
import { Logger } from "../Logger";

/**
 * C'est la page pour changer le mot de passe
 */
export class ChangePassword extends React.Component {

  public componentDidMount() {
    document.title = "Connexion - TaskMaster";
  }
  /**
   * 
   * @returns Le composant pour faire le changement de mot de passe
   */
  public render(): JSX.Element {
    return (
      <Container>
        <ComponentChangePassword />
      </Container>
    );
  }
}
