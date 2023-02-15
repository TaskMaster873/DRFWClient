import React, {CSSProperties} from "react";
import {Nav, Table} from "react-bootstrap";
import {DepartmentListState} from "../types/Department";
import {ComponentAddDepartment} from "./ComponentAddDepartment";
import {API} from "../api/APIManager";
import {LinkContainer} from "react-router-bootstrap";
import {ScaleLoader} from "react-spinners";

const override: CSSProperties = {
    display: 'flex',
    alignSelf: 'center',
    margin: '0 auto',
};

export class ComponentDepartmentList extends React.Component {
    public state: DepartmentListState = {
        employees: [],
        employeeNbDepartments: [],
        departments: []
    }

    public componentDidMount() : void {
        document.title = "Liste des départements - TaskMaster";

        this.updateData();
    }

    private async updateData() : Promise<void> {
        // Concurrently fetch data
        let _employees = API.getEmployees();
        let departments = await API.getDepartments();

        if(Array.isArray(departments)) {
            let _employeeNb = API.getEmployeeNbDepartments(departments);

            let employees = await _employees;
            let employeeNb = await _employeeNb;

            if(Array.isArray(employees) && Array.isArray(employeeNb)) {
                this.setState({employees: employees, employeeNbDepartments: employeeNb, departments: departments});
            } else {
                console.error("Error while fetching employees or employeeNbDepartments", employees, employeeNb);
            }
        } else {
            console.error("Error while fetching departments", departments);
        }
    }

    private departmentList(): JSX.Element[] {
        if(this.state.departments.length === 0) {
            return [<tr key={"noDepartment"}><td colSpan={4}>
                <div style={{height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <ScaleLoader
                    color={"#A020F0"}
                    loading={true}
                    cssOverride={override}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                    </div>
            </td></tr>];
        } else {
            return this.state.departments.map((department, index) => (<tr key={"secondCol" + index}>
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
                <td key={"employeeNb " + index}>
                    {this.state.employeeNbDepartments[index]}
                </td>
            </tr>));
        }
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
                    <th key={"employeeNb"}>Nombre d'employés</th>
                </tr>
                </thead>
                <tbody>
                {this.departmentList()}
                </tbody>
            </Table>
            {this.renderAddDepartmentComponent()}
        </div>);
    }

    private async onDataChange(): Promise<void> {
        await this.updateData();
    }

    private renderAddDepartmentComponent(): JSX.Element | undefined {
        if (API.isAuth() && API.isAdmin) {
            return (<ComponentAddDepartment employees={this.state.employees} onDataChange={this.onDataChange.bind(this)}/>);
        }
    }
}
