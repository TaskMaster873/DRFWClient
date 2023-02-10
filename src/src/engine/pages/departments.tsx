import React from "react";
import {Container} from "react-bootstrap";
import {ComponentDepartmentList} from "../components/ComponentDepartmentList";
import {DepartmentList} from "../types/Department";
import {API} from "../api/APIManager";

/**
 * Ceci est la page pour les employés
 */
export class Departments extends React.Component {
  public state = {
    list: []
  }

  public async componentDidMount() {
    this.setState({list: await API.getDepartments()})
    console.log(this.state.list);
    document.title = "Employés - TaskMaster";
  }

  /**
   *
   * @returns La liste des employés
   */
  public render(): JSX.Element {
    let listData: DepartmentList = { list: this.state.list };
    return (
      <Container>
        <ComponentDepartmentList {...listData} />
      </Container>
    );
  }
}
