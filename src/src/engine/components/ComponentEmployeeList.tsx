import React from "react";
import { Table, Button } from "react-bootstrap";
import { EmployeeList } from "../types/EmployeeList";

export class ComponentEmployeeList extends React.Component {
  private list: string[] = [];
  constructor(props: EmployeeList) {
    super(props);
    this.list = props.list;
  }

  public render(): JSX.Element {
    return (
        <div>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Tel</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
              {Array.from({ length: this.list.length }).map((_, index) => (
                <tr>
                  <td key={index+"a"}><a>{this.list[index]}</a></td>
                  <td key={index}>{index}</td>
                  <td key={index+"b"}>Nom</td>
                  <td key={index+"c"}>Tel</td>
                  <td key={index+"d"}>Role</td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Button href="/creer-employe">Ajouter</Button>
        </div>
      );
  }
}
