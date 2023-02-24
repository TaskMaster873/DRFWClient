import React from "react";
import {ComponentAddEmployee} from "../components/ComponentAddEmployee";
import {API} from "../api/APIManager";
import {AddEmployeeState, EmployeeCreateDTO, EmployeeJobTitleList, EmployeeRoleList} from "../types/Employee";
import {errors, successes} from "../messages/FormMessages";
import {Department} from "../types/Department";
import {NotificationManager} from "../api/NotificationManager";

export class AddEmployee extends React.Component<unknown, AddEmployeeState> {
    public state: AddEmployeeState = {
        departments: [],
        roles: [],
        titles: []
    }

    public async componentDidMount() : Promise<void> {
        document.title = "Ajouter un Employé - TaskMaster";

        // TODO Add error handling
        let departments = API.getDepartments();
        let roles = API.getRoles();
        let titles = API.getJobTitles();

        let params: [
            Department[] | string,
            EmployeeRoleList | string,
            EmployeeJobTitleList | string
        ] = await Promise.all([departments, roles, titles]);

        console.log(params);

        if(Array.isArray(params[0]) && Array.isArray(params[1]) && Array.isArray(params[2])) {
            this.setState({departments: params[0], roles: params[1], titles: params[2]});
        } else {
            console.error(errors.GET_DEPARTMENTS);
        }
    }

    /**
     * Add an employee to the database
     * @param password {string} The password of the employee
     * @param employee {EmployeeCreateDTO} The employee to add
     */
    readonly #addEmployee = async (password : string, employee: EmployeeCreateDTO) : Promise<void> => {
        let error = await API.createEmployee(password, employee);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_CREATED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    public render(): JSX.Element {
        return (
            <ComponentAddEmployee
                departments={this.state.departments}
                roles={this.state.roles}
                jobTitles={this.state.titles}
                onAddEmployee={this.#addEmployee}
            />
        );
    }
}
