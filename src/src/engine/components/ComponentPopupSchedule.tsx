import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

type Props = { isShowing: boolean };
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
	}

	public onChange = () => {
		this.setState({ isShowed: !this.state.isShowed });
		console.log("la state = ",this.state);
	};

	public saveContent = (event: React.FormEvent<HTMLFormElement>) => {
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
			//console.log(event.target.elements.username.value)
			//console.log(event.target.username.value)
			//console.log(this.inputNode.value)
			// errorType = FormErrorType.INVALID_FORM;
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
							<Form.Group
								className="mb-3"
								controlId="exampleForm.ControlTextarea1"
							>
								<Form.Label>input que je ne sais pas si on en aura besoin</Form.Label>
								<Form.Control
									type="text"
									placeholder=""
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
							<Button variant="primary" onClick={this.onChange} >
								Sauvegarder
							</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</>
		);
	}
}