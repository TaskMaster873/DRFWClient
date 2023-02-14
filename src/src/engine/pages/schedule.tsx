import React from "react";
import {Container} from "react-bootstrap";
import {ComponentSchedule} from "../components/ComponentSchedule";
import {ComponentEmployeScheduleView} from "../components/ComponentEmployeScheduleView";
import {Employee, EmployeeList} from "../types/Employee";
import {Shift} from "../types/Shift";
import {API} from "../api/APIManager";
import { ComponentLoading } from "../components/ComponentLoading";
/**
 * Page qui affiche l'horaire des employés
 */
export class Schedule extends React.Component {
    public state = {
        list: [],
  }

  public async componentWillMount () {
    let shifts = await API.getScheduleForOneEmployee();
    console.log("ok",shifts);
    this.setState({list: shifts});
    document.title = "Horaire - TaskMaster";
  }


    /***
     *
     * Envoie la liste des employés au ComponentSchedule
     *
     */
    public render(): JSX.Element {
        let listData: Shift[] = this.state.list;
        let length = listData.length;
        console.log(length);
        switch(length){
            case 0:
              //Chargement pendant que verifyActionCode valide avec le serveur que le code est bon.
              return (
                 <ComponentLoading />
                );
            default :
                console.log("je retourne quelque chose", length);
                console.log(listData);
                return (<ComponentEmployeScheduleView listOfShifts={...listData}/>);
              //Le actionCode est invalide
        }
        /*if(listData.length > 0) {
            return (<ComponentEmployeScheduleView listOfShifts={...listData}/>);
        } else if(false) {
            return (<Container className="mt-5 mb-5">

            <ComponentSchedule {...listData} />
        </Container>);

        }else {
            return (
            <p>Vous n'avez aucun horaire</p>
            );
        }*/
       
    }
}
