import React from "react";
import {Container} from "react-bootstrap";
import {ComponentEmployeeList} from "../components/ComponentEmployeeList";
import {EmployeeProps} from "../types/Employee";
import {API} from "../api/APIManager";

/**
 * Page de liste les employés
 */
export class Employees extends React.Component<EmployeeProps> {
    public state = {
        list: null
    }

    constructor(props: EmployeeProps) {
        super(props);
    }

    public async componentDidMount() {
        document.title = "Employés " + this.props.params.id + " - TaskMaster";

        let employees = await API.getEmployees(this.props.params.id);
        this.setState({list: employees});
    }

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        // ...
        let id: any = this.props.params.id;
        if(!id) {
            id = null;
        }
        return (<Container>
                <ComponentEmployeeList filteredList={null} list={this.state.list} department={id} />
            </Container>);
    }
}
