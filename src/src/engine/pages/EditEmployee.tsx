import React from "react";
import {API} from "../api/APIManager";
import {
    AddEmployeeState,
    EmployeeCreateDTO,
    EmployeeEditDTO,
    EmployeeJobTitleList,
    EmployeeRoleList
} from "../types/Employee";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from 'react-notifications';
import {Department} from "../types/Department";
import {ComponentEditEmployee} from "../components/ComponentEditEmployee";

export class EditEmployee extends React.Component<unknown, AddEmployeeState> {
    public state: AddEmployeeState = {
        departments: [],
        roles: [],
        titles: []
    }

    public async componentDidMount() : Promise<void> {
        document.title = "Modifier un Employé - TaskMaster";

        // TODO Add error handling
        let departments = API.getDepartments();
        let roles = API.getRoles();
        let titles = API.getJobTitles();

        let params: [
            Department[],
            EmployeeRoleList | string,
            EmployeeJobTitleList | string
        ] = await Promise.all([departments, roles, titles]);

        if(Array.isArray(params[0]) && Array.isArray(params[1]) && Array.isArray(params[2])) {
            this.setState({departments: params[0], roles: params[1], titles: params[2]});
        } else {
            console.error(errors.GET_DEPARTMENTS);
        }
    }

    /**
     * Edit an employee in the database
     * @param employeeId
     * @param employee {EmployeeCreateDTO} The employee to edit
     */
    readonly #editEmployee = async (employeeId: string, employee: EmployeeEditDTO) : Promise<void> => {
        let error = await API.editEmployee(employeeId, employee);
        if (!error) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_EDITED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    public render(): JSX.Element {
        return (
            <ComponentEditEmployee
                departments={this.state.departments}
                roles={this.state.roles}
                jobTitles={this.state.titles}
                onEditEmployee={this.#editEmployee}
            />
        );
    }
}
