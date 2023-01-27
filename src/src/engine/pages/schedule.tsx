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
  private list: Employee[] = [];
  public componentDidMount() {
    document.title = "Horaire - Task Manager";
  }

  /***
   * 
   * Envoie la liste des employés au ComponentSchedule 
   * 
   */
  public render(): JSX.Element {
    let listData: EmployeeList = { list: this.list };
    return (
      <Container className="mt-5">
        <ComponentSchedule {...listData} />
      </Container>
    );
  }
}
