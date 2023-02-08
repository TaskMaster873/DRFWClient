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
            lastName: "Blanchet",
            firstName: "Stéphane",
            phoneNumber: "581-555-5555",
            departmentId: "",
            jobTitles: ["Gestionnaire de projet", "Directeur de production"],
            skills: [],
            role: "Employee"
        }), new Employee({
            lastName: "Blanchette",
            firstName: "Roger",
            phoneNumber: "581-555-2312",
            departmentId: "",
            jobTitles: ["Gestionnaire de projet", "Directeur de production"],
            skills: [],
            role: "Employee"
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
