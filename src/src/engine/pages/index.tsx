import React from "react";
import {ComponentHomePage} from "../components/ComponentHomePage";

export class Index extends React.Component {
  public componentDidMount() {
    document.title = "Accueil - TaskMaster";
  }

  public render(): JSX.Element {
    return (
          <ComponentHomePage></ComponentHomePage>
    );
  }
}
