import React from "react";
import {Container} from "react-bootstrap";
import {ComponentSchedule} from "../components/ComponentSchedule";
import {Employee, EmployeeList} from "../types/Employee";

/**
 * Page qui affiche l'horaire des employés
 */
export class Schedule extends React.Component {
    private list: Employee[] = [ // Même liste que dans employeelist page
        new Employee({
            id: "",
            lastName: "Blanchet",
            firstName: "Stéphane",
            email: "stephane.blanchet@outlook.com",
            phoneNumber: "581-555-5555",
            departmentId: "",
            jobTitles: ["Gestionnaire de projet", "Directeur de production"],
            password: ""
        }), new Employee({
            id: "",
            lastName: "Blanchette",
            firstName: "Roger",
            email: "rogerBlanchette@gmail.com",
            phoneNumber: "581-555-2312",
            departmentId: "",
            jobTitles: ["Gestionnaire de projet", "Directeur de production"],
            password: ""
        }),];

    public componentDidMount() {
        document.title = "Horaire - TaskMaster";
    }

    /***
     *
     * Envoie la liste des employés au ComponentSchedule
     *
     */
    public render(): JSX.Element {
        let listData: EmployeeList = {list: this.list};
        return (<Container className="mt-5 mb-5">
                <ComponentSchedule {...listData} />
            </Container>);
    }
}
