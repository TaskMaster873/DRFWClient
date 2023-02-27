import React from "react";
import {Container} from "react-bootstrap";
import {ComponentEmployeeList} from "../components/ComponentEmployeeList";
import {Employee, EmployeeProps} from "../types/Employee";
import {API} from "../api/APIManager";
import {errors, successes} from "../messages/FormMessages";
import {Params, useParams} from "react-router-dom";
import {NotificationManager} from "../api/NotificationManager";

export function EmployeeWrapper(): JSX.Element {
    let parameters: Readonly<Params<string>> = useParams();
    return (
        <EmployeesInternal  {...{params: parameters}}/>
    );
}

interface EmployeeState {
    employees: Employee[] | null;
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
        employees: null
    }

    constructor(props: EmployeeProps) {
        super(props);
    }

    public async componentDidMount() {
        document.title = "Employés " + this.props.params.id + " - TaskMaster";

        let fetchedData = await API.getEmployees(this.props.params.id);
        if (typeof fetchedData === "string") {
            NotificationManager.error(errors.GET_EMPLOYEES, fetchedData);

            this.setState({
                employees: []
            });
        }
        else this.setState({employees: fetchedData as Employee[]});
    }

    /**
     * Used to deactivate an employee if the user clicks on the deactivate button
     * @private
     * @return {Promise<void>} A promise that resolves when the employee is deactivated
     * @param employee
     */
    readonly #changeEmployeeActivation = async(employee: Employee) : Promise<void> => {
        if (employee) {
            employee.isActive = !employee.isActive;

            let error = await API.changeEmployeeActivation(employee);
            if (!error) {
                let employees: Employee[] | null = this.state.employees;
                if(employees) {
                    let oldEmployee = employees.find(elem => elem.id == employee.id);

                    if(oldEmployee) {
                        oldEmployee.isActive = employee.isActive;

                        this.refreshList(oldEmployee, employees);

                        if(employee.isActive) {
                            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_ACTIVATED);
                        } else {
                            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_DEACTIVATED);
                        }
                    } else {
                        NotificationManager.error(errors.SERVER_ERROR, errors.EMPLOYEE_NOT_FOUND);
                    }
                } else {
                    NotificationManager.error(errors.SERVER_ERROR, errors.ERROR_GENERIC_MESSAGE);
                }
            } else {
                NotificationManager.error(error, errors.ERROR_GENERIC_MESSAGE);
            }
        } else {
            NotificationManager.error(errors.SERVER_ERROR, errors.ERROR_GENERIC_MESSAGE);
        }
    }

    private refreshList(employee: Employee, employees: Employee[]) {
        let employeeIndex = employees.findIndex(elem => elem.id == employee.id);
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
                    onEmployeeActivationChange={this.#changeEmployeeActivation}
                />
            </Container>
        );
    }
}
