import React from "react";
import {ComponentAddEmployee} from "../components/ComponentAddEmployee";
import {API} from "../api/APIManager";
import {AddEmployeeState, EmployeeCreateDTO} from "../types/Employee";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";
import {Roles} from "../types/Roles";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import {JobTitle} from "../types/JobTitle";
import {Skill} from "../types/Skill";
import Utils from "../utils/Utils";

export class AddEmployee extends React.Component<unknown, AddEmployeeState> {
    public state: AddEmployeeState = {
        departments: [],
        roles: [],
        titles: [],
        skills: [],
        redirectTo: null
    };

    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    public async componentDidMount(): Promise<void> {
        document.title = "Ajouter un Employé - TaskMaster";

        await this.fetchData();
    }

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

    /**
     * On logout or on login, verify if the user is logged in
     * @private
     */
    private async onEvent(): Promise<void> {
        await this.verifyLogin();
    }

    /**
     * Get the departments, the roles, the jobTitles and the skills from the database and set the state of the component.
     * Display a notification to the user if the operation was successful or not.
     * @returns {Promise<void>}
     */
    private async fetchData(): Promise<void> {
        let isLoggedIn: boolean = await this.verifyLogin();
        if (!isLoggedIn) {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
            return;
        }
        const [departments, roles, titles, skills] = await Promise.all([
            API.getDepartments(),
            API.getRoles(),
            API.getJobTitles(),
            API.getSkills(),
        ]);

        if (Array.isArray(departments) && Array.isArray(roles) && Array.isArray(titles) && Array.isArray(skills)) {
            this.setState({departments: departments, roles, titles, skills});
        } else {
            NotificationManager.error(errors.GET_DEPARTMENTS, errors.SERVER_ERROR);
        }
    }

    /**
     * Verify if the user is logged in
     * @private
     */
    private async verifyLogin(): Promise<boolean> {
        await API.awaitLogin;

        let hasPerms = API.hasPermission(Roles.ADMIN);
        if (!API.isAuth() || !hasPerms) {
            this.setState({
                redirectTo: RoutesPath.INDEX
            });
        } else {
            return true;
        }
        return false;
    }

    /**
     * Add an employee to the database
     * @param password {string} The password of the employee
     * @param employee {EmployeeCreateDTO} The employee to add
     * @private
     */
    readonly #addEmployee = async (password: string, employee: EmployeeCreateDTO): Promise<void> => {
        const error = await API.createEmployee(password, employee);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_CREATED);
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    };

    //#region JobTitles
    /**
     * Add an jobTitle to the database
     * @param titleName The jobTitle
     * @private
     */
    readonly #addJobTitle = async (titleName: string): Promise<void> => {
        const error = await API.createJobTitle(titleName);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.JOB_TITLE_CREATED);
            const titles = [...this.state.titles, new JobTitle({name: titleName})];
            this.setState({titles: titles});
            await this.fetchData();
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    };

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
                let titles = Utils.editElement(this.state.titles, title.id, title) as JobTitle[];
                this.setState({titles: titles});
                await this.fetchData();
            } else {
                NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            }
        }
    };

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
                let titles = Utils.deleteElement(this.state.titles, titleId) as JobTitle[];
                this.setState({titles: titles});
                await this.fetchData();
            } else {
                NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            }
        }
    };
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
            const skills = [...this.state.skills, new Skill({name: skillName})];
            this.setState({skills: skills});
            await this.fetchData();
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
        }
    };

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
                let skills = Utils.editElement(this.state.skills, skill.id, skill) as Skill[];
                this.setState({skills: skills});
                await this.fetchData();
            } else if (error) {
                NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            }
        }
    };

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
                let skills = Utils.deleteElement(this.state.skills, skillId) as Skill[];
                this.setState({skills: skills});
                await this.fetchData();
            } else {
                NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            }
        }
    };
    //#endregion
}
