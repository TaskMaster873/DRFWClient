import React from "react";
import {ComponentAddEmployee} from "../components/ComponentAddEmployee";
import {API} from "../api/APIManager";
import {
    AddEmployeeState,
    EmployeeCreateDTO,
    EmployeeJobTitleList,
    EmployeeRoleList,
    EmployeeSkillList
} from "../types/Employee";
import {errors, successes} from "../messages/FormMessages";
import {Department} from "../types/Department";
import {NotificationManager} from "../api/NotificationManager";
import {Roles} from "../types/Roles";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import {JobTitle} from "../types/JobTitle";
import {Skill} from "../types/Skill";

export class AddEmployee extends React.Component<unknown, AddEmployeeState> {
    public state: AddEmployeeState = {
        departments: [],
        roles: [],
        titles: [],
        skills: [],
        redirectTo: null
    }

    public async componentDidMount(): Promise<void> {
        document.title = "Ajouter un Employé - TaskMaster";

        let isLoggedIn: boolean = await this.verifyLogin();
        if (isLoggedIn) {
            let departments = API.getDepartments();
            let roles = API.getRoles();
            let titles = API.getJobTitles();
            let skills = API.getSkills();

            let params: [
                    Department[] | string,
                    EmployeeRoleList | string,
                    EmployeeJobTitleList | string,
                    EmployeeSkillList | string
            ] = await Promise.all([departments, roles, titles, skills]);

            if (Array.isArray(params[0]) && Array.isArray(params[1]) && Array.isArray(params[2]) && Array.isArray((params[3]))) {
                this.setState({departments: params[0], roles: params[1], titles: params[2], skills: params[3]});
            } else {
                NotificationManager.error(errors.GET_DEPARTMENTS, errors.SERVER_ERROR);
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
     * Add an employee to the database
     * @param password {string} The password of the employee
     * @param employee {EmployeeCreateDTO} The employee to add
     */
    readonly #addEmployee = async (password: string, employee: EmployeeCreateDTO): Promise<void> => {
        let error = await API.createEmployee(password, employee);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_CREATED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    //#region JobTitles
    /**
     * Add an jobTitle to the database
     * @param title The jobTitle
     */
    readonly #addJobTitle = async (title: string): Promise<void> => {
        let error = await API.createJobTitle(title);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_CREATED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    readonly #editJobTitle = async (title: JobTitle): Promise<void> => {
        let error = await API.editJobTitle(title);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_EDITED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    readonly #deleteJobTitle = async (title: JobTitle): Promise<void> => {
        let error = await API.deleteJobTitle(title);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_DELETED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }
    //#endregion

    //#region Skills
    /**
     * Add a skill to the database
     * @param title The jobTitle
     */
    readonly #addSkill = async (title: string): Promise<void> => {
        let error = await API.createSkill(title);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.SKILL_CREATED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }
    readonly #editSkill = async (skill: Skill): Promise<void> => {
        let error = await API.editSkill(skill);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.SKILL_EDITED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    readonly #deleteSkill = async (skill: Skill): Promise<void> => {
        let error = await API.deleteSkill(skill);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.SKILL_EDITED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }
    //#endregion

    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo}></Navigate>);
        }

        return (
            <ComponentAddEmployee
                departments={this.state.departments}
                roles={this.state.roles}
                jobTitles={this.state.titles}
                skills={this.state.skills}
                onAddEmployee={this.#addEmployee}
                onAddJobTitle={this.#addJobTitle}
                onEditJobTitle={this.#editJobTitle}
                onAddSkill={this.#addSkill}
                onEditSkill={this.#editSkill}
                onDeleteJobTitle={this.#deleteJobTitle}
                onDeleteSkill={this.#deleteSkill}
            />
        );
    }
}
