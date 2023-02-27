import React from "react";
import {API} from "../api/APIManager";
import {
    AddEmployeeState,
    EmployeeEditDTO,
    EmployeeJobTitleList, EmployeeProps,
    EmployeeRoleList, EmployeeSkillList
} from "../types/Employee";

import {errors, successes} from "../messages/FormMessages";
import {Department} from "../types/Department";
import {ComponentEditEmployee} from "../components/ComponentEditEmployee";
import {Navigate, Params, useParams} from "react-router-dom";
import {NotificationManager} from "../api/NotificationManager";
import {Roles} from "../types/Roles";
import {RoutesPath} from "../RoutesPath";

export function EditEmployeeWrapper(): JSX.Element {
    let parameters: Readonly<Params<string>> = useParams();
    return (
        <EditEmployeeInternal  {...{params: parameters}}/>
    );
}

/**
 * The page to edit an employee
 * @param props {EmployeeProps} The props of the page
 */
export class EditEmployeeInternal extends React.Component<EmployeeProps, AddEmployeeState> {
    public state: AddEmployeeState = {
        departments: [],
        roles: [],
        titles: [],
        skills: [],
        editedEmployee: undefined,
        redirectTo: null
    }

    /**
     * Get the departments, roles and titles from the database and set the state of the component.
     * Display a notification to the user if the operation was successful or not.
     * @returns {Promise<void>}
     */
    public async componentDidMount() : Promise<void> {
        document.title = "Modifier un Employé - TaskMaster";

        let isLoggedIn: boolean = await this.verifyLogin();
        if(isLoggedIn) {
            let departments = API.getDepartments();
            let roles = API.getRoles();
            let titles = API.getJobTitles();
            let skills = API.getSkills();

            if(this.props.params.id) {
                let editedEmployee = API.getEmployeeById(this.props.params.id);

                let params: [
                        Department[] | string,
                        EmployeeRoleList | string,
                        EmployeeJobTitleList | string,
                        EmployeeSkillList | string,
                        EmployeeEditDTO | string,
                ] = await Promise.all([departments, roles, titles, skills, editedEmployee]);

                if(Array.isArray(params[0]) && Array.isArray(params[1]) && Array.isArray(params[2]) && Array.isArray(params[3]) && typeof(params[4]) !== "string") {
                    this.setState({departments: params[0], roles: params[1], titles: params[2], skills: params[3], editedEmployee: params[4]});
                } else {
                    NotificationManager.error(errors.GET_EDIT_EMPLOYEES, errors.ERROR_GENERIC_MESSAGE);
                }
            } else {
                NotificationManager.error(errors.INVALID_EMPLOYEE_ID_PARAMETER, errors.ERROR_GENERIC_MESSAGE);
            }
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

        let hasPerms = this.verifyPermissions(Roles.ADMIN);
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
     * Edit an employee in the database and display a notification to the user if the operation was successful or not.
     * @param employeeId {string} The id of the employee to edit
     * @param employee {EmployeeCreateDTO} The employee to edit
     */
    readonly #editEmployee = async (employeeId: string, employee: EmployeeEditDTO) : Promise<void> => {
        let error = await API.editEmployee(employeeId, employee);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_EDITED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    /**
     * Add an jobTitle to the database
     * @param title The jobTitle
     */
    readonly #addJobTitle = async (title: string) : Promise<void> => {
        let error = await API.createJobTitle(title);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_CREATED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    public render(): JSX.Element {
        if(this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo}></Navigate>);
        }

        return (
            <ComponentEditEmployee
                departments={this.state.departments}
                roles={this.state.roles}
                jobTitles={this.state.titles}
                editedEmployee={this.state.editedEmployee}
                employeeId={this.props.params.id}
                onEditEmployee={this.#editEmployee}
                onAddJobTitle={this.#addJobTitle}
            />
        );
    }
}
