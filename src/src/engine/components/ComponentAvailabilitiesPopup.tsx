import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {errors, FormErrorType} from "../messages/FormMessages";

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
        let isValid = form.checkValidity() && areDatesValid();
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
            await props.availabilityAdd(start ?? props.start, end ?? props.end);
            closeModal();
        }
    };

    const areDatesValid = (): boolean => {
        return (start ?? props.start) < (end ?? props.end);
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
        <Modal show={!props.isShown}>
            <Modal.Header closeButton onClick={() => closeModal()}>
                <Modal.Title>Les dates de début et de fin</Modal.Title>
            </Modal.Header>
            <Form onSubmit={(e) => handleSubmit(e)} validated={validated && areDatesValid()} data-error={error}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Date de début</Form.Label>
                        <Form.Control
                            id="start"
                            type="date"
                            step="7"
                            isInvalid={!areDatesValid()}
                            defaultValue={props.start.toString("yyyy-MM-dd")}
                            onChange={(e) => {
                                setStart(new DayPilot.Date(e.target.value));
                            }}
                        />
                        <Form.Control.Feedback type="invalid" id="invalidStartDate">
                            {errors.INVALID_DATE}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date de fin</Form.Label>
                        <Form.Control
                            id="end"
                            type="date"
                            step="7"
                            isInvalid={!areDatesValid()}
                            defaultValue={props.end.toString("yyyy-MM-dd")}
                            onChange={(e) => setEnd(new DayPilot.Date(e.target.value))}
                        />
                        <Form.Control.Feedback type="invalid" id="invalidEndDate">
                            {errors.INVALID_DATE}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeModal()}>
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

