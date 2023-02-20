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
        <Employees  {...{params: parameters}}/>
    );
}

/**
 * Page de liste les employés
 */
class Employees extends React.Component<EmployeeProps> {
    public state = {
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

    public async deactivateEmployee(employeeId: string) : Promise<void> {
        let error = await API.deactivateEmployee(employeeId);
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
                    onEditEmployee={this.deactivateEmployee.bind(this)}
                    onDeactivateEmployee={this.deactivateEmployee.bind(this)}
                />
            </Container>
        );
    }
}
