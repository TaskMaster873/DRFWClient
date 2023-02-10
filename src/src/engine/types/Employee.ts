
/**
 * Liste d'employé
 */
export interface EmployeeList {
    list : Employee[];
}

/**
 * Contient tous les renseignements des employés de l'application web
 */
export class Employee {
    lastName: string =  "";
    firstName: string = "";
    email: string = "";
    phoneNumber: string = "";
    isActive: boolean = true;
    departmentId: string = "";
    jobTitles: string[] = [];
    skills: string[] = [];
    role: string = "user";

    constructor(employee: EmployeeCreateDTO) {
		this.firstName = employee.firstName;
        this.lastName = employee.lastName;
        this.email = employee.email;
		this.phoneNumber = employee.phoneNumber;
        this.departmentId = employee.departmentId;
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
	readonly departmentId: string;
    readonly jobTitles: string[];
    readonly skills: string[];
    readonly role: string;
}

export interface EmployeeProps {
    params;
}
