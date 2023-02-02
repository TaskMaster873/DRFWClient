import React from "react";
import { ComponentLogin } from "../components/ComponentLogin";

/***
 * Page de connexion 
 */
export class Login extends React.Component {

  public componentDidMount() {
    document.title = "Connexion - TaskMaster";
  }

  public render(): JSX.Element {
    return <ComponentLogin />;
  }
}
