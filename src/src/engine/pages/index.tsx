import React from "react";
import { Container } from "react-bootstrap";
import { Logger } from "../Logger";

export class Index extends React.Component {
  private logger: Logger = new Logger(`Index`, `#20f6a4`, false);

  public componentDidMount() {
    document.title = "Accueil - TaskMaster";
  }

  public render(): JSX.Element {
    return (
        <div>
          <Container>Page d'accueil. Test release MAIN4.</Container>
        </div>
    );
  }
}
