import React from "react";
import {Container} from "react-bootstrap";
import {ComponentEmployeeList} from "../components/ComponentEmployeeList";
import {Employee} from "../types/Employee";
import {API} from "../api/APIManager";
import {errors, successes} from "../messages/FormMessages";
import {Navigate, Params, useParams} from "react-router-dom";
import {NotificationManager} from "../api/NotificationManager";
import {Roles} from "../types/Roles";
import {RoutesPath} from "../RoutesPath";

export function EmployeeWrapper(): JSX.Element {
    const parameters: Readonly<Params<string>> = useParams();
    return (
        <EmployeesInternal  {...{params: parameters}}/>
    );
}

interface EmployeeState {
    employees: Employee[] | null;
    redirectTo: string | null;

}

interface EmployeesProps {
    params: Readonly<Params>;
}

/**
 * This is the page for the employees
 * @param props {EmployeesProps} The props for the page
 * @constructor
 * @return {JSX.Element} The page
 * @category Pages
 * @subcategory Employee
 * @hideconstructor
 * @see EmployeeProps
 * @see Employee
 */
class EmployeesInternal extends React.Component<EmployeesProps, EmployeeState> {
    public state: EmployeeState = {
        employees: null,
        redirectTo: null
    };

    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    public async componentDidMount(): Promise<void> {
        document.title = "Employés " + this.props.params.id + " - TaskMaster";

        let isLoggedIn: boolean = await this.verifyLogin();

        if (isLoggedIn) {
            await this.fetchData();
        } else {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
        }
    }

    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (
                <Navigate to={this.state.redirectTo}></Navigate>
            );
        }
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

    private async onEvent(): Promise<void> {
        await this.verifyLogin();
    }

    /**
     * Get the employees from the database and set the state of the component.
     * Display a notification to the user if the operation was successful or not.
     * @returns {Promise<void>}
     */
    private async fetchData(): Promise<void> {
        const fetchedData: Employee[] | string = await API.getEmployees(this.props.params.id);
        if (typeof fetchedData === "string") {
            NotificationManager.error(errors.GET_EMPLOYEES, fetchedData);
            this.setState({
                employees: []
            });
        } else {
            this.setState({employees: fetchedData as Employee[]});
        }
    }

    /**
     * Used to deactivate an employee if the user clicks on the deactivate button
     * @private
     * @return {Promise<void>} A promise that resolves when the employee is deactivated
     * @param employee
     */
    readonly #changeEmployeeActivation = async (employee: Employee): Promise<void> => {
        employee.isActive = !employee.isActive;
        const error = await API.changeEmployeeActivation(employee);

        if (error) {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            return;
        }

        const employees = this.state.employees;

        if (!employees) {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, errors.SERVER_ERROR);
            return;
        }

        const oldEmployee = employees.find((elem: Employee) => elem.id === employee.id);

        if (!oldEmployee) {
            NotificationManager.error(errors.SERVER_ERROR, errors.EMPLOYEE_NOT_FOUND);
            return;
        }

        oldEmployee.isActive = employee.isActive;
        this.refreshList(oldEmployee, employees);

        if (employee.isActive) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_ACTIVATED);
        } else {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_DEACTIVATED);
        }
    };

    /**
     * Verify if the user is logged in
     * @private
     */
    private async verifyLogin(): Promise<boolean> {
        let isLoggedIn: boolean = false;
        await API.awaitLogin;

        let hasPerms = API.hasPermission(Roles.EMPLOYEE);
        if (!API.isAuth() || !hasPerms) {
            this.setState({
                redirectTo: RoutesPath.INDEX
            });
        } else {
            isLoggedIn = true;
        }

        return isLoggedIn;
    }

    /**
     * Used to refresh the list of employees
     * @param employee {Employee} The employee to refresh
     * @param employees {Employee[]} The list of employees
     * @private
     * @return {void}
     */
    private refreshList(employee: Employee, employees: Employee[]): void {
        const employeeIndex = employees.findIndex(elem => elem.id == employee.id);
        if (employee && employeeIndex != -1) {
            employees[employeeIndex] = employee;
            this.setState({employees: employees});
        }
    }
}
