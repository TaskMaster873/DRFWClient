
/**
 * Liste d'employé, comme dit dans le nom
 */
export interface DepartementList {
    list : Departement[];
}

/**
 * Contient tout les renseignements des employés de l'application web
 */
export class Departement {
    no: number = 0;
    name: string =  "";

    constructor(departement: DepartementCreateDTO) {
        this.no = departement.no;
		this.name = departement.name;
	}
}
/**
 * Contient tout les renseignements pour créer un nouveau employé dans la bd
 */
export interface DepartementCreateDTO {
	readonly no: number;
	readonly name: string;
}

