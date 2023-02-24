import React from "react";
import {Container} from "react-bootstrap";
import {ComponentDepartmentList} from "../components/ComponentDepartmentList";
import {API} from "../api/APIManager";
import {Department, DepartmentListState} from "../types/Department";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";

/**
 * Ceci est la page pour les departments
 */
export class Departments extends React.Component<unknown, DepartmentListState> {
    public state: DepartmentListState = {
        employees: [],
        employeeNb: [],
        departments: []
    }

    public async componentDidMount() : Promise<void> {
        document.title = "Départements - TaskMaster";

        await this.fetchData();
    }

    public async fetchData() : Promise<void> {
        let _employees = API.getEmployees();
        let departments = await API.getDepartments();

        if (Array.isArray(departments)) {
            let _employeeNb = API.getEmployeeNbDepartments(departments);

            let employees = await _employees;
            let employeeNb = await _employeeNb;
            if(Array.isArray(employees) && Array.isArray(employeeNb)) {
                this.setState({employees: employees, employeeNb: employeeNb, departments: departments});
            } else {
                console.error(errors.GET_EMPLOYEES, employees, employeeNb);
            }
        } else {
            console.error(errors.GET_DEPARTMENTS, departments);
        }
    }

    public addDepartment = async (department: Department) : Promise<void> => {
        let errorMessage = await API.createDepartment(department);
        if (!errorMessage) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.DEPARTMENT_CREATED);

            let departments = this.state.departments;
            let employeeNb = this.state.employeeNb;

            this.setState({departments: departments, employeeNb: employeeNb});
            await this.fetchData();
        } else {
            NotificationManager.error(errorMessage, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    public editDepartment = async (department: Department) : Promise<void> => {
        let errorMessage = await API.editDepartment(department);
        if (!errorMessage) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.DEPARTMENT_CREATED);
            let departments = this.state.departments;
            let oldDepartment = departments.find(elem => elem.departmentId == department.departmentId);
            if(oldDepartment) {
                let employeeIndex = departments.findIndex(elem => elem.departmentId == department.departmentId);
                if (department && employeeIndex != -1) {
                    departments[employeeIndex] = department;
                    this.setState({departments: departments});
                }
            }
            departments.push(department);
            this.setState({departments: departments});
            await this.fetchData();
        } else {
            NotificationManager.error(errorMessage, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        return (
            <Container>
                <ComponentDepartmentList employees={this.state.employees}
                                         employeeNb={this.state.employeeNb}
                                         departments={this.state.departments}
                                         onAddDepartment={this.addDepartment}
                                        onEditDepartment={this.editDepartment}/>
            </Container>
        );
    }
}
