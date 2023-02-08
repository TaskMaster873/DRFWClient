
/**
 * Liste d'employé, comme dit dans le nom
 */
export interface DepartmentList {
    list : Department[];
}

/**
 * Contient tout les renseignements des employés de l'application web
 */
export class Department {
    id: string = "";
    name: string =  "";

    constructor(departement: DepartementCreateDTO) {
        this.id = departement.id;
		this.name = departement.name;
	}
}
/**
 * Contient tout les renseignements pour créer un nouveau employé dans la bd
 */
export interface DepartementCreateDTO {
	readonly id: string;
	readonly name: string;
}

