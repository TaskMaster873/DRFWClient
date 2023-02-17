import React, {CSSProperties} from "react";
import {Nav, Table} from "react-bootstrap";
import {Department, DepartmentListProps, departmentTableHeads} from "../types/Department";
import {ComponentAddDepartment} from "./ComponentAddDepartment";
import {API} from "../api/APIManager";
import {LinkContainer} from "react-router-bootstrap";
import {ScaleLoader} from "react-spinners";
import {Roles} from "../types/Roles";

const override: CSSProperties = {
    display: 'flex', alignSelf: 'center', margin: '0 auto',
};

export class ComponentDepartmentList extends React.Component<DepartmentListProps> {
    public render(): JSX.Element {
        return (<div className="mt-5">
            <h3>Liste des départements</h3>
            <Table responsive bordered hover className="text-center">
                <thead>
                <tr key={"firstCol"}>
                    {departmentTableHeads.map((th) => (<th key={th}>{th}</th>))}
                </tr>
                </thead>
                <tbody>
                {this.departmentList()}
                </tbody>
            </Table>
            {this.renderAddDepartmentComponent()}
        </div>);
    }

    private departmentList(): JSX.Element[] {
        if (this.props.departments.length === 0) {
            return [<tr key={"noDepartment"}>
                <td colSpan={4}>
                    <div style={{height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ScaleLoader
                            color={"#A020F0"}
                            loading={true}
                            cssOverride={override}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                </td>
            </tr>];
        } else {
            return this.props.departments.map((department, index) => (<tr key={"secondCol" + index}>
                <td key={"no" + index}>{index + 1}</td>
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
                    {this.props.employeeNb[index]}
                </td>
            </tr>));
        }
    }

    private async onDataChange(department: Department): Promise<void> {
        if (this.props.onDataChange !== null && this.props.onDataChange) {
            await this.props.onDataChange(department);
        }
    }

    private renderAddDepartmentComponent(): JSX.Element | undefined {
        if (API.isAuth() && API.hasPermission(Roles.ADMIN)) {
            return (
                <ComponentAddDepartment employees={this.props.employees} onDataChange={this.onDataChange.bind(this)}/>);
        }
    }
}
