import React from "react";
import {API} from "../api/APIManager";
import {
    AddEmployeeState,
    EmployeeEditDTO,
    EmployeeJobTitleList, EmployeeProps,
    EmployeeRoleList
} from "../types/Employee";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from 'react-notifications';
import {Department} from "../types/Department";
import {ComponentEditEmployee} from "../components/ComponentEditEmployee";
import {Params, useParams} from "react-router-dom";

export function EditEmployeeWrapper(): JSX.Element {
    let parameters: Readonly<Params<string>> = useParams();
    return (
        <EditEmployeeInternal  {...{params: parameters}}/>
    );
}

export class EditEmployeeInternal extends React.Component<EmployeeProps, AddEmployeeState> {
    public state: AddEmployeeState = {
        departments: [],
        roles: [],
        titles: [],
        editedEmployee: undefined
    }

    public async componentDidMount() : Promise<void> {
        document.title = "Modifier un Employé - TaskMaster";

        let departments = API.getDepartments();
        let roles = API.getRoles();
        let titles = API.getJobTitles();
        let editedEmployee;
        if(this.props.params.id) {
            editedEmployee = API.getEmployeeById(this.props.params.id);
        } else {
            NotificationManager.error(errors.INVALID_EMPLOYEE_ID_PARAMETER, errors.ERROR_GENERIC_MESSAGE);
        }

        let params: [
            Department[],
            EmployeeRoleList | string,
            EmployeeJobTitleList | string,
            EmployeeEditDTO | string | undefined
        ] = await Promise.all([departments, roles, titles, editedEmployee]);

        if(Array.isArray(params[0]) && Array.isArray(params[1]) && Array.isArray(params[2]) && params[3] && typeof(params[3]) !== "string") {
            this.setState({departments: params[0], roles: params[1], titles: params[2], editedEmployee: params[3]});
        } else {
            console.error(errors.GET_EDIT_EMPLOYEES);
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
                editedEmployee={this.state.editedEmployee}
                employeeId={this.props.params.id}
                onEditEmployee={this.#editEmployee}
            />
        );
    }
}
