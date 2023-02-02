
/**
 * Liste d'employé, comme dit dans le nom
 */
export interface EmployeeList {
    list : Employee[];
}

/**
 * Contient tout les renseignements des employés de l'application web
 */
export class Employee {
    no: number = 0;
    name: string =  "";
    firstName: string = "";
    phoneNumber: string = "";
    active: boolean = true;
    manager: number = 0;
    jobTitles: string[] = [];
    skills: string[] = [];
    role: string = "user";

    constructor(employee: EmployeeCreateDTO) {
        this.no = employee.no;
		this.name = employee.name;
		this.firstName = employee.firstName;
		this.phoneNumber = employee.phoneNumber;
        this.manager = employee.manager;
        this.jobTitles = employee.jobTitles;
	}
}
/**
 * Contient tout les renseignements pour créer un nouveau employé dans la bd
 */
export interface EmployeeCreateDTO {
    readonly no: number;
	readonly name: string;
	readonly firstName: string;
	readonly phoneNumber: string;
	readonly manager: number;
    readonly jobTitles: string[];
}

export interface EmployeeProps {
    params : any;
}

