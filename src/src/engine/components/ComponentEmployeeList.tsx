import React from "react";
import { Table, Button } from "react-bootstrap";
import { EmployeeList, Employee } from "../types/Employee";

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
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Tel</th>
              <th>Gestionnaire</th>
              <th>Role(s)</th>
              <th>Compétences</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: this.list.length }).map((_, index) => (
              <tr>
                <td key={index}>{index}</td>
                <td key={"firstName " + index}>
                  <a>{this.list[index].firstName}</a>
                </td>
                <td key={"name " + index}>{this.list[index].name}</td>
                <td key={"phoneNumber " + index}>
                  {this.list[index].phoneNumber}
                </td>
                <td key={"manager " + index}>{this.list[index].manager}</td>
                <td key={"jobTitles " + index}>
                  {this.list[index].jobTitles.toString()}
                </td>
                <td key={"skills " + index}>{this.list[index].skills}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button href="/creer-employe">Ajouter</Button>
      </div>
    );
  }
}
