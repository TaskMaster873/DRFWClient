import React from "react";
import {Container} from "react-bootstrap";
import {ComponentSchedule} from "../components/ComponentSchedule";
import {ComponentEmployeScheduleView} from "../components/ComponentEmployeScheduleView";
import {Employee, EmployeeList} from "../types/Employee";
import {Shift} from "../types/Shift";
import {API} from "../api/APIManager";
/**
 * Page qui affiche l'horaire des employés
 */
export class Schedule extends React.Component {
    public state = {
        list: [],
  }

  public async componentDidMount() {
    let shifts = await API.getScheduleForOneEmployee();
    console.log(shifts);
    this.setState({list: shifts})
    document.title = "Horaire - TaskMaster";
  }

    /***
     *
     * Envoie la liste des employés au ComponentSchedule
     *
     */
    public render(): JSX.Element {
        let listData: Shift[] = this.state.list;
        if(true) {
            return (<ComponentEmployeScheduleView listOfShifts={...listData}/>);
        } else {
            return (<Container className="mt-5 mb-5">

            <ComponentSchedule {...listData} />
        </Container>);
        }
       
    }
}
