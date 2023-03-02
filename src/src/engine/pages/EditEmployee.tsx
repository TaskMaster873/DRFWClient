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
import {JobTitle} from "../types/JobTitle";
import Utils from "../utils/Utils";
import {Skill} from "../types/Skill";

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
    public async componentDidMount(): Promise<void> {
        document.title = "Modifier un Employé - TaskMaster";

        await this.fetchData();
    }

    private async fetchData() {
        let isLoggedIn: boolean = await this.verifyLogin();
        if (isLoggedIn) {
            let departments = API.getDepartments();
            let roles = API.getRoles();
            let titles = API.getJobTitles();
            let skills = API.getSkills();

            if (this.props.params.id) {
                let editedEmployee = API.getEmployeeById(this.props.params.id);

                let params: [
                        Department[] | string,
                        EmployeeRoleList | string,
                        EmployeeJobTitleList | string,
                        EmployeeSkillList | string,
                        EmployeeEditDTO | string,
                ] = await Promise.all([departments, roles, titles, skills, editedEmployee]);

                if (Array.isArray(params[0]) && Array.isArray(params[1]) && Array.isArray(params[2]) && Array.isArray(params[3]) && typeof (params[4]) !== "string") {
                    this.setState({
                        departments: params[0],
                        roles: params[1],
                        titles: params[2],
                        skills: params[3],
                        editedEmployee: params[4]
                    });
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
    readonly #editEmployee = async (employeeId: string, employee: EmployeeEditDTO): Promise<void> => {
        let error = await API.editEmployee(employeeId, employee);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_EDITED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    //#region JobTitles
    /**
     * Add an jobTitle to the database
     * @param title The jobTitle
     * @private
     */
    readonly #addJobTitle = async (title: string): Promise<void> => {
        let error = await API.createJobTitle(title);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_CREATED);
            let titles = this.state.titles;
            titles.push(new JobTitle({name: title}));
            this.setState({titles: titles});
            await this.fetchData();
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    }

    /**
     * Edit a jobTitle from the database
     * @param title The jobTitle
     * @private
     */
    readonly #editJobTitle = async (title: JobTitle): Promise<void> => {
        if (title.id) {
            let error = await API.editJobTitle(title);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_EDITED);
                let titles = Utils.editElement(this.state.titles, title.id, title) as JobTitle[];
                this.setState({titles: titles});
                await this.fetchData();
            } else {
                NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            }
        }
    }

    /**
     * Delete a jobTitle from the database
     * @param titleId The jobTitle identifier auto-generated by the Firestore API
     * @private
     */
    readonly #deleteJobTitle = async (titleId: string): Promise<void> => {
        if (titleId) {
            let error = await API.deleteJobTitle(titleId);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_DELETED);
                let titles = Utils.deleteElement(this.state.titles, titleId) as JobTitle[];
                this.setState({titles: titles});
                await this.fetchData();
            } else {
                NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            }
        }
    }
    //#endregion

    //#region Skills
    /**
     * Add a skill to the database
     * @param skill the skill
     * @private
     */
    readonly #addSkill = async (skill: string): Promise<void> => {
        let error = await API.createSkill(skill);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.SKILL_CREATED);
            let skills = this.state.skills;
            skills.push(new Skill({name: skill}));
            this.setState({skills: skills});
            await this.fetchData();
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    }

    /**
     * Edit a skill from the database
     * @param skill the skill
     * @private
     */
    readonly #editSkill = async (skill: Skill): Promise<void> => {
        if (skill.id) {
            let error = await API.editSkill(skill);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.SKILL_EDITED);
                let skills = Utils.editElement(this.state.skills, skill.id, skill) as Skill[];
                this.setState({skills: skills});
                await this.fetchData();
            } else if (error) {
                NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            }
        }
    }

    /**
     * Delete a skill from the database
     * @param skillId The skill identifier auto-generated by the Firestore API
     * @private
     */
    readonly #deleteSkill = async (skillId: string): Promise<void> => {
        if (skillId) {
            let error = await API.deleteSkill(skillId);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.SKILL_EDITED);
                let skills = Utils.deleteElement(this.state.skills, skillId) as Skill[];
                this.setState({skills: skills});
                await this.fetchData();
            } else {
                NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            }
        }
    }

    //#endregion

    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo}></Navigate>);
        }

        return (
            <ComponentEditEmployee
                departments={this.state.departments}
                roles={this.state.roles}
                jobTitles={this.state.titles}
                skills={this.state.skills}
                editedEmployee={this.state.editedEmployee}
                employeeId={this.props.params.id}
                onEditEmployee={this.#editEmployee}
                onAddJobTitle={this.#addJobTitle}
                onEditJobTitle={this.#editJobTitle}
                onDeleteJobTitle={this.#deleteJobTitle}
                onAddSkill={this.#addSkill}
                onEditSkill={this.#editSkill}
                onDeleteSkill={this.#deleteSkill}
            />
        );
    }
}
