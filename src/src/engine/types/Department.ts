
/**
 * Liste d'employé, comme dit dans le nom
 */
export interface DepartmentList {
    list : Department[];
}

/**
 * Contient tous les renseignements des employés de l'application web
 */
export class Department {
    name: string =  "";

    constructor(department: DepartmentCreateDTO) {
		this.name = department.name;
	}
}
/**
 * Contient tous les renseignements pour créer un nouveau département dans la bd
 */
export interface DepartmentCreateDTO {
	readonly name: string;
}

