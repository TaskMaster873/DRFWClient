import React from "react";
import {Container} from "react-bootstrap";
import {ComponentDepartmentList} from "../components/ComponentDepartmentList";
import {Logger} from "../Logger";
import {Department, DepartmentList} from "../types/Department";

/**
 * Ceci est la page pour les employés
 */
export class Departments extends React.Component {
  private logger: Logger = new Logger(`Departments`, `#20f6a4`, false);
  private list: Department[] = [
    new Department({
      id: "",
      name: "Informatique",
    }),
    new Department({
      id: "",
      name: "Construction",
    }),
  ];

  public componentDidMount() {
    document.title = "Employés - TaskMaster";
  }

  /**
   *
   * @returns La liste des employés
   */
  public render(): JSX.Element {
    let listData: DepartmentList = { list: this.list };
    return (
      <Container>
        <ComponentDepartmentList {...listData} />
      </Container>
    );
  }
}
