import React from "react";
import {Container} from "react-bootstrap";
import {ComponentEmployeeList} from "../components/ComponentEmployeeList";
import {Employee, EmployeeList, EmployeeProps} from "../types/Employee";

/**
 * Ceci est la page pour les employés
 */

export class Employees extends React.Component<EmployeeProps, EmployeeProps> {
    private department_id: string = "";
    private list: Employee[] = [];

    constructor(props: EmployeeProps) {
        super(props);
    }

    public componentDidMount() {
        document.title = "Employés - TaskMaster";
    }

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        let listData: EmployeeList = {list: this.list};
        return (<Container>
                <ComponentEmployeeList {...listData} />
            </Container>);
    }
}
