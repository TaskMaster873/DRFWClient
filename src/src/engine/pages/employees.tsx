import React from "react";
import { Container } from "react-bootstrap";
import { ComponentEmployeeList } from "../components/ComponentEmployeeList";
import { EmployeeList, Employee, EmployeeProps } from "../types/Employee";

/**
 * Ceci est la page pour les employés
 */

export class Employees extends React.Component<EmployeeProps, EmployeeProps> {
  private department_id : string = "";
  constructor(props: EmployeeProps) {
    super(props);
    console.log(this.props.params);
  }

  private list: Employee[] = [
    new Employee({
      id: "",
      lastName: "Blanchet",
      firstName: "Stéphane",
      phoneNumber: "581-555-5555",
      departmentId: this.department_id,
      jobTitles: ["Gestionnaire de projet", "Directeur de production"],
      password: ""
    }),
    new Employee({
      id: "",
      lastName: "Blanchette",
      firstName: "Roger",
      phoneNumber: "581-555-2312",
      departmentId: this.department_id,
      jobTitles: ["Gestionnaire de projet", "Directeur de production"],
      password: ""
    }),
  ];

    public componentDidMount() {
        document.title = "Employés - TaskMaster";
    }

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        let listData: EmployeeList = { list: this.list };
        return (
            <Container>
                <ComponentEmployeeList {...listData} />
            </Container>
        );
    }
}
