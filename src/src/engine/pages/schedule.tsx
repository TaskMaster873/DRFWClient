import React from "react";
import {Container} from "react-bootstrap";
import {ComponentSchedule} from "../components/ComponentSchedule";
import {Employee, EmployeeList} from "../types/Employee";

/**
 * Page qui affiche l'horaire des employés
 */
export class Schedule extends React.Component {
    private list: Employee[] = [];
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
