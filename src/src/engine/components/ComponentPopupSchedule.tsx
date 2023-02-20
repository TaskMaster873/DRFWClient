import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {EventForCalendar, EventForShiftCreation} from "../types/Shift";
type Props = { isShowing: boolean, eventAdd: any, start: DayPilot.Date, end: DayPilot.Date, resource: string};

export function ComponentPopupSchedule(props: Props) {
	const start = props.start
	const end = props.end
	const resource = props.resource

	/**
	 * Verify if the form is valid and if it is, it sends the data to the parent
	 * @param event {React.FormEvent<HTMLFormElement>}
	 * @returns {void}
	 */
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
		const form = event.currentTarget;
		let isValid = form.checkValidity();

		if (!isValid) {
			event.preventDefault();
			event.stopPropagation();
			console.log(event.target[0].value);
		}
	}

	/**
	 *
	 * Appelle le parent et envoie le corps de travail avec toutes les données en Event
	 * @returns EventForCalendar
	 */
	const returnToTheCalendar = () => {
		let eventToReturn: EventForShiftCreation = {
			employeeId: resource,
			start: start,
			end: end,
		};
		console.log("eventCréé =", eventToReturn)
		props.eventAdd(eventToReturn);
	}

	return (
		<Modal show={props.isShowing} >
			<Modal.Header closeButton onClick={() => {}}>
				<Modal.Title>Ajouter un corps de travail</Modal.Title>
			</Modal.Header>
			<Form onSubmit={(e) => handleSubmit(e)}>
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
					<Button variant="secondary" onClick={() => props.isShowing = false} >
						Annuler
					</Button>
					<Button variant="primary" onClick={() => returnToTheCalendar()} >
						Sauvegarder
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

