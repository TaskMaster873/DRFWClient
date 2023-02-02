import React from "react";
import { Container } from "react-bootstrap";
import { ComponentLogin } from "../components/ComponentLogin";
import { Logger } from "../Logger";

/***
 * 
 * Page de connexion 
 * 
 */
export class Login extends React.Component {

  public componentDidMount() {
    document.title = "Connexion - TaskMaster";
  }

  public render(): JSX.Element {
    return (
      <Container>
        <ComponentLogin />
      </Container>
    );
  }
}
