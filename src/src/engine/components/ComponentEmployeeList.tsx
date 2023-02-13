import React from "react";
import {Button, Col, Row, Table} from "react-bootstrap";
import {Employee, EmployeeListProps} from "../types/Employee";
import {LinkContainer} from "react-router-bootstrap";
import {ComponentSearchBar} from "./ComponentSearchBar";
import {API} from "../api/APIManager";

/***
 * Ce composant affiche la liste de tous les employés d'un département
 *
 * state : liste d'employés
 */
export class ComponentEmployeeList extends React.Component<EmployeeListProps> {
    constructor(props: EmployeeListProps) {
        super(props);
    }

    updateList = (filteredList: Employee[]) => {
        this.setState({list: filteredList});
    }

    public render(): JSX.Element {
        let searchProps = {list: this.props.list, filterList: this.updateList};
        return (<div className="mt-5">
            {this.renderSearchBar(searchProps)}
            {this.renderList()}
            {this.renderAddEmployeeButton()}
        </div>);
    }

    private renderSearchBar(searchProps): JSX.Element {
        if (this.props.list.length != 0) {
            return (<Row>
                <Col xs={7}><h3>Liste des employés du département {this.props.department}</h3></Col>
                <Col xs={2}></Col>
                <Col xs={3}><ComponentSearchBar {...searchProps} /></Col></Row>);
        }
        return <h3>Liste des employés du département {this.props.department}</h3>;
    }

    private renderList(): JSX.Element | undefined {
        if (this.props.list.length != 0) {
            return (<Table responsive bordered hover>
                <thead>
                <tr key={"firstCol"}>
                    <th key={"id"}>#</th>
                    <th key={"firstName"}>Prénom</th>
                    <th key={"name"}>Nom</th>
                    <th key={"email"}>Adresse courriel</th>
                    <th key={"phoneNumber"}>Tel</th>
                    <th key={"departmentId"}>Département</th>
                    <th key={"active"}>Actif</th>
                    <th key={"jobTitles"}>Role(s)</th>
                    <th key={"skills"}>Compétences</th>
                </tr>
                </thead>
                <tbody>
                {this.props.list.map((employee, index) => (<tr key={"secondCol" + index}>
                    <td key={"id" + index}>{index + 1}</td>
                    <td key={"firstName" + index}>
                        <a>{employee.firstName}</a>
                    </td>
                    <td key={"name " + index}>{employee.lastName}</td>
                    <td key={"email " + index}>{employee.email}</td>
                    <td key={"phoneNumber " + index}>
                        {employee.phoneNumber}
                    </td>
                    <td key={"departmentId " + index}>{employee.department}</td>
                    <td key={"actif " + index}>{employee.isActive ? "Oui" : "Non"}</td>
                    <td key={"jobTitles " + index}>
                        {employee.jobTitles != undefined ? employee.jobTitles.join(", ") : ""}
                    </td>
                    <td key={"skills " + index}>{employee.skills}</td>
                </tr>))}
                </tbody>
            </Table>);
        }
        return <h6>Aucun employé est présent dans ce département</h6>;
    }

    private renderAddEmployeeButton() : JSX.Element | undefined {
        if(API.isAuth() && API.isAdmin) {
            return (<LinkContainer to="/add-employee">
                <Button className="mt-3">Ajouter</Button>
            </LinkContainer>);
        }
    }
}
