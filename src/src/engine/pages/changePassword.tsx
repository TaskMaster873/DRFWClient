import React from "react";
import { Container } from "react-bootstrap";
import { ComponentChangePassword } from "../components/ComponentChangePassword";
import { Logger } from "../Logger";

/**
 * C'est la page pour changer le mot de passe
 */
export class ChangePassword extends React.Component {
  private logger: Logger = new Logger(`Login`, `#20f6a4`, false);

  public componentDidMount() {
    document.title = "Connexion - Task Manager";
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
