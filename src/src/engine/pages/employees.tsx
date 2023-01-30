import React from "react";
import { Container } from "react-bootstrap";
import { ComponentEmployeeList } from "../components/ComponentEmployeeList";
import { Logger } from "../Logger";
import { EmployeeList, Employee, EmployeeCreateDTO } from "../types/Employee";

/**
 * Ceci est la page pour les employés
 */
export class Employees extends React.Component {
  private logger: Logger = new Logger(`Employees`, `#20f6a4`, false);
  private list: Employee[] = [
    new Employee({
      no: 0,
      name: "Blanchet",
      firstName: "Stéphane",
      phoneNumber: "581-555-5555",
      manager: 0,
      jobTitles: ["Gestionnaire de projet", "Directeur de production"],
    }),
    new Employee({
      no: 1,
      name: "Blanchette",
      firstName: "Roger",
      phoneNumber: "581-555-2312",
      manager: 0,
      jobTitles: ["Gestionnaire de projet", "Directeur de production"],
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
    let listData: EmployeeList = { list: this.list };
    return (
      <Container>
        <ComponentEmployeeList {...listData} />
      </Container>
    );
  }
}
