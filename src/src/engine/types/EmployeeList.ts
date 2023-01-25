export interface EmployeeList {
    list: string[];
}

export interface Employee {
    name: string,
    firstName: string,
    phoneNumber: string,
    active: boolean,
    jobTitle: string,
    skills: string
}


export interface EmployeeObject {
    [key: string] : EmployeeList;
}