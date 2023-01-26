import React from "react";
import { Container } from "react-bootstrap";
import { ComponentEmployeeList } from "../components/ComponentEmployeeList";
import { Logger } from "../Logger";
import { EmployeeList, Employee } from "../types/Employee";

export class Employees extends React.Component {
  private logger: Logger = new Logger(`Employees`, `#20f6a4`, false);
  private list: Employee[] = [];

  public componentDidMount() {
    document.title = "Employés - Task Manager";
  }

  public render(): JSX.Element {
    let listData: EmployeeList = { list: this.list };
    return (
      <Container>
        <ComponentEmployeeList {...listData} />
      </Container>
    );
  }
}
