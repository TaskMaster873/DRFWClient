import React from "react";
import {ComponentDepartmentList} from "../components/ComponentDepartmentList";
import {API} from "../api/APIManager";
import {Department, DepartmentModifyDTO} from "../types/Department";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";
import {Roles} from "../types/Roles";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import {Container} from "react-bootstrap";
import Utils from "../utils/Utils";
import {Employee} from "../types/Employee";

export interface DepartmentsState {
    employees: Employee[];
    employeeNb: number[];
    departments: Department[];
    redirectTo: string | null;
}

/**
 * Ceci est la page pour les departments
 */
export class Departments extends React.Component<unknown, DepartmentsState> {
    public state: DepartmentsState = {
        employees: [],
        employeeNb: [],
        departments: [],
        redirectTo: null
    };

    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    public async componentDidMount(): Promise<void> {
        document.title = "Départements - TaskMaster";

        let isLoggedIn: boolean = await this.verifyLogin();

        if (isLoggedIn) {
            await this.fetchData();
        } else {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
        }
    }

    private async onEvent(): Promise<void> {
        await this.verifyLogin();
    }

    /**
     * Verify if the user is logged in
     * @private
     */
    private async verifyLogin(): Promise<boolean> {
        let isLoggedIn: boolean = false;
        await API.awaitLogin;

        let hasPerms = API.hasPermission(Roles.EMPLOYEE);
        if (!API.isAuth() || !hasPerms) {
            this.setState({
                redirectTo: RoutesPath.INDEX
            });
        } else {
            isLoggedIn = true;
        }

        return isLoggedIn;
    }

    /**
     * Get the employees, the departments and the number of employee in the department from the database and set the state of the component.
     * Display a notification to the user if the operation was successful or not.
     * @returns {Promise<void>}
     */
    private async fetchData(): Promise<void> {
        let _employees = API.getEmployees();
        let departments = await API.getDepartments();

        if (Array.isArray(departments)) {
            let _employeeNb = API.getEmployeeNbDepartments(departments);

            let employees = await _employees;
            let employeeNb = await _employeeNb;
            if (Array.isArray(employees) && Array.isArray(employeeNb)) {
                this.setState({employees: employees, employeeNb: employeeNb, departments: departments});
            } else {
                console.error(errors.GET_EMPLOYEES, employees, employeeNb);
            }
        } else {
            console.error(errors.GET_DEPARTMENTS, departments);
        }
    }

    //#region Departments
    private addDepartment = async (department: DepartmentModifyDTO): Promise<void> => {
        let error = await API.createDepartment(department);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.DEPARTMENT_CREATED);

            let departments = this.state.departments;
            let employeeNb = this.state.employeeNb;

            departments.push(department);
            employeeNb.push(0);

            this.setState({departments: departments, employeeNb: employeeNb});
            await this.fetchData();
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    };

    /**
     * Edit a department in the database and display a notification to the user if the operation was successful or not.
     * @param departmentId {string} The id of the department to edit
     * @param department {DepartmentModifyDTO} The department to edit
     * @param oldDepartmentName The old department name
     */
    private editDepartment = async (departmentId: string, department: DepartmentModifyDTO, oldDepartmentName: string): Promise<void> => {
        let error = await API.editDepartment(departmentId, department, oldDepartmentName);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.DEPARTMENT_EDITED);
            let departments = Utils.editElement(this.state.departments, departmentId, department) as Department[];
            this.setState({departments: departments});
            await this.fetchData();
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    };

    private deleteDepartment = async (department: Department): Promise<void> => {
        let error = await API.deleteDepartment(department);
        if (!error && department.id) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.DEPARTMENT_EDITED);
            let departments = Utils.deleteElement(this.state.departments, department.id) as Department[];
            this.setState({departments: departments});
            await this.fetchData();
        } else if (error) {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    };
    //#endregion

    /**
     *
     * @returns The list of departments
     */
    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (
                <Navigate to={this.state.redirectTo}></Navigate>
            );
        }
        return (
            <Container data-bs-theme={"dark"}>
                <ComponentDepartmentList
                    employees={this.state.employees}
                    employeeNb={this.state.employeeNb}
                    departments={this.state.departments}
                    onAddDepartment={this.addDepartment}
                    onEditDepartment={this.editDepartment}
                    onDeleteDepartment={this.deleteDepartment}
                />
            </Container>
        );
    }

    


}
