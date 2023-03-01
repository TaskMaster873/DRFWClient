import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {EventForShiftCreation, EventForShiftEdit} from "../types/Shift";
import {errors, FormErrorType} from '../messages/FormMessages';
import {EventManipulationType} from '../types/StatesForDaypilot';
import {Employee} from '../types/Employee';

type Props = {
	eventAdd: (shiftEvent: EventForShiftCreation) => Promise<void>;
	eventEdit: (shiftEvent: EventForShiftEdit) => Promise<void>;
	hideModal: () => void;
	isShown: boolean;
	id: string,
	start: DayPilot.Date;
	end: DayPilot.Date;
	resource: string;
	taskType: EventManipulationType;
	employees: Employee[];
};

export function ComponentPopupSchedule(props: Props) {
	const [validated, setValidated] = useState<boolean>(false);
	const [error, setError] = useState<FormErrorType>(FormErrorType.NO_ERROR);
	const [start, setStart] = useState<string | null>(null);
	const [end, setEnd] = useState<string | null>(null);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [employeeId, setEmployeeId] = useState<string | null>(null);

	/**
	 * Verify if the form is valid and if it is, it sends the data to the parent
	 * @param event {React.FormEvent<HTMLFormElement>}
	 * @returns {void}
	 */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		const form = event.currentTarget;
		let isValid = form.checkValidity();
		let errorType = FormErrorType.NO_ERROR;

		if (!isValid) {
			errorType = FormErrorType.INVALID_FORM;
		}

		event.preventDefault();
		event.stopPropagation();

		setValidated(true);
		setError(errorType);

		if (errorType === FormErrorType.NO_ERROR) {
			setDisabled(true);
			if (props.taskType === EventManipulationType.EDIT) {
				await sendEditEvent();
			} else {
				await sendCreateEvent();
			}
			closeModal();
		}
	};

	/**
	 * Sends a shift creation object to the page
	 */
	const sendCreateEvent = async () => {
		let eventToReturn: EventForShiftCreation = {
			employeeId: employeeId ?? props.resource,
			start: start ?? props.start,
			end: end ?? props.end,
		};
		await props.eventAdd(eventToReturn);
	};

	/**
	 * Send a shift edit object to the page
	 */
	const sendEditEvent = async () => {
		let eventToReturn: EventForShiftEdit = {
			id: props.id,
			employeeId: employeeId ?? props.resource,
			start: start ?? props.start,
			end: end ?? props.end,
		};
		await props.eventEdit(eventToReturn);
	};

	/**
	 * Hides the modal window and resets its data
	 */
	const closeModal = () => {
		props.hideModal();
		setDisabled(false);
		setValidated(false);
		setError(FormErrorType.NO_ERROR);
		setStart(null);
		setEnd(null);
		setEmployeeId(null);
	};

	return (
		<Modal show={props.isShown} >
			<Modal.Header closeButton onClick={() => closeModal()}>
				<Modal.Title>{props.taskType} un quart de travail</Modal.Title>
			</Modal.Header>
			<Form onSubmit={(e) => handleSubmit(e)} validated={validated} data-error={error}>
				<Modal.Body>
					<Form.Group className="mb-6">
						<Form.Label >Employé assigné</Form.Label>
						<Form.Select
							id="assignedEmployee"
							onChange={(e) => setEmployeeId(e.target.value)} 
							defaultValue={props.resource}
						>
							{props.employees.map((employee) => (
								<option 
									value={employee.employeeId} 
									key={employee.employeeId}
								>
									{employee.firstName} {employee.lastName}
								</option>
							))}
						</Form.Select>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Début du quart de travail</Form.Label>
						<Form.Control
							id="start"
							type="datetime-local"
							defaultValue={props.start}
							step="1800"
							onChange={(e) => {setStart(e.target.value);}}
						/>
						<Form.Control.Feedback type="invalid" id="invalidStartDate">
							{errors.INVALID_DATE}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label >Fin du quart de travail</Form.Label>
						<Form.Control
							id="end"
							type="datetime-local"
							defaultValue={props.end}
							step="1800"
							onChange={(e) => setEnd(e.target.value)}
						/>
						<Form.Control.Feedback type="invalid" id="invalidEndDate">
							{errors.INVALID_DATE}
						</Form.Control.Feedback>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => closeModal()} >
						Annuler
					</Button>
					<Button variant="primary" type="submit" disabled={disabled}>
						Sauvegarder
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

