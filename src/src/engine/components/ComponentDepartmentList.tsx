import React, {CSSProperties} from "react";
import { Nav, Table } from "react-bootstrap";
import { Department, DepartmentListProps, departmentTableHeads } from "../types/Department";
import { ComponentAddDepartment } from "./ComponentAddDepartment";
import { API } from "../api/APIManager";
import { LinkContainer } from "react-router-bootstrap";
import { ScaleLoader } from "react-spinners";
import { Roles } from "../types/Roles";
import {RoutePaths} from "../api/routes/RoutePaths";
import {ComponentEditDepartment} from "./ComponentEditDepartment";

const override: CSSProperties = {

};

export class ComponentDepartmentList extends React.Component<DepartmentListProps, unknown> {
    public render(): JSX.Element {
        return (
            <div className="mt-5">
                <h3>Liste des départements</h3>
                <Table responsive bordered hover className="text-center">
                    <thead>
                    <tr key={"firstCol"}>
                        {departmentTableHeads.map((th) => (<th key={th}>{th}</th>))}
                    </tr>
                    </thead>
                    <tbody>
                    {this.departmentList()}
                    </tbody>
                </Table>
                {this.renderAddDepartmentComponent()}
                <ComponentEditDepartment employees={this.props.employees} onEditDepartment={this.#onEditDepartment} />
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
                    <td colSpan={4}>
                        <div className='loadingBar'>
                            <ScaleLoader
                                color={"#A020F0"}
                                loading={true}
                                cssOverride={{
                                    display: 'flex',
                                    alignSelf: 'center',
                                    margin: '0 auto'
                                }}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div>
                    </td>
                </tr>
            ];
        } else {
            return this.props.departments.map((department: Department, index: number) => (
                <tr key={"secondCol" + index}>
                    <td key={"no" + index}>{index + 1}</td>
                    <td key={"name " + index}>
                        <LinkContainer
                            to={`${RoutePaths.DEPARTMENTS}/${department.name}/employees`}>
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
                </tr>
            ));
        }
    }

    /**
     * Call the parent function to update the list of departments
     * @param department The department that changed
     * @private
     * @memberof ComponentDepartmentList
     * @async
     * @returns {Promise<void>}
     * @throws {Error} If the parent function is not defined
     */
    readonly #onDataChange = async (department: Department): Promise<void> => {
        if (this.props.onAddDepartment !== null && this.props.onAddDepartment) {
            await this.props.onAddDepartment(department);
        }
    }

    readonly #onEditDepartment = async (department: Department): Promise<void> => {
        if (this.props.onEditDepartment !== null && this.props.onEditDepartment) {
            await this.props.onEditDepartment(department);
        }
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
                <ComponentAddDepartment employees={this.props.employees} onAddDepartment={this.#onDataChange}/>
            );
        } else {
            return <></>;
        }
    }
}
