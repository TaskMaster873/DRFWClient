import {Employee} from "./Employee";

export interface DepartmentListState {
    employees: Employee[],
    employeeNbDepartments: number[],
    departments: Department[]
}

/**
 * Contient tous les renseignements des employés de l'application web
 */
export class Department {
    name: string;
    director: string;

    constructor(department: DepartmentCreateDTO) {
		this.name = department.name;
        this.director = department.director;
	}
}
/**
 * Contient tous les renseignements pour créer un nouveau département dans la bd
 */
export interface DepartmentCreateDTO {
	readonly name: string;
    readonly director: string;

}

export interface AddDepartmentProps {
    employees: Employee[];
    onDataChange: () => PromiseLike<void> | Promise<void> | void;
}

