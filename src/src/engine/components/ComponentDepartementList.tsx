import React from "react";
import { Table, Button } from "react-bootstrap";
import { Departement, DepartementList } from "../types/Departement";
import { LinkContainer } from "react-router-bootstrap";
import { ComponentAddDepartement } from "./ComponentAddDepartement";

export class ComponentDepartementList extends React.Component {
  private list: Departement[] = [];
  constructor(props: DepartementList) {
    super(props);
    this.list = props.list;
  }

  public render(): JSX.Element {
    return (
      <div className="mt-5">
        <h3>Liste des départements</h3>
        <Table responsive bordered hover>
          <thead>
            <tr key={"firstCol"}>
              <th key={"no"}>#</th>
              <th key={"name"}>Nom</th>
              <th key={"director"}>Directeur(s)/Gérant(s)</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: this.list.length }).map((_, index) => (
              <tr key={"secondCol" + index}>
                <td key={"no" + index}>{index}</td>
                <td key={"name " + index}>
                  <a
                    href={"/employees/" + this.list[index].name}
                    style={{ textDecoration: "none" }}
                  >
                    {this.list[index].name}
                  </a>
                </td>
                <td key={"director " + index}>
                  <a> - </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <ComponentAddDepartement />

      </div>
    );
  }
}
