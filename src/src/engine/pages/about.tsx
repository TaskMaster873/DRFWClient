import React from "react";
import { Container } from "react-bootstrap";
import { ComponentAbout } from "../components/ComponentAbout";
import { Logger } from "../Logger";

/**
 * Ceci est la page : à propos de nous 
 */
export class About extends React.Component {

  public componentDidMount() {
    document.title = "À propos - TaskMaster";
  }

  public render(): JSX.Element {
    return  <ComponentAbout></ComponentAbout>;
  }
}
