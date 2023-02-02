import React from "react";
import { Container } from "react-bootstrap";
import { ComponentHomePage } from "../components/ComponentHomePage";
import { Logger } from "../Logger";

export class Index extends React.Component {
  public componentDidMount() {
    document.title = "Accueil - TaskMaster";
  }

  public render(): JSX.Element {
    return (
        <div>
          <ComponentHomePage></ComponentHomePage>
        </div>
    );
  }
}
