import React from "react";
import { ComponentEmployeeList } from "../components/ComponentEmployeeList";
import { Logger } from "../Logger";
import { EmployeeList } from "../types/EmployeeList";

export class EmployeePage extends React.Component {
  private logger: Logger = new Logger(`EmployeePage`, `#20f6a4`, false);
  private list: string[] = ["test"];

  public componentDidMount() {
    document.title = "Liste d'employés";
  }

  public render(): JSX.Element {
    let listData: EmployeeList = { list: this.list };
    return <ComponentEmployeeList {...listData} />;
  }
}
