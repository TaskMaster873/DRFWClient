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
			nameOfEvent: "",
			colorOfEvent: "#FFFFFF",
			start: DayPilot.Date.today(),
			end: DayPilot.Date.now(),

		};
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.returnToTheCalendar = this.returnToTheCalendar.bind(this);
	}


	public onChange = () => {
		this.setState({ isShowed: !this.state.isShowed });
		console.log("la state = ", this.state);
	};

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

	public saveContent = (startTime: DayPilot.Date, endTime: DayPilot.Date, resourceId: string) => {
		console.log("le state doit avoir les 3 non null:", startTime, endTime, resourceId);
		this.setState({ start: startTime, end: endTime, resource: resourceId });
		console.log("la state après:", this.state.start);
		this.onChange();
	}
	private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		console.log("tu rentre dedans")
		const form = event.currentTarget;
		let isValid = form.checkValidity();
		console.log(event);
		//let errorType = FormErrorType.NO_ERROR;
		if (!isValid) {
			event.preventDefault();
			event.stopPropagation();
			console.log(event.target[0].value);
			this.onChange();
		}

		/* this.setState({
			 validated: true,
			 error: errorType,
		 });*/
	}

	handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {

		console.log("cela change", event.target.id, event.target.value)
		const target = event.target;
		const value = target.value;
		const name = target.id;

		if (!name) {
			throw new Error("Id is undefined for element in form.");

		}
		this.setState({
			[name]: value,
		});
		console.log(this.state);
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
									defaultValue="#563d7c"
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
}