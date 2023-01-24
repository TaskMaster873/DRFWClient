export interface EmployeeList {
    list: string[];
}
export interface EmployeeObject {
    [key: string] : EmployeeList;
}