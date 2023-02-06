import React from "react";
import { Container } from "react-bootstrap";
import { ComponentSchedule } from "../components/ComponentSchedule";
import { EmployeeList, Employee } from "../types/Employee";

/**
 * C'est la page qui sert à afficher les horaires
 */
export class Schedule extends React.Component {
    private list: Employee[] = [ // ceci est la même liste que dans employeelist page
    new Employee({
        id: "",
        lastName: "Blanchet",
        firstName: "Stéphane",
        phoneNumber: "581-555-5555",
        departmentId: "",
        jobTitles: ["Gestionnaire de projet", "Directeur de production"],
        password: ""
      }),
      new Employee({
        id: "",
        lastName: "Blanchette",
        firstName: "Roger",
        phoneNumber: "581-555-2312",
        departmentId: "",
        jobTitles: ["Gestionnaire de projet", "Directeur de production"],
        password: ""
      }),
    ];
    public componentDidMount() {
        document.title = "Horaire - TaskMaster";
    }

    /***
     *
     * Envoie la liste des employés au ComponentSchedule
     *
     */
    public render(): JSX.Element {
        let listData: EmployeeList = { list: this.list };
        return (
            <Container className="mt-5 mb-5">
                <ComponentSchedule {...listData} />
            </Container>
        );
    }
}
