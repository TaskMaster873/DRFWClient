import React from "react";
import { Container } from "react-bootstrap";
import { ComponentSchedule } from "../components/ComponentSchedule";
import { Logger } from "../Logger";
import { EmployeeList, Employee } from "../types/Employee";

/**
 * C'est la page qui sert à afficher les horaires
 */
export class Schedule extends React.Component {
  private logger: Logger = new Logger(`Schedule`, `#20f6a4`, false);
  private list: Employee[] = [ // ceci est la même liste que dans employeelist page
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
    document.title = "Horaire - TaskMaster";
  }

  /***
   * 
   * Envoie la liste des employés au ComponentSchedule 
   * 
   */
  public render(): JSX.Element {
    let listData: EmployeeList = { list: this.list };
    return (
      <Container className="mt-5 mb-5">
        <ComponentSchedule {...listData} />
      </Container>
    );
  }
}
