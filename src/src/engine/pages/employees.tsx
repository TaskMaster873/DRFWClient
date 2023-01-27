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
      name: "Blanchet",
      firstName: "Stéphane",
      phoneNumber: "581-555-5555",
      manager: 0,
      jobTitles: ["Gestionnaire de projet", "Directeur de production"],
    }),
  ];

  public componentDidMount() {
    document.title = "Employés - Task Manager";
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
