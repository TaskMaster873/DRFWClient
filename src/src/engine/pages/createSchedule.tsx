import React from "react";
import { ComponentLoading } from "../components/ComponentLoading";
import { ComponentScheduleCreate } from "../components/ComponentScheduleCreate";
import { ShiftForEventCreation } from "../types/Shift"


export class CreateSchedule extends React.Component {
	private fakeListShift  = [{
		id: 1,
		start: "2023-03-06T16:00:00",
		end: "2023-03-06T17:00:00",
		resource: "R1",
	}];


	public state = {
		list:[],
	}

	public /*async*/ componentDidMount() {
		document.title = "Création d'horaire - TaskMaster";
		this.setState({list: this.fakeListShift});
		//let shifts = await API.getScheduleForOneEmployee(); // pour get tout les heures de l'employé connecté
		//this.setState({list: shifts});

	}
	public render(): JSX.Element {
		let listData = this.state.list;
        if (Array.isArray(listData)) {
            let length = listData.length;
            switch (length) {
                case 0: //quand la liste charge
                    return (
                        <ComponentLoading />
                    );
                default:
                    return (<ComponentScheduleCreate listFetchedFromApi={this.state.list} />);
            }
        } else {
            return (<div></div>);
        }
		
	}
}