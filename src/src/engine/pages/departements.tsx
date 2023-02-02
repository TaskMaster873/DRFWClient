import React from "react";
import { Container } from "react-bootstrap";
import { ComponentDepartementList } from "../components/ComponentDepartementList";
import { Logger } from "../Logger";
import { DepartementList, Departement } from "../types/Departement";

/**
 * Ceci est la page pour les employés
 */
export class Departements extends React.Component {
  private logger: Logger = new Logger(`Departements`, `#20f6a4`, false);
  private list: Departement[] = [
    new Departement({
      no: 0,
      name: "Informatique",
    }),
    new Departement({
      no: 1,
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
    let listData: DepartementList = { list: this.list };
    return (
      <Container>
        <ComponentDepartementList {...listData} />
      </Container>
    );
  }
}
