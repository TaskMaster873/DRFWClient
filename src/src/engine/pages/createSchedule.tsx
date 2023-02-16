import React from "react";
import { ComponentScheduleCreate } from "../components/ComponentScheduleCreate";


export class CreateSchedule extends React.Component {
	public state = {
		list: [],
	}

	public /*async*/ componentDidMount() {
		document.title = "Création d'horaire - TaskMaster";
		//let shifts = await API.getScheduleForOneEmployee(); // pour get tout les heures de l'employé connecté
		//this.setState({list: shifts});

	}
	public render(): JSX.Element {
		return (<ComponentScheduleCreate />);
	}
}