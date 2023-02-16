import React from "react";
import {Container} from "react-bootstrap";
import {ComponentDepartmentList} from "../components/ComponentDepartmentList";
import {API} from "../api/APIManager";
import {Department, DepartmentListState} from "../types/Department";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from 'react-notifications';

/**
 * Ceci est la page pour les employés
 */
export class Departments extends React.Component {
    public state: DepartmentListState = {
        employees: [], employeeNbDepartments: [], departments: []
    }

    public async componentDidMount() {
        document.title = "Départements - TaskMaster";

        await this.fetchData();
    }

    public async fetchData() {
        let _employees = API.getEmployees();
        let departments = await API.getDepartments();

        if (Array.isArray(departments)) {
            let _employeeNb = API.getEmployeeNbDepartments(departments);

            let employees = await _employees;
            let employeeNb = await _employeeNb;
            if(Array.isArray(employees) && Array.isArray(employeeNb)) {
                this.setState({employees: employees, employeeNb: employeeNb, departments: departments});
            } else {
                console.error("Error while fetching employees or employeeNbDepartments", employees, employeeNb);
            }
        } else {
            console.error("Error while fetching departments", departments);
        }
    }

    public async addDepartment(department: Department) {
        let errorMessage = await API.createDepartment(department);
        if (!errorMessage) {
            NotificationManager.success(successes.successGenericMessage, successes.departmentCreated);
            let departments = this.state.departments;
            departments.push(department);
            this.setState({departments: departments});
        } else {
            NotificationManager.error(errorMessage, errors.errorGenericMessage);
        }
    }

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        return (<Container>
                <ComponentDepartmentList employees={this.state.employees}
                                         employeeNb={this.state.employeeNbDepartments}
                                         departments={this.state.departments}
                                         onDataChange={this.addDepartment.bind(this)}/>
            </Container>);
    }
}
