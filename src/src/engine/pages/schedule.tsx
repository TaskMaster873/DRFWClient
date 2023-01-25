import React from "react";
import { Container } from "react-bootstrap";
import { ComponentSchedule } from "../components/ComponentSchedule";
import { Logger } from "../Logger";
import { EmployeeList } from "../types/EmployeeList";

export class Schedule extends React.Component {
  private logger: Logger = new Logger(`Schedule`, `#20f6a4`, false);
  private list: string[] = ["George", "Magalie"];
  public componentDidMount() {
    document.title = "Horaire - Task Manager";
  }

  public render(): JSX.Element {
    let listData: EmployeeList = { list: this.list };
    return <Container> <ComponentSchedule  {...listData} /> </Container>;
  }
}
