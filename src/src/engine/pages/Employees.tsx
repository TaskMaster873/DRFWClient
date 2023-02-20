import React from "react";
import {Container} from "react-bootstrap";
import {ComponentEmployeeList} from "../components/ComponentEmployeeList";
import {Employee, EmployeeProps} from "../types/Employee";
import {API} from "../api/APIManager";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from 'react-notifications';
import {Params, useParams} from "react-router-dom";

export function EmployeeWrapper(): any {
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

        let employees : Employee[] = await API.getEmployees(this.props.params.id);
        this.setState({employees: employees});
    }

    /**
     * Used to deactivate an employee if the user clicks on the deactivate button
     * @param employeeObj {Employee} The employee to deactivate
     * @private
     * @return {Promise<void>} A promise that resolves when the employee is deactivated
     */
    readonly #deactivateEmployee = async(employeeObj: Employee) : Promise<void> => {
        let employeeId = employeeObj?.employeeId;

        if (employeeObj !== null && employeeObj) {
            let error = await API.deactivateEmployee(employeeId || null);
            if (!error) {
                NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_DEACTIVATED);

                let employees: Employee[] = this.state.employees;
                let employeeIndex = employees.findIndex(elem => elem.employeeId == employeeId);
                let employee = employees.find(elem => elem.employeeId == employeeId);
                if(employee && employeeIndex != -1) {
                    employee.isActive = false;
                    employees[employeeIndex] = employee;
                    this.setState({employees: employees});
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
            let employeeId = employeeObj.employeeId;
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_EDITED);

            let employees: Employee[] = this.state.employees;
            let employeeIndex = employees.findIndex(elem => elem.employeeId == employeeId);
            let employee = employees.find(elem => elem.employeeId == employeeId);
            if(employee && employeeIndex != -1) {
                employee.isActive = false;
                employees[employeeIndex] = employee;
                this.setState({employees: employees});
            }
        } else {
            NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
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
