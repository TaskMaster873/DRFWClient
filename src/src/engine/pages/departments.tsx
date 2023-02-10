import React from "react";
import {Container} from "react-bootstrap";
import {ComponentDepartmentList} from "../components/ComponentDepartmentList";
import {API} from "../api/APIManager";

/**
 * Ceci est la page pour les employés
 */
export class Departments extends React.Component {
  public state = {
    list: []
  }

  public async componentDidMount() {
    let departments = await API.getDepartments();
    this.setState({list: departments})
    document.title = "Employés - TaskMaster";
  }

  /**
   *
   * @returns La liste des employés
   */
  public render(): JSX.Element {
    console.log(this.state.list);
    return (
      <Container>
        <ComponentDepartmentList list={this.state.list} />
      </Container>
    );
  }
}
