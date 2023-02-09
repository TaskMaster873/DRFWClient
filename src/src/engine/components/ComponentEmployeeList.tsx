import React from "react";
import {Button, Col, Row, Table} from "react-bootstrap";
import {Employee} from "../types/Employee";
import {LinkContainer} from "react-router-bootstrap";
import {ComponentSearchBar} from "./ComponentSearchBar";

/***
 * Ce composant affiche la liste de tous les employés d'un département
 *
 * state : liste d'employés
 */
export class ComponentEmployeeList extends React.Component {
  public state: { list: Employee[]};
  constructor(props: { list: Employee[] }) {
    super(props);
    this.state = {
      list: props.list
    };
  }

  updateList = (filteredList: Employee[]) => {
    this.setState({list: filteredList});
  }

  public render(): JSX.Element {
    let searchProps = {list: this.state.list, filterList: this.updateList};
    return (
      <div className="mt-5">
          <Row>
            <Col><h3>Liste des employés</h3></Col>
            <Col xs={4}></Col>
            <Col><ComponentSearchBar {...searchProps} /></Col>
          </Row>
        <Table responsive bordered hover>
          <thead>
            <tr key={"firstCol"}>
              <th key={"id"}>#</th>
              <th key={"firstName"}>Prénom</th>
              <th key={"name"}>Nom</th>
              <th key={"email"}>Adresse courriel</th>
              <th key={"phoneNumber"}>Tel</th>
              <th key={"departmentId"}>Département</th>
              <th key={"jobTitles"}>Role(s)</th>
              <th key={"skills"}>Compétences</th>
            </tr>
          </thead>
          <tbody>
            {this.state.list.map((_, index) => (
              <tr key={"secondCol" + index}>
                <td key={"id" + index}>{/*{this.state.list[index].id}*/}</td>
                <td key={"firstName " + index}>
                  <a>{this.state.list[index].firstName}</a>
                </td>
                <td key={"name " + index}>{this.state.list[index].lastName}</td>
                <td key={"email " + index}>{/*{this.state.list[index].email}*/}</td>
                <td key={"phoneNumber " + index}>
                  {this.state.list[index].phoneNumber}
                </td>
                <td key={"departmentId " + index}>{this.state.list[index].departmentId}</td>
                <td key={"jobTitles " + index}>
                  {this.state.list[index].jobTitles.join(", ")}
                </td>
                <td key={"skills " + index}>{this.state.list[index].skills}</td>
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
