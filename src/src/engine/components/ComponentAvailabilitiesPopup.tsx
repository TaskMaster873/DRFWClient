import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {errors, FormErrorType} from '../messages/FormMessages';

type Props = {
	availabilityAdd: (start: DayPilot.Date, end: DayPilot.Date) => Promise<void>;
	//eventEdit: (shiftEvent: EventForShiftEdit) => Promise<void>;
	hideModal: (hide: boolean) => void;
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
			props.availabilityAdd(start ?? props.start, end ?? props.end);
			closeModal();
		}
	};


	/**
	 * Hides the modal window and resets its data
	 */
	const closeModal = () => {
		props.hideModal(true);
		setDisabled(false);
		setValidated(false);
		setError(FormErrorType.NO_ERROR);
		setStart(null);
		setEnd(null);
	};

	return (
		<Modal show={!props.isShown} >
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

