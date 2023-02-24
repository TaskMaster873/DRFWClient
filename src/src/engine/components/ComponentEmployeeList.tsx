import React from "react";
import {Button, Col, Row, Table} from "react-bootstrap";
import {Employee, EmployeeListProps, EmployeeListState, employeeTableHeads, employeeAdminTableHeads} from "../types/Employee";
import {LinkContainer} from "react-router-bootstrap";
import {ComponentSearchBar} from "./ComponentSearchBar";
import {API} from "../api/APIManager";
import {BiEdit} from "react-icons/bi"
import {Roles} from "../types/Roles";
import {CgCheckO, CgUnavailable} from "react-icons/cg";
import {SearchParams} from "../types/SearchParams";
import {RoutesPath} from "../RoutesPath";
import {ComponentLoadingBarSpinner} from "./ComponentLoadingBarSpinner";

/**
 * Component that display the list of employees of a department
 * @class ComponentEmployeeList
 * @extends {React.Component<EmployeeListProps, EmployeeListState>}
 * @param {EmployeeListProps} props
 * @param {EmployeeListState} state
 * @returns {JSX.Element}
 * @memberof ComponentEmployeeList
 * @todo Redo the search bar
 */
export class ComponentEmployeeList extends React.Component<EmployeeListProps, EmployeeListState> {
    public state: EmployeeListState = {
        filteredList: null,
    }

    constructor(props: EmployeeListProps) {
        super(props);
    }

    static getDerivedStateFromProps(props: EmployeeListProps, state: EmployeeListProps): EmployeeListState {
        return {
            filteredList: state.filteredList,
        };
    }

    public render(): JSX.Element {
        let list: Employee[] = this.props.employees !== null ? this.props.employees : [];
        // TODO: REDO THIS
        let searchProps: SearchParams<Employee> = {list: list, filterList: this.updateList.bind(this)};
        return (
            <div className="mt-5">
                {this.renderSearchBar(searchProps)}
                {this.renderList()}
                {this.renderAddEmployeeButton()}
            </div>
        );
    }

    /**
     * Update the list of employees
     * @param filteredList
     * @private
     * @memberof ComponentEmployeeList
     * @todo Redo the search bar
     */
    private updateList(filteredList: Employee[]): void {
        this.setState({
            filteredList: filteredList
        });
    }

    /**
     * Render the list of employees
     * @param searchProps The search bar props to pass to the search bar
     * @private
     * @memberof ComponentEmployeeList
     * @todo Redo the search bar
     */
    private renderSearchBar(searchProps: SearchParams<Employee>): JSX.Element {
        return (
            <Row>
                <Col xs={7}><h3>Liste des employés du département {this.props.department}</h3></Col>
                <Col xs={2}></Col>
                <Col xs={3}><ComponentSearchBar {...searchProps} /></Col>
            </Row>
        );
    }

    /**
     * Render the add employee button
     * @param list The list of employees
     * @private
     * @memberof ComponentEmployeeList
     */
    private getEmployeeList(list: Employee[] | null): JSX.Element[] {
        if (list === null) {
            return [
                <tr key={"firstCol"}>
                    <td colSpan={10}>
                        <ComponentLoadingBarSpinner />
                    </td>
                </tr>
            ]
        } else if (list.length !== 0) {
            return list.map((employee, index) => (
                <tr key={"secondCol" + index}>
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
                    {this.renderAdminActions(index, employee)}
                </tr>
            ));
        } else {
            return [
                <tr key={"firstCol"}>
                    <td colSpan={10}>
                        <h6>Aucun employé est présent dans ce département</h6>
                    </td>
                </tr>
            ];
        }
    }

    /**
     * Render the list of employees
     * @private
     * @memberof ComponentEmployeeList
     */
    private renderList(): JSX.Element | undefined {
        let list: Employee[] | null = this.state.filteredList !== null ? this.state.filteredList : this.props.employees;

        return (
            <Table responsive bordered hover className="text-center">
                <thead>
                    {this.renderTableHeads()}
                </thead>

                <tbody>
                    {this.getEmployeeList(list)}
                </tbody>
            </Table>
        );
    }

    private renderAddEmployeeButton(): JSX.Element | undefined {
        if (API.hasPermission(Roles.ADMIN)) {
            return (
                <LinkContainer to="/add-employee">
                    <Button className="mt-3 mb-3">Ajouter</Button>
                </LinkContainer>
            );
        } else {
            return <></>;
        }
    }

    private renderAdminActions(index: number, employee: Employee): JSX.Element | undefined {
        if (employee.employeeId && API.hasPermission(Roles.ADMIN) && API.userRole > employee.role) {
            let component: JSX.Element = <CgUnavailable/>;
            if (!employee.isActive) {
                component = <CgCheckO/>
            }
            return (
                <td key={`action ${index}`}>
                    <LinkContainer to={`${RoutesPath.EDIT_EMPLOYEE}${employee.employeeId}`} className="adminActions mx-1">
                        <BiEdit/>
                    </LinkContainer>
                    <a className="adminActions ms-1 mx-1" onClick={() => this.props.onEmployeeActivationChange(employee)}>{component}</a>
                </td>
            );
        } else if (employee.employeeId && API.hasPermission(Roles.ADMIN)) {
            return (
                <td key={`action ${index}`}></td>
            );
        }
    }

    private renderTableHeads(): JSX.Element {
        if (API.hasPermission(Roles.ADMIN)) {
            return (
                <tr key={"firstCol"}>
                    {employeeAdminTableHeads.map((th) => (<th key={th}>{th}</th>))}
                </tr>);
        } else {
            return (
                <tr key={"firstCol"}>
                    {employeeTableHeads.map((th) => (<th key={th}>{th}</th>))}
                </tr>
            )
        }
    }
}
