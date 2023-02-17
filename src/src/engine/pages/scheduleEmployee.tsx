import React from "react";
import { Container } from "react-bootstrap";
import { ComponentScheduleCreate } from "../components/ComponentScheduleCreate";
import { ComponentEmployeScheduleView } from "../components/ComponentEmployeScheduleView";
import { Employee, EmployeeList } from "../types/Employee";
import { Shift } from "../types/Shift";
import { API } from "../api/APIManager";
import { ComponentLoading } from "../components/ComponentLoading";
/**
 * Page qui affiche l'horaire des employés
 */
export class Schedule extends React.Component {
    public state = {
        list: [],
    }

    public async componentDidMount() {
        document.title = "Horaire - TaskMaster";
        let shifts = await API.getScheduleForOneEmployee(); // pour get tout les heures de l'employé connecté
        this.setState({ list: shifts });

    }


    /***
     *
     * Envoie la liste des employés au ComponentSchedule
     *
     */
    public render(): JSX.Element {
        let listData: Shift[] = this.state.list;
        if (Array.isArray(listData)) {
            let length = listData.length;
            switch (length) {
                case 0: //quand la liste charge
                    return (
                        <ComponentLoading />
                    );
                default:
                    return (<ComponentEmployeScheduleView listOfShifts={listData} />);
            }
        } else {
            return (<div></div>);
        }



    }
}
