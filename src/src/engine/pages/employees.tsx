import React from "react";
import {Container} from "react-bootstrap";
import {ComponentEmployeeList} from "../components/ComponentEmployeeList";
import {Employee, EmployeeProps} from "../types/Employee";
import {API} from "../api/APIManager";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from 'react-notifications';


/**
 * Page de liste les employés
 */
export class Employees extends React.Component<EmployeeProps> {
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

    public async deactivateEmployee(employeeId: string) {
        let error = await API.deactivateEmployee(employeeId);
        let employees: Employee[] = this.state.employees;
        let employee = employees.find(elem => elem.employeeId == employeeId);
        if (!error) {
            NotificationManager.success(successes.successGenericMessage, successes.employeeDeactivated);
        } else {
            NotificationManager.error(error, errors.errorGenericMessage);
        }
    }

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        let id: any = this.props.params.id;
        if (!id) {
            id = null;
        }
        return (<Container>
            <ComponentEmployeeList filteredList={null} employees={this.state.employees} department={id}
                                   onEditEmployee={this.deactivateEmployee.bind(this)} onDeactivateEmployee={this.deactivateEmployee.bind(this)}/>
        </Container>);
    }
}
