import React from "react";
import { Table, Button } from "react-bootstrap";
import { EmployeeList, Employee } from "../types/Employee";
import { LinkContainer } from "react-router-bootstrap";

/***
 * Ce composant affiche la liste de tous les employés d'un département
 *
 * state : ancien mot de passe, nouveau mot de passe, validation requis et regex de mot de passe
 */
export class ComponentEmployeeList extends React.Component {
  private list: Employee[] = [];
  constructor(props: EmployeeList) {
    super(props);
    this.list = props.list;
  }

  public render(): JSX.Element {
    return (
      <div className="mt-5">
        <h3>Liste des employés</h3>
        <Table responsive bordered hover>
          <thead>
            <tr key={"firstCol"}>
              <th key={"id"}>#</th>
              <th key={"firstName"}>Prénom</th>
              <th key={"name"}>Nom</th>
              <th key={"phoneNumber"}>Tel</th>
              <th key={"manager"}>Gestionnaire</th>
              <th key={"jobTitles"}>Role(s)</th>
              <th key={"skills"}>Compétences</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: this.list.length }).map((_, index) => (
              <tr key={"secondCol" + index}>
                <td key={"id" + index}>{this.list[index].id}</td>
                <td key={"firstName " + index}>
                  <a>{this.list[index].firstName}</a>
                </td>
                <td key={"name " + index}>{this.list[index].name}</td>
                <td key={"phoneNumber " + index}>
                  {this.list[index].phoneNumber}
                </td>
                <td key={"manager " + index}>{this.list[index].manager}</td>
                <td key={"jobTitles " + index}>
                  {this.list[index].jobTitles.join(", ")}
                </td>
                <td key={"skills " + index}>{this.list[index].skills}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <LinkContainer to="/add-employee">
          <Button>Ajouter</Button>
        </LinkContainer>
      </div>
    );
  }
}
