import React from "react";
import {Container} from "react-bootstrap";
import {ComponentEmployeeList} from "../components/ComponentEmployeeList";
import {Employee, EmployeeList, EmployeeProps} from "../types/Employee";
import {API} from "../api/APIManager";

/**
 * Page de liste les employés
 */
export class Employees extends React.Component<EmployeeProps> {
    public state = {
        list: []
    }

    constructor(props: EmployeeProps) {
        super(props);
    }

    public async componentDidMount() {
        let employees = await API.getEmployeesByDepartment(this.props.params.id);
        this.setState({list: employees})
        document.title = "Employés " + this.props.params.id + " - TaskMaster";
    }

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        return (<Container>
                <ComponentEmployeeList list={this.state.list} department={this.props.params.id} />
            </Container>);
    }
}
