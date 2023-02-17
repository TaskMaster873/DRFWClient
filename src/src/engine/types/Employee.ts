import {Department} from "./Department";
import {Params} from "react-router-dom";

/**
 * Liste d'employé
 */
export interface EmployeeList {
    list : Employee[];
}

export interface EmployeeDTO {
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    department: string;
    jobTitles: string[];
    skills: string[];
    role: number;
}

/**
 * Contient tous les renseignements des employés de l'application web
 */
export class Employee {
    employeeId?: string = "";
    lastName: string =  "";
    firstName: string = "";
    email: string = "";
    phoneNumber: string = "";
    isActive: boolean = true;
    department: string = "";
    jobTitles: string[] = [];
    skills: string[] = [];
    role: number = 0;

    constructor(employee: EmployeeCreateDTO) {
        this.employeeId = employee.employeeId;
		this.firstName = employee.firstName;
        this.lastName = employee.lastName;
        this.email = employee.email;
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
    readonly employeeId?: string;
	readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
	readonly phoneNumber: string;
	readonly department: string;
    readonly jobTitles: string[];
    readonly skills: string[];
    readonly role: number;
}

export let employeeTableHeads : string[] =
    ["#", "Prénom", "Nom", "Adresse courriel", "Téléphone", "Département", "Actif", "Poste(s)", "Compétences", "Actions"];

export interface EmployeeProps {
    params: Readonly<Params>;
}

export interface EmployeeListProps {
    employees: Employee[] | null;
    filteredList: Employee[] | null;
    department: string | null;
}

export interface AddEmployeeProps {
    departments: Department[];
    roles: string[];
    jobTitles: string[];
    onDataChange: (password, employee) => PromiseLike<void> | Promise<void> | void;
}
