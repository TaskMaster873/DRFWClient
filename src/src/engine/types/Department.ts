
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
    id: string = "";
    name: string =  "";

    constructor(departement: DepartementCreateDTO) {
		this.name = departement.name;
	}
}
/**
 * Contient tous les renseignements pour créer un nouveau département dans la bd
 */
export interface DepartementCreateDTO {
	readonly name: string;
}

