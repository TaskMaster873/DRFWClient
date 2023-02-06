
/**
 * Liste d'employé, comme dit dans le idm
 */
export interface EmployeeList {
    list : Employee[];
}

/**
 * Contient tout les renseignements des employés de l'application web
 */
export class Employee {
    id: string = "";
    lastName: string =  "";
    firstName: string = "";
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
        this.departmentId = employee.departmentId;
        this.jobTitles = employee.jobTitles;
	}
}
/**
 * Contient tout les renseignements pour créer un iduveau employé dans la bd
 */
export interface EmployeeCreateDTO {
    readonly id: string;
	readonly firstName: string;
    readonly lastName: string;
    readonly password: string;
	readonly phoneNumber: string;
	readonly departmentId: string;
    readonly jobTitles: string[];
}

export interface EmployeeProps {
    params;
}
