export interface EmployeeList {
    list : Employee[];
}

export class Employee {
    name: string =  "";
    firstName: string = "";
    phoneNumber: string = "";
    active: boolean = true;
    jobTitles: string[] = [];
    skills: string[] = [];
    role: string = "user";

    constructor(employee: EmployeeCreateDTO) {
		this.name = employee.name;
		this.firstName = employee.firstName;
		this.phoneNumber = employee.phoneNumber;
	}
}

export interface EmployeeCreateDTO {
	readonly name: string;
	readonly firstName: string;
	readonly phoneNumber: string;
}

