import React from "react";
import { Container } from "react-bootstrap";
import { ComponentAbout } from "../components/ComponentHomePage";
import { Logger } from "../Logger";

/**
 * Ceci est la page : à propos de nous 
 */
export class About extends React.Component {
  private logger: Logger = new Logger(`Engine`, `#20f6a4`, false);

  public componentDidMount() {
    document.title = "À propos - TaskMaster";
  }

  public render(): JSX.Element {
    return  <ComponentAbout></ComponentAbout>;
  }
}
