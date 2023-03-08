import React from "react";
import {Button, Col, Form, ListGroup, Row, Table} from "react-bootstrap";
import {Employee, employeeAdminTableHeads, employeeTableHeads} from "../types/Employee";
import {LinkContainer} from "react-router-bootstrap";
import {API} from "../api/APIManager";
import {BiEdit} from "react-icons/bi";
import {Roles} from "../types/Roles";
import {CgCheckO, CgUnavailable} from "react-icons/cg";
import {RoutesPath} from "../RoutesPath";
import {ComponentLoadingBarSpinner} from "./ComponentLoadingBarSpinner";
import {FilterUtils} from "../utils/FilterUtils";
import { IconContext } from "react-icons/lib";

export interface EmployeeListProps {
    employees: Employee[] | null;
    filteredList: Employee[] | null;
    department?: string | null;
    onEmployeeActivationChange: (employee: Employee) => PromiseLike<void> | Promise<void> | void;
}

export interface EmployeeListState {
    filteredList: Employee[] | null;
}

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
    };

    constructor(props: EmployeeListProps) {
        super(props);
    }

    static getDerivedStateFromProps(props: EmployeeListProps, state: EmployeeListProps): EmployeeListState {
        return {
            filteredList: state.filteredList,
        };
    }

    public render(): JSX.Element {
        return (
            <div className="mt-5">
                {this.renderSearchBar()}
                {this.renderList()}
                {this.renderNavigationButtons()}
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

    private handleSearchChange(event): void {
        let list: Employee[] = !!(this.props.employees) ? this.props.employees : [];
        let searchTerm: string = event.target.value;

        if (searchTerm) {
            this.updateList(FilterUtils.filterEmployeeList(list, searchTerm));
        } else {
            this.updateList(list);
        }
    }

    /**
     * Render the list of employees
     * @param searchProps The search bar props to pass to the search bar
     * @private
     * @memberof ComponentEmployeeList
     * @todo Redo the search bar
     */
    private renderSearchBar(): JSX.Element {
        return (
            <Row>
                <Col xs={7}><h3>Liste des employés du département {this.props.department}</h3></Col>
                <Col xs={2}></Col>
                <Col xs={3}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            onChange={this.handleSearchChange.bind(this)}
                        />
                    </Form.Group>
                </Col>
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
                        <ComponentLoadingBarSpinner/>
                    </td>
                </tr>
            ];
        } else if (list.length !== 0) {
            return list.map((employee, index) => (
                <tr key={"secondCol" + index}>
                    <td key={`id ${index}`}>{index + 1}</td>
                    <td key={`firstName ${index}`}>{employee.firstName}</td>
                    <td key={`name ${index}`}>{employee.lastName}</td>
                    <td key={`email ${index}`}><a href={`mailto:${employee.email}`}>{employee.email}</a></td>
                    <td key={`phoneNumber ${index}`}>{employee.phoneNumber}</td>
                    <td key={`departmentId ${index}`}>{employee.department}</td>
                    <td key={`actif ${index}`}>{employee.isActive ? `Oui` : `Non`}</td>
                    <td key={`jobTitles ${index}`}>
                        <ListGroup variant="flush">
                            {employee.jobTitles.map((title: string) => (
                                <ListGroup.Item key={title}>{title}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </td>

                    <td key={`skills ${index}`}>
                        <ListGroup variant="flush">
                            {employee.skills.map((skill: string) => (
                                <ListGroup.Item key={skill}>{skill}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </td>
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
            <Table responsive bordered className="text-center">
                <thead>
                {this.renderTableHeads()}
                </thead>

                <tbody>
                {this.getEmployeeList(list)}
                </tbody>
            </Table>
        );
    }

    private renderNavigationButtons(): JSX.Element | undefined {
        let container: JSX.Element = <Button onClick={() => history.back()} className="me-3" variant="secondary">
            Retour
        </Button>
        if (API.hasPermission(Roles.ADMIN)) {
            return (
                <div className="mt-3">
                    {container}
                    <LinkContainer to="/add-employee">
                        <Button>Ajouter</Button>
                    </LinkContainer>
                </div>
            );
        }
        return container;
    }

    private renderAdminActions(index: number, employee: Employee): JSX.Element | undefined {
        if (employee.id && API.hasPermission(Roles.ADMIN) && API.userRole > employee.role) {
            let component: JSX.Element = <CgUnavailable/>;
            if (!employee.isActive) {
                component = <IconContext.Provider value={{ color: 'white' }}><CgCheckO/></IconContext.Provider>;
            }
            return (
                <td key={`action ${index}`}>
                    <LinkContainer to={`${RoutesPath.EDIT_EMPLOYEE}${employee.id}`} className="adminActions mx-1">
                        <IconContext.Provider value={{ color: 'white' }}>
                            <BiEdit/>
                        </IconContext.Provider>
                    </LinkContainer>
                    <a className="adminActions ms-1 mx-1"
                       onClick={() => this.props.onEmployeeActivationChange(employee)}>{component}</a>
                </td>
            );
        } else if (employee.id && API.hasPermission(Roles.ADMIN)) {
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
            );
        }
    }
}
