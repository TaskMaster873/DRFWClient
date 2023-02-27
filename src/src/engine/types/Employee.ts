import {Department} from "./Department";
import {Params, useParams} from "react-router-dom";

/**
 * Liste d'employé
 */
export interface StateEmployeeList {
    list : Employee[];
}

/**
 * Contient tous les renseignements des employés de l'application web
 */
export class Employee {
    public employeeId?: string;
    public lastName: string;
    public firstName: string;
    public email: string;
    public phoneNumber: string;
    public isActive?: boolean = true;
    public department: string;
    public jobTitles: string[];
    public skills: string[];
    public role: number;

    constructor(employee: EmployeeDTO) {
        this.employeeId = employee.employeeId;
		this.firstName = employee.firstName;
        this.lastName = employee.lastName;
        this.email = employee.email;
        this.isActive = employee.isActive;
		this.phoneNumber = employee.phoneNumber;
        this.department = employee.department;
        this.jobTitles = employee.jobTitles;
        this.skills = employee.skills;
        this.role = employee.role;
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
	readonly department: string;
    readonly jobTitles: string[];
    readonly skills: string[];
    readonly role: number;
}

export interface EmployeeDTO {
    readonly employeeId?: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly phoneNumber: string;
    readonly isActive: boolean;
    readonly department: string;
    readonly jobTitles: string[];
    readonly skills: string[];
    readonly role: number;
}


export interface EmployeeEditDTO {
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber: string;
    readonly department: string;
    readonly jobTitles: string[];
    readonly skills: string[];
    readonly role: number;
}

export let employeeAdminTableHeads : string[] =
    ["#", "Prénom", "Nom", "Adresse courriel", "Téléphone", "Département", "Actif", "Poste(s)", "Compétences", "Actions"];

export let employeeTableHeads : string[] =
    ["#", "Prénom", "Nom", "Adresse courriel", "Téléphone", "Département", "Actif", "Poste(s)", "Compétences"];

export interface EmployeeProps {
    params: Readonly<Params>;
}

export interface EmployeeListProps {
    employees: Employee[] | null;
    filteredList: Employee[] | null;
    department?: string | null;
    onEmployeeActivationChange: (employee: Employee) => PromiseLike<void> | Promise<void> | void;
}

export interface EmployeeListState {
    filteredList: Employee[] | null;
}

export interface AddEmployeeProps {
    departments: Department[];
    roles: string[];
    jobTitles: string[];
    skills: string[];
    onAddEmployee: (password : string, employee: EmployeeCreateDTO) => PromiseLike<void> | Promise<void> | void;
    onAddJobTitle: (title: string) => PromiseLike<void> | Promise<void> | void;
}

export interface EditEmployeeProps {
    departments: Department[];
    roles: string[];
    jobTitles: string[];
    employeeId?: string | null;
    editedEmployee: EmployeeEditDTO | undefined;
    onEditEmployee: (employeeId: string, employee: EmployeeEditDTO) => PromiseLike<void> | Promise<void> | void;
    onAddJobTitle: (employeeId: string, employee: EmployeeEditDTO) => PromiseLike<void> | Promise<void> | void;

}

export type EmployeeRoleList = string[];
export type EmployeeJobTitleList = string[];
export type EmployeeSkillList = string[];

export interface AddEmployeeState {
    departments: Department[];
    roles: EmployeeRoleList;
    titles: EmployeeJobTitleList;
    skills: EmployeeSkillList;
    editedEmployee?: EmployeeEditDTO;
    redirectTo: string | null;
}
