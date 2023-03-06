import {Department} from "./Department";
import {Params} from "react-router-dom";
import {Skill} from "./Skill";
import {JobTitle} from "./JobTitle";

/**
 * Contient tous les renseignements des employés de l'application web
 */
export class Employee {
    public id?: string;
    public lastName: string;
    public firstName: string;
    public email: string;
    public phoneNumber: string;
    public isActive: boolean;
    public department: string;
    public jobTitles: string[];
    public skills: string[];
    public role: number;
    public hasChangedDefaultPassword: boolean;

    constructor(employee: EmployeeDTO) {
        this.id = employee.id;
        this.firstName = employee.firstName;
        this.lastName = employee.lastName;
        this.email = employee.email;
        this.isActive = employee.isActive;
        this.phoneNumber = employee.phoneNumber;
        this.department = employee.department;
        this.jobTitles = employee.jobTitles;
        this.skills = employee.skills;
        this.role = employee.role;
        this.hasChangedDefaultPassword = employee.hasChangedDefaultPassword;
	}
}

/**
 * Contient tous les renseignements pour créer un iduveau employé dans la bd
 */
export interface EmployeeCreateDTO {
	readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
	readonly phoneNumber: string;
    readonly isActive: boolean;
	readonly department: string;
    readonly jobTitles: string[];
    readonly skills: string[];
    readonly role: number;
    readonly hasChangedDefaultPassword: boolean;
}

export interface EmployeeDTO {
    readonly id?: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly phoneNumber: string;
    readonly isActive: boolean;
    readonly department: string;
    readonly jobTitles: string[];
    readonly skills: string[];
    readonly role: number;
    readonly hasChangedDefaultPassword: boolean;
}

export interface EmployeeEditDTO {
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber: string;
    readonly department: string;
    readonly jobTitles: string[];
    readonly skills: string[];
    readonly role: number;
    readonly hasChangedDefaultPassword?: boolean;
}

export const employeeAdminTableHeads : string[] =
    ["#", "Prénom", "Nom", "Adresse courriel", "Téléphone", "Département", "Actif", "Poste(s)", "Compétences", "Actions"];

export const employeeTableHeads : string[] =
    ["#", "Prénom", "Nom", "Adresse courriel", "Téléphone", "Département", "Actif", "Poste(s)", "Compétences"];

export interface EmployeeProps {
    params: Readonly<Params>;
}

export interface AddEmployeeProps extends SkillActions, JobTitleActions {
    departments: Department[];
    roles: string[];
    jobTitles: JobTitle[];
    skills: Skill[];
    onAddEmployee: (password : string, employee: EmployeeCreateDTO) => PromiseLike<void> | Promise<void> | void;
}

export interface SkillActions {
    onAddSkill: (skill: string) => PromiseLike<void> | Promise<void> | void;
    onEditSkill: (skill: Skill) => PromiseLike<void> | Promise<void> | void;
    onDeleteSkill: (skill: string) => PromiseLike<void> | Promise<void> | void;
}

export interface JobTitleActions {
    onAddJobTitle: (title: string) => PromiseLike<void> | Promise<void> | void;
    onEditJobTitle: (title: JobTitle) => PromiseLike<void> | Promise<void> | void;
    onDeleteJobTitle: (titleId: string) => PromiseLike<void> | Promise<void> | void;
}

export interface EditEmployeeProps extends JobTitleActions, SkillActions {
    departments: Department[];
    roles: string[];
    jobTitles: JobTitle[];
    skills: Skill[];
    employeeId?: string | null;
    editedEmployee: EmployeeEditDTO | undefined;
    onEditEmployee: (employeeId: string, employee: EmployeeEditDTO) => PromiseLike<void> | Promise<void> | void;
}

export type EmployeeRoleList = string[];
export type EmployeeJobTitleList = JobTitle[];
export type EmployeeSkillList = Skill[];

export interface AddEmployeeState {
    departments: Department[];
    roles: EmployeeRoleList;
    titles: EmployeeJobTitleList;
    skills: EmployeeSkillList;
    editedEmployee?: EmployeeEditDTO;
    redirectTo: string | null;
}

export interface EmployeeInfos {
    role: number;
    department: string;
    hasChangedDefaultPassword: boolean;
}
