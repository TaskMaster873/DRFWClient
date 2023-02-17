import React, {CSSProperties} from "react";
import {Button, Col, Row, Table} from "react-bootstrap";
import {Employee, EmployeeListProps, employeeTableHeads} from "../types/Employee";
import {LinkContainer} from "react-router-bootstrap";
import {ComponentSearchBar} from "./ComponentSearchBar";
import {API} from "../api/APIManager";
import {ScaleLoader} from "react-spinners";
import {BiEdit} from "react-icons/bi"
import {Roles} from "../types/Roles";
import {CgUnavailable} from "react-icons/cg";
import {SearchParams} from "../types/SearchParams";

/***
 * Ce composant affiche la liste de tous les employés d'un département
 *
 * state : liste d'employés
 */

const override: CSSProperties = {
    display: 'flex', alignSelf: 'center', margin: '0 auto',
};

export class ComponentEmployeeList extends React.Component<EmployeeListProps> {
    public state: EmployeeListProps = {
        employees: null, filteredList: null, department: this.props.department
    }

    constructor(props: EmployeeListProps) {
        super(props);
    }

    static getDerivedStateFromProps(props: EmployeeListProps, state: EmployeeListProps): EmployeeListProps {
        return {
            employees: props.employees, department: props.department, filteredList: state.filteredList
        };
    }

    public render(): JSX.Element {
        let list: Employee[] = this.state.employees !== null ? this.state.employees : [];

        let searchProps: SearchParams<Employee> = {list: list, filterList: this.updateList.bind(this)};
        return (<div className="mt-5">
                {this.renderSearchBar(searchProps)}
                {this.renderList()}
                {this.renderAddEmployeeButton()}
            </div>);
    }

    private updateList(filteredList: Employee[]): void {
        this.setState({
            filteredList: filteredList
        });
    }

    private renderSearchBar(searchProps: SearchParams<Employee>): JSX.Element | undefined {
        return (<Row>
            <Col xs={7}><h3>Liste des employés du département {this.state.department}</h3></Col>
            <Col xs={2}></Col>
            <Col xs={3}><ComponentSearchBar {...searchProps} /></Col></Row>);
    }

    private getEmployeeList(list: Employee[] | null): JSX.Element[] {
        if (list === null) {
            return [<tr key={"firstCol"}>
                <td colSpan={9}>
                    <div style={{height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ScaleLoader
                            color={"#A020F0"}
                            loading={true}
                            cssOverride={override}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                </td>
            </tr>]
        } else if (list.length !== 0) {
            return list.map((employee, index) => (<tr key={"secondCol" + index}>
                <td key={"id" + index}>{index + 1}</td>
                <td key={"firstName" + index}>
                    {employee.firstName}
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
                <td key={"action " + index}><a><BiEdit /></a> {this.renderAdminActions()}</td>
            </tr>));
        } else {
            return [<tr key={"firstCol"}>
                <td colSpan={9}>
                    <h6>Aucun employé est présent dans ce département</h6>
                </td>
            </tr>];
        }
    }

    private renderList(): JSX.Element | undefined {
        let list: Employee[] | null = this.state.filteredList !== null ? this.state.filteredList : this.state.employees;

        return (<Table responsive bordered hover className="text-center">
            <thead>
            <tr key={"firstCol"}>
                {employeeTableHeads.map((th) => (<th key={th}>{th}</th>))}
            </tr>
            </thead>
            <tbody>
            {this.getEmployeeList(list)}
            </tbody>
        </Table>);
    }

    private renderAddEmployeeButton(): JSX.Element | undefined {
        if (API.isAuth() && API.hasPermission(Roles.ADMIN)) {
            return (<LinkContainer to="/add-employee">
                <Button className="mt-3 mb-3">Ajouter</Button>
            </LinkContainer>);
        }
    }

    private renderAdminActions(): JSX.Element | undefined {
        if(API.isAuth() && API.hasPermission(Roles.ADMIN)) {
            return <a><CgUnavailable /></a>
        }
    }
}
