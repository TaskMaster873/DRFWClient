import React from "react";
import { Nav, Table } from "react-bootstrap";
import {
    Department, departmentAdminTableHeads,
    DepartmentListProps,
    DepartmentListState,
    departmentTableHeads
} from "../types/Department";
import { ComponentAddDepartment } from "./ComponentAddDepartment";
import { API } from "../api/APIManager";
import { LinkContainer } from "react-router-bootstrap";
import { Roles } from "../types/Roles";
import {RoutesPath} from "../RoutesPath";
import {ComponentEditDepartment} from "./ComponentEditDepartment";
import {BiEdit, BiTrash} from "react-icons/bi";
import {ComponentLoadingBarSpinner} from "./ComponentLoadingBarSpinner";
import {ComponentConfirmDeleteJobTitle} from "./ComponentConfirmDeleteJobTitle";
import {ComponentConfirmDeleteDepartment} from "./ComponentConfirmDeleteDepartment";
import {JobTitle} from "../types/JobTitle";

/**
 * Component that display the list of departments
 */
export class ComponentDepartmentList extends React.Component<DepartmentListProps, unknown> {

    public state: DepartmentListState = {
        editedDepartment: undefined,
        departmentToDelete: undefined
    }

    public render(): JSX.Element {
        return (
            <div className="mt-5">
                <ComponentConfirmDeleteDepartment closePrompt={this.#changeDeletePromptVisibility}
                                                department={this.state.departmentToDelete}
                                                onDeleteDepartment={this.props.onDeleteDepartment}/>
                <h3>Liste des départements</h3>
                <Table responsive bordered hover className="text-center">
                    <thead>
                        {this.renderTableHeads()}
                    </thead>
                    <tbody>
                    {this.departmentList()}
                    </tbody>
                </Table>
                {this.renderAddDepartmentComponent()}
                <ComponentEditDepartment employees={this.props.employees} onEditDepartment={this.props.onEditDepartment}
                                         departmentToEdit={this.state.editedDepartment} cancelEdit={this.#changeEditPromptVisibility} />
            </div>
        );
    }

    /**
     * Return the list of departments with their name, director and number of employees
     * @returns {JSX.Element[]} The list of departments
     * @private
     * @memberof ComponentDepartmentList
     */
    private departmentList(): JSX.Element[] {
        if (this.props.departments.length === 0) {
            /**
             * If there is no department and the data is not loaded yet, we display a loading bar
             */
            return [
                <tr key={"noDepartment"}>
                    <td colSpan={5}>
                        <ComponentLoadingBarSpinner />
                    </td>
                </tr>
            ];
        } else {
            return this.props.departments.map((department: Department, index: number) => (
                <tr key={"secondCol" + index}>
                    <td key={"no" + index}>{index + 1}</td>
                    <td key={"name " + index}>
                        <LinkContainer
                            to={`${RoutesPath.DEPARTMENTS}/${department.name}/employees`}>
                            <Nav.Link className="departmentName">
                                {department.name}
                            </Nav.Link>
                        </LinkContainer>
                    </td>
                    <td key={"director " + index}>
                        {department.director ?? "-"}
                    </td>
                    <td key={"employeeNb " + index}>
                        {this.props.employeeNb[index]}
                    </td>
                    {this.renderAdminActions(index, department)}
                </tr>
            ));
        }
    }

    /**
     * Render the component to add a department
     * @private
     * @memberof ComponentDepartmentList
     * @returns {JSX.Element} The component to add a department
     */
    private renderTableHeads(): JSX.Element {
        if (API.hasPermission(Roles.ADMIN)) {
            return (
                <tr key={"firstCol"}>
                    {departmentAdminTableHeads.map((th) => (<th key={th}>{th}</th>))}
                </tr>);
        } else {
            return (
                <tr key={"firstCol"}>
                    {departmentTableHeads.map((th) => (<th key={th}>{th}</th>))}
                </tr>
            )
        }
    }

    private renderAdminActions(index: number, department: Department): JSX.Element | undefined {
        if (API.hasPermission(Roles.ADMIN)) {
            return (
                <td key={`action ${index}`}>
                    <a onClick={() => this.#changeEditPromptVisibility(department)} className="adminActions mx-1">
                        <BiEdit/>
                    </a>
                    <a onClick={() => this.#changeDeletePromptVisibility(department)} className="adminActions mx-1">
                        <BiTrash/>
                    </a>
                </td>
            );
        }
    }

    /**
     * Shows the edit modal with department if no parameter close the prompt
     * @param department The department
     * @private
     */
    readonly #changeEditPromptVisibility = (department?: Department): void => {
        this.setState({editedDepartment: department});
    }

    /**
     * Shows the deletion confirmation modal
     * @param department The department
     * @private
     */
    readonly #changeDeletePromptVisibility = (department?: Department): void => {
        this.setState({departmentToDelete: department});
    }

    /**
     * Render the component to add a department if the user is an admin
     * @private
     * @memberof ComponentDepartmentList
     * @returns {JSX.Element} The component to add a department
     */
    private renderAddDepartmentComponent(): JSX.Element {
        if (API.isAuth() && API.hasPermission(Roles.ADMIN)) {
            return (
                <ComponentAddDepartment employees={this.props.employees} onAddDepartment={this.props.onAddDepartment}/>
            );
        } else {
            return <></>;
        }
    }
}
