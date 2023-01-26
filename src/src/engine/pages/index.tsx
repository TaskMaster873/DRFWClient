import React from "react";
import { Container } from "react-bootstrap";
import { Logger } from "../Logger";
import {NavigationBar} from "../components/NavigationBar";

export class Index extends React.Component {
  private logger: Logger = new Logger(`Index`, `#20f6a4`, false);

  public componentDidMount() {
    document.title = "Acceuil - Task Manager";
  }

  public render(): JSX.Element {
    return (
        <div>
          <Container>Page d'accueil</Container>
        </div>
    );
  }
}
