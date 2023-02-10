import React from "react";
import {Container} from "react-bootstrap";
import {ComponentEmployeeList} from "../components/ComponentEmployeeList";
import {Employee, EmployeeList, EmployeeProps} from "../types/Employee";
import {API} from "../api/APIManager";

/**
 * Ceci est la page pour les employés
 */

export class Employees extends React.Component<EmployeeProps> {
    public state = {
        list: []
    }

    constructor(props: EmployeeProps) {
        super(props);
    }

    public async componentDidMount() {
        let employees = await API.getEmployees();
        this.setState({list: employees})
        document.title = "Employés -" + this.props.params.departement + "TaskMaster";
    }

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        return (<Container>
                <ComponentEmployeeList list={this.state.list} />
            </Container>);
    }
}
