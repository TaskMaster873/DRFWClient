export interface EmployeeList {
    list : Employee[];
}

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
		this.name = employee.name;
		this.firstName = employee.firstName;
		this.phoneNumber = employee.phoneNumber;
        this.manager = employee.manager;
        this.jobTitles = employee.jobTitles;
	}
}

export interface EmployeeCreateDTO {
	readonly name: string;
	readonly firstName: string;
	readonly phoneNumber: string;
	readonly manager: number;
    readonly jobTitles: string[];
}

