
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
    id: string = "";
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
        this.id = employee.id;
		this.firstName = employee.firstName;
        this.lastName = employee.lastName;
		this.phoneNumber = employee.phoneNumber;
        this.email = employee.email;
        this.departmentId = employee.departmentId;
        this.jobTitles = employee.jobTitles;
	}
}
/**
 * Contient tous les renseignements pour créer un iduveau employé dans la bd
 */
export interface EmployeeCreateDTO {
    readonly id: string;
	readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
	readonly phoneNumber: string;
	readonly departmentId: string;
    readonly jobTitles: string[];
}

export interface EmployeeProps {
    params;
}
