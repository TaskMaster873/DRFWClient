import {Employee} from "./Employee";
import {FormErrorType} from "../messages/FormMessages";

export interface DepartmentListState {
    employees: Employee[],
    employeeNb: number[],
    departments: Department[]
}

/**
 * Contient tous les renseignements des employés de l'application web
 */
export class Department {
    public departmentId?: string;
    public name: string;
    public director: string;

    constructor(department: DepartmentDTO) {
        this.departmentId = department.departmentId;
		this.name = department.name;
        this.director = department.director;
	}
}

export let departmentTableHeads : string[] =
    ["#", "Nom", "Directeur/Gérant", "Nombre d'employés"];

/**
 * Contient tous les renseignements pour créer un nouveau département dans la bd
 */
export interface DepartmentCreateDTO {
	readonly name: string;
    readonly director: string;
}

export interface DepartmentDTO {
    readonly departmentId?: string;
    readonly name: string;
    readonly director: string;
}

export interface DepartmentListProps {
    employees: Employee[],
    employeeNb: number[],
    departments: Department[],
    onAddDepartment: (department) => PromiseLike<void> | Promise<void> | void;
    onEditDepartment: (department) => PromiseLike<void> | Promise<void> | void;
}


