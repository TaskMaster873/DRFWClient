import React from "react";
import {Table} from "react-bootstrap";
import {DepartmentList} from "../types/Department";
import {ComponentAddDepartement} from "./ComponentAddDepartement";

export class ComponentDepartmentList extends React.Component<DepartmentList> {
  constructor(props: DepartmentList) {
    super(props);
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
            {this.props.list.map((department, index) => (
              <tr key={"secondCol" + index}>
                <td key={"no" + index}>{index}</td>
                <td key={"name " + index}>
                  <a
                      className={"employeeNameBtn"}
                    href={"/employees/" + department.name}
                    style={{ textDecoration: "none" }}
                  >
                    {department.name}
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
