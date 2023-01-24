import React from "react";
import { ComponentEmployeeList } from "../components/ComponentEmployeeList";
import { Logger } from "../Logger";
import { EmployeeList } from "../types/EmployeeList";

export class Employees extends React.Component {
  private logger: Logger = new Logger(`Employees`, `#20f6a4`, false);
  private list: string[] = ["test"];

  public componentDidMount() {
    document.title = "Employés - Task Manager";
  }

  public render(): JSX.Element {
    let listData: EmployeeList = { list: this.list };
    return <ComponentEmployeeList {...listData} />;
  }
}
