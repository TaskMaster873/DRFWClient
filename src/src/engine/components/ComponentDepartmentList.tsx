import React from "react";
import {Nav, Table} from "react-bootstrap";
import {DepartmentList} from "../types/Department";
import {ComponentAddDepartment} from "./ComponentAddDepartment";
import {API} from "../api/APIManager";
import {LinkContainer} from "react-router-bootstrap";

export class ComponentDepartmentList extends React.Component<DepartmentList> {
    public state = {
        employees: [],
    }
    constructor(props: DepartmentList) {
        super(props);
    }

    public async componentDidMount() {
        let employees = await API.getEmployees();
        this.setState({employees: employees})
        document.title = "Liste des départements - TaskMaster";
    }

    public render(): JSX.Element {
        return (<div className="mt-5">
            <h3>Liste des départements</h3>
            <Table responsive bordered hover>
                <thead>
                <tr key={"firstCol"}>
                    <th key={"no"}>#</th>
                    <th key={"name"}>Nom</th>
                    <th key={"director"}>Directeur(s)/Gérant(s)</th>
                </tr>
                </thead>
                <tbody>
                {this.props.departments.map((department, index) => (<tr key={"secondCol" + index}>
                    <td key={"no" + index}>{index}</td>
                    <td key={"name " + index}>
                        <LinkContainer
                            to={"/employees/" + department.name}>
                                <Nav.Link className="departmentName">
                                    {department.name}
                                </Nav.Link>
                        </LinkContainer>
                    </td>
                    <td key={"director " + index}>
                        {department.director ?? "-"}
                    </td>
                    <td key={"numberEmployees " + index}>
                        {department.director ?? ""}
                    </td>
                </tr>))}
                </tbody>
            </Table>
            {this.renderAddDepartmentComponent()}
        </div>);
    }

    private renderAddDepartmentComponent(): JSX.Element | undefined {
        if (API.isAuth() && API.isAdmin) {
            return (<ComponentAddDepartment employees={this.state.employees}/>);
        }
    }
}
