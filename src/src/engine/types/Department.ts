import {Employee} from "./Employee";
import {IdElement} from "./Global";

export interface DepartmentsState {
    employees: Employee[];
    employeeNb: number[];
    departments: Department[];
    redirectTo: string | null;
}

export interface DepartmentListState {
    editedDepartment?: Department;
    departmentToDelete?: Department;
}

/**
 * Contient tous les renseignements des employés de l'application web
 */
export class Department implements IdElement {
    public id?: string;
    public name: string;
    public director: string;

    constructor(department: DepartmentDTO) {
        this.id = department.id;
        this.name = department.name;
        this.director = department.director;
    }
}

export let departmentTableHeads: string[] =
    ["#", "Nom", "Directeur/Gérant", "Nombre d'employés"];

export let departmentAdminTableHeads: string[] =
    ["#", "Nom", "Directeur/Gérant", "Nombre d'employés", "Actions"];

/**
 * Contient tous les renseignements pour créer un nouveau département dans la bd
 */
export interface DepartmentModifyDTO {
    readonly name: string;
    readonly director: string;
}

export interface DepartmentDTO {
    readonly id?: string;
    readonly name: string;
    readonly director: string;
}

export interface DepartmentListProps {
    employees: Employee[],
    employeeNb: number[],
    departments: Department[],
    onAddDepartment: (department: DepartmentModifyDTO) => PromiseLike<void> | Promise<void> | void;
    onEditDepartment: (departmentId: string, department: DepartmentModifyDTO, oldDepartmentName: string) => PromiseLike<void> | Promise<void> | void;
    onDeleteDepartment: (department: Department) => PromiseLike<void> | Promise<void> | void;
}


