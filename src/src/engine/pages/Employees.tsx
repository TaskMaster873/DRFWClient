import React from "react";
import {Container} from "react-bootstrap";
import {ComponentEmployeeList} from "../components/ComponentEmployeeList";
import {Employee, EmployeeProps} from "../types/Employee";
import {API} from "../api/APIManager";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from 'react-notifications';
import {Params, useParams} from "react-router-dom";

export function EmployeeWrapper(): JSX.Element {
    let parameters: Readonly<Params<string>> = useParams();
    return (
        <EmployeesInternal  {...{params: parameters}}/>
    );
}

interface EmployeeState {
    employees: Employee[];
}

/**
 * This is the page for the employees
 * @param props {EmployeeProps} The props for the page
 * @constructor
 * @return {JSX.Element} The page
 * @category Pages
 * @subcategory Employee
 * @hideconstructor
 * @see EmployeeProps
 * @see Employee
 */
class EmployeesInternal extends React.Component<EmployeeProps, EmployeeState> {
    public state: EmployeeState = {
        employees: []
    }

    constructor(props: EmployeeProps) {
        super(props);
    }

    public async componentDidMount() {
        document.title = "Employés " + this.props.params.id + " - TaskMaster";

        let fetchedData = await API.getEmployees(this.props.params.id);
        if (typeof fetchedData === "string") {
            NotificationManager.error(errors.GET_EMPLOYEES, fetchedData);
            this.setState({employees: []});
        }
        else this.setState({employees: fetchedData as Employee[]});
    }

    /**
     * Used to deactivate an employee if the user clicks on the deactivate button
     * @private
     * @return {Promise<void>} A promise that resolves when the employee is deactivated
     * @param employeeId
     */
    readonly #deactivateEmployee = async(employeeId: string | undefined) : Promise<void> => {
        if (employeeId) {
            let error = await API.deactivateEmployee(employeeId);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_DEACTIVATED);

                let employees: Employee[] = this.state.employees;
                let employee = employees.find(elem => elem.employeeId == employeeId);
                if(employee) {
                    employee.isActive = false;
                    this.refreshList(employee, employees);
                }
            }
        } else {
            NotificationManager.error(errors.SERVER_ERROR, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    /**
     * Used to edit an employee if the user clicks on the edit button
     * @param employeeObj {Employee} The employee to edit
     * @private
     * @return {Promise<void>} A promise that resolves when the employee is edited
     */
    readonly #onEditEmployee = async (employeeObj: Employee) : Promise<void> => {
        let error = await API.editEmployee(employeeObj);
        if (!error) {
            let employees: Employee[] = this.state.employees;
            this.refreshList(employeeObj, employees);
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_EDITED);
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    private refreshList(employee: Employee, employees: Employee[]) {
        let employeeIndex = employees.findIndex(elem => elem.employeeId == employee.employeeId);
        if (employee && employeeIndex != -1) {
            employees[employeeIndex] = employee;
            this.setState({employees: employees});
        }
    }

    public render(): JSX.Element {
        return (
            <Container>
                <ComponentEmployeeList
                    filteredList={null}
                    employees={this.state.employees}
                    department={this.props.params.id}
                    onEditEmployee={this.#onEditEmployee}
                    onDeactivateEmployee={this.#deactivateEmployee}
                />
            </Container>
        );
    }
}
