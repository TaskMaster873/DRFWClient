import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {EventForShiftCreation, EventForShiftEdit} from "../types/Shift";
import {errors, FormErrorType} from '../messages/FormMessages';
import {EventManipulationType} from '../types/StatesForDaypilot';

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
};

export function ComponentPopupSchedule(props: Props) {
	const [validated, setValidated] = useState<boolean>(false);
	const [error, setError] = useState<FormErrorType>(FormErrorType.NO_ERROR);
	const [start, setStart] = useState<string | null>(null);
	const [end, setEnd] = useState<string | null>(null);
	const [disabled, setDisabled] = useState<boolean>(false);
	const min = DayPilot.Date.today();
	const max = min.addHours(23);

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
			switch (props.taskType) {
				case EventManipulationType.EDIT:
					await sendEditEvent();
					break;
				default:
					await sendCreateEvent();
					break;
			}
			closeModal();
		}
	};

	const sendCreateEvent = async () => {
		let eventToReturn: EventForShiftCreation = {
			employeeId: props.resource,
			start: start ?? props.start,
			end: end ?? props.end,
		};
		await props.eventAdd(eventToReturn);
	};

	const sendEditEvent = async () => {
		let eventToReturn: EventForShiftEdit = {
			id: props.id,
			employeeId: props.resource,
			start: start ?? props.start,
			end: end ?? props.end,
		};
		await props.eventEdit(eventToReturn);
	};

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
				<Modal.Title>{props.taskType} un quart de travail</Modal.Title>
			</Modal.Header>
			<Form onSubmit={(e) => handleSubmit(e)} validated={validated} data-error={error}>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Start moment</Form.Label>
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
						<Form.Label >End moment</Form.Label>
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

