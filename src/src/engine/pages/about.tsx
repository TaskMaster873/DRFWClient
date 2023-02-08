import React from "react";
import {ComponentAbout} from "../components/ComponentAbout";

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
