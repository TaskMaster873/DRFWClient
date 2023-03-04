import React from "react";
import {API} from "../api/APIManager";
import {AddEmployeeState, EmployeeEditDTO, EmployeeProps,} from "../types/Employee";

import {errors, successes} from "../messages/FormMessages";
import {ComponentEditEmployee} from "../components/ComponentEditEmployee";
import {Navigate, Params, useParams} from "react-router-dom";
import {NotificationManager} from "../api/NotificationManager";
import {Roles} from "../types/Roles";
import {RoutesPath} from "../RoutesPath";
import {JobTitle} from "../types/JobTitle";
import Utils from "../utils/Utils";
import {Skill} from "../types/Skill";

export function EditEmployeeWrapper(): JSX.Element {
    const parameters: Readonly<Params<string>> = useParams();
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


    public async componentDidMount(): Promise<void> {
        document.title = "Modifier un Employé - TaskMaster";

        await this.fetchData();
    }

    /**
     * Get the departments, roles, jobTitles, skills and the editedEmployee from the id in the route params from the database and set the state of the component.
     * Display a notification to the user if the operation was successful or not.
     * @returns {Promise<void>}
     */
    private async fetchData() {
        const isLoggedIn: boolean = await this.verifyLogin();
        if (!isLoggedIn) {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
            return;
        }
        if (this.props.params.id) {
            const [departments, roles, titles, skills, editedEmployee] = await Promise.all([
                API.getDepartments(),
                API.getRoles(),
                API.getJobTitles(),
                API.getSkills(),
                API.getEmployeeById(this.props.params.id)
            ]);

            if (Array.isArray(departments) && Array.isArray(roles) && Array.isArray(titles) && Array.isArray(skills) && typeof (editedEmployee) !== "string") {
                this.setState({
                    departments: departments,
                    roles: roles,
                    titles: titles,
                    skills: skills,
                    editedEmployee: editedEmployee
                });
            } else {
                NotificationManager.error(errors.GET_EDIT_EMPLOYEES, errors.ERROR_GENERIC_MESSAGE);
            }
        } else {
            NotificationManager.error(errors.INVALID_EMPLOYEE_ID_PARAMETER, errors.ERROR_GENERIC_MESSAGE);
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
        await API.awaitLogin;

        const hasPerms = this.verifyPermissions(Roles.ADMIN);
        if (!API.isAuth() || !hasPerms) {
            this.redirectTo(RoutesPath.INDEX);
        } else {
            return true;
        }
        return false;
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
     * @param employee {EmployeeEditDTO} The employee to edit
     */
    readonly #editEmployee = async (employeeId: string, employee: EmployeeEditDTO): Promise<void> => {
        const error = await API.editEmployee(employeeId, employee);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_EDITED);
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    }

    //#region JobTitles
    /**
     * Add an jobTitle to the database
     * @param titleName The new jobTitle name
     * @private
     */
    readonly #addJobTitle = async (titleName: string): Promise<void> => {
        const error = await API.createJobTitle(titleName);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_CREATED);
            const titles = [...this.state.titles, new JobTitle({ name: titleName })];
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
            const error = await API.editJobTitle(title);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_EDITED);
                const titles = Utils.editElement(this.state.titles, title.id, title) as JobTitle[];
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
            const error = await API.deleteJobTitle(titleId);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_DELETED);
                const titles = Utils.deleteElement(this.state.titles, titleId) as JobTitle[];
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
     * @param skillName the new skill name
     * @private
     */
    readonly #addSkill = async (skillName: string): Promise<void> => {
        const error = await API.createSkill(skillName);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.SKILL_CREATED);
            const skills = [...this.state.skills, new Skill({ name: skillName })];
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
            const error = await API.editSkill(skill);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.SKILL_EDITED);
                const skills = Utils.editElement(this.state.skills, skill.id, skill) as Skill[];
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
            const error = await API.deleteSkill(skillId);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.SKILL_EDITED);
                const skills = Utils.deleteElement(this.state.skills, skillId) as Skill[];
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
