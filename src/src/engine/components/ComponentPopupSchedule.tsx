import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { EventForCalendar } from "../types/Shift";

type Props = { isShowing: boolean, eventAdd: Function };
type State = { isShowed?: boolean, nameOfEvent?: string, colorOfEvent?: string, start?: DayPilot.Date, end?: DayPilot.Date, resource?: string }

export class ComponentPopupSchedule extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			isShowed: props.isShowing,
			nameOfEvent: "event",
			colorOfEvent: "#000000",
			start: DayPilot.Date.today(),
			end: DayPilot.Date.now(),

		};
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.returnToTheCalendar = this.returnToTheCalendar.bind(this);
	}

	public render(): JSX.Element {
		const show = this.state;
		return (
			<>
				<Modal show={this.state.isShowed} >
					<Modal.Header closeButton onClick={this.onChange}>
						<Modal.Title>Ajouter un corps de travail</Modal.Title>
					</Modal.Header>
					<Form onSubmit={this.handleSubmit}
						onChange={this.handleChange}>
						<Modal.Body>

							<Form.Group className="mb-3" controlId="nameOfEvent">
								<Form.Label>Nom du corps de travail </Form.Label>
								<Form.Control
									type="text"
									placeholder="corps de travail"
									autoFocus />
							</Form.Group>
							<Form.Group className="mb-3" controlId="colorOfEvent">
								<Form.Label >Color picker</Form.Label>
								<Form.Control
									type="color"
									defaultValue="#000000"
									title="Choose your color"
								/>
							</Form.Group>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={this.onChange} >
								Annuler
							</Button>
							<Button variant="primary" onClick={this.returnToTheCalendar} >
								Sauvegarder
							</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</>
		);
	}

	/**
	 * Cette méthode sert quand pour faire afficher ou non le popup
	 *
	 */
	public onChange = () => {
		this.setState({ isShowed: !this.state.isShowed });
		this.resetState();
		console.log("la state = ", this.state);
	};
	/**
	 * Remet les valeur par défaut
	 */
	private resetState() {
		this.setState({
			nameOfEvent: "event",
			colorOfEvent: "#000000"
		});
	}
	/**
	 * 
	 * Appelle le parent et envoie le corps de travail avec toutes les données en Event
	 * @returns EventForCalendar
	 */
	private returnToTheCalendar = () => {
		let eventToReturn: EventForCalendar = {
			id: 1,
			text: this.state.nameOfEvent,
			start: this.state.start,
			end: this.state.end,
			resource: this.state.resource,
			barColor: this.state.colorOfEvent,
		};
		console.log("eventCréé =", eventToReturn)
		this.props.eventAdd(eventToReturn);
		this.onChange();
	}

	/***
	 * Enregistre dans le state les données du parent
	 * @param startTime: la date en format DayPilot.Date du début du corps de travail.
	 * @param endTime: la date en format DayPilot.Date de la fin du corps de travail.
	 * @param resourceId: l'id de la rangée où le corps sera.
	 * 
	 */
	public saveContent = (startTime: DayPilot.Date, endTime: DayPilot.Date, resourceId: string) => {
		console.log("le state doit avoir les 3 non null:", startTime, endTime, resourceId);
		this.setState({ start: startTime, end: endTime, resource: resourceId });
		console.log("la state après:", this.state.start);
		this.onChange();
	}
	private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		const form = event.currentTarget;
		let isValid = form.checkValidity();
		if (!isValid) {
			event.preventDefault();
			event.stopPropagation();
			console.log(event.target[0].value);
			this.onChange();
		}
	}

	/**
	 * @param event élément html du formulaire qui a un changement
	 * @returns void
	 */
	handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
		//console.log("cela change", event.target.id, event.target.value)
		const target = event.target;
		const value = target.value;
		const name = target.id;

		if (!name) {
			throw new Error("Id is undefined for element in form.");

		}
		this.setState({
			[name]: value, // [name] = au nom de l'élémentHtml (même nom que l'élement dans le state)
		});
	}
}