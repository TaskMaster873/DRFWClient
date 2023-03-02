import React from "react";
import {ComponentDepartmentList} from "../components/ComponentDepartmentList";
import {API} from "../api/APIManager";
import {Department, DepartmentModifyDTO, DepartmentsState} from "../types/Department";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";
import {Roles} from "../types/Roles";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import {Container} from "react-bootstrap";
import Utils from "../utils/Utils";

/**
 * Ceci est la page pour les departments
 */
export class Departments extends React.Component<unknown, DepartmentsState> {
    public state: DepartmentsState = {
        employees: [],
        employeeNb: [],
        departments: [],
        redirectTo: null
    }

    public async componentDidMount() : Promise<void> {
        document.title = "Départements - TaskMaster";

        let isLoggedIn: boolean = await this.verifyLogin();

        if(isLoggedIn) {
            await this.fetchData();
        } else {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
        }
    }

    /**
     * Verify if the user has the permission to access this page
     * @param role
     * @private
     */
    private verifyPermissions(role: Roles): boolean {
        return API.hasPermission(role);
    }

    /**
     * Verify if the user is logged in
     * @private
     */
    private async verifyLogin(): Promise<boolean> {
        let isLoggedIn: boolean = false;
        await API.awaitLogin;

        let hasPerms = this.verifyPermissions(Roles.EMPLOYEE);
        if (!API.isAuth() || !hasPerms) {
            this.redirectTo(RoutesPath.INDEX);
        } else {
            isLoggedIn = true;
        }

        return isLoggedIn;
    }

    /**
     * Redirect to a path
     * @param path
     * @private
     */
    private redirectTo(path: string): void {
        this.setState({
            redirectTo: path
        });
    }

    /**
     * Get the employees, the departments and the number of employee in the department from the database and set the state of the component.
     * Display a notification to the user if the operation was successful or not.
     * @returns {Promise<void>}
     */
    public async fetchData() : Promise<void> {
        let _employees = API.getEmployees();
        let departments = await API.getDepartments();

        if (Array.isArray(departments)) {
            let _employeeNb = API.getEmployeeNbDepartments(departments);

            let employees = await _employees;
            let employeeNb = await _employeeNb;
            if(Array.isArray(employees) && Array.isArray(employeeNb)) {
                this.setState({employees: employees, employeeNb: employeeNb, departments: departments});
            } else {
                console.error(errors.GET_EMPLOYEES, employees, employeeNb);
            }
        } else {
            console.error(errors.GET_DEPARTMENTS, departments);
        }
    }

    //#region Departments
    public addDepartment = async (department: Department) : Promise<void> => {
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
    }

    /**
     * Edit a department in the database and display a notification to the user if the operation was successful or not.
     * @param departmentId {string} The id of the department to edit
     * @param department {DepartmentModifyDTO} The department to edit
     */
    public editDepartment = async (departmentId: string, department: DepartmentModifyDTO) : Promise<void> => {
        let error = await API.editDepartment(departmentId, department);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.DEPARTMENT_EDITED);
            let departments = Utils.editElement(this.state.departments, departmentId, department) as Department[];
            this.setState({departments: departments});
            await this.fetchData();
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    }

    public deleteDepartment = async (department: Department) : Promise<void> => {
        let error = await API.deleteDepartment(department);
        if (!error && department.id) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.DEPARTMENT_EDITED);
            let departments = Utils.deleteElement(this.state.departments, department.id) as Department[];
            this.setState({departments: departments});
            await this.fetchData();
        } else if(error) {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    }
    //#endregion

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        if(this.state.redirectTo) {
            return (
                <Navigate to={this.state.redirectTo}></Navigate>
            );
        }

        return (
            <Container>
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
