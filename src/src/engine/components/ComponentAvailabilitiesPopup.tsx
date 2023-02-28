import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {RecursiveAvailabilities} from "../types/EmployeeAvailabilities";
import {errors, FormErrorType} from '../messages/FormMessages';
import {Timestamp} from "firebase/firestore";
import {DateManager} from '../utils/DateManager';

type Props = {
	availabilityAdd: (start?: Timestamp, end?: Timestamp) => Promise<void>;
	//eventEdit: (shiftEvent: EventForShiftEdit) => Promise<void>;
	hideModal: () => void;
	isShown: boolean;
	start: DayPilot.Date;
	end: DayPilot.Date;
};

export function ComponentAvailabilitiesPopup(props: Props) {
	const [validated, setValidated] = useState<boolean>(false);
	const [error, setError] = useState<FormErrorType>(FormErrorType.NO_ERROR);
	const [start, setStart] = useState<string | null>(null);
	const [end, setEnd] = useState<string | null>(null);
	const [disabled, setDisabled] = useState<boolean>(false);
	const min = DayPilot.Date.today().addDays(-2);
	const max = min.addDays(10);

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
		console.log(event);
		event.preventDefault();
		event.stopPropagation();

		setValidated(true);
		setError(errorType);

		if (errorType === FormErrorType.NO_ERROR) {
			setDisabled(true);
			props.availabilityAdd(DateManager.getFirebaseTimestamp(props.start), DateManager.getFirebaseTimestamp(props.end));
			closeModal();
		}
	};

	

	/**
	 * Send a shift edit object to the page
	 */
	const sendEditEvent = async () => {
		/*let eventToReturn: EventForShiftEdit = {
			id: props.id,
			employeeId: props.resource,
			start: start ?? props.start,
			end: end ?? props.end,
		};
		await props.eventEdit(eventToReturn);*/
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
	};

	return (
		<Modal show={props.isShown} >
			<Modal.Header closeButton onClick={() => closeModal()}>
				<Modal.Title>Les dates de commencement et de fin</Modal.Title>
			</Modal.Header>
			<Form onSubmit={(e) => handleSubmit(e)} validated={validated} data-error={error}>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Date de début</Form.Label>
						<Form.Control
							id="start"
							type="datetime-local"
							defaultValue={props.start}
							step="1800"
							min={min}
							max={max}
							onChange={(e) => {setStart(e.target.value);}}
						/>
						<Form.Control.Feedback type="invalid" id="invalidStartDate">
							{errors.INVALID_DATE}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label >Date de fin</Form.Label>
						<Form.Control
							id="end"
							type="datetime-local"
							defaultValue={props.end}
							step="1800"
							min={min}
							max={max}
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

