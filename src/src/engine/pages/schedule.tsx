import React from "react";
import { Container } from "react-bootstrap";
import { Logger } from "../Logger";

export class Schedule extends React.Component {
  private logger: Logger = new Logger(`Schedule`, `#20f6a4`, false);

  public componentDidMount() {
    document.title = "Horaire - Task Manager";
  }

  public render(): JSX.Element {
    return <Container>Horaire global</Container>;
  }
}
