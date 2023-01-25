import React from "react";
import { EmployeeList } from "../types/EmployeeList";

export class ComponentEmployeeList extends React.Component {
  private list: string[] = [];
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
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: this.list.length }).map((_, index) => (
              <tr>
                <td key={index}>{index}</td>
                <td key={index + "a"}>Nom</td>
                <td key={index + "b"}>
                  <a>{this.list[index]}</a>
                </td>
                <td key={index + "c"}>Tel</td>
                <td key={index + "d"}>Gest</td>
                <td key={index + "e"}>Role</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button href="/creer-employe">Ajouter</Button>
      </div>
    );
  }
}
