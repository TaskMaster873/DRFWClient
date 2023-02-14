import {Employee} from "./Employee";

/**
 * Liste d'employé, comme dit dans le nom
 */
export interface DepartmentList {
    departments : Department[];
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
}

