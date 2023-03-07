import React from "react";
import {Form} from "react-bootstrap";
import {errors, FormErrorType} from "../messages/FormMessages";
import {DayPilot} from "@daypilot/daypilot-lite-react";


interface Props {
    currentDay: DayPilot.Date;
    changeDay: (day: DayPilot.Date) => void;
}

interface State {
    validated: boolean;
    error: FormErrorType;
}

/**
 * This component displays the form to select a date.
 */
export class SelectDate extends React.Component<Props, State> {
    public state: State = {
        validated: false,
        error: FormErrorType.NO_ERROR,
    };

    public render(): JSX.Element {
        return (
            <Form
                noValidate
                validated={this.state.validated}

                data-error={this.state.error}
            >
                <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        id="date"
                        type="date"
                        defaultValue={this.props.currentDay.toString("yyyy-MM-dd")}
                        onChange={(e) => {
                            this.#handleChange(e as React.ChangeEvent<HTMLInputElement>);
                        }}
                    />
                    <Form.Control.Feedback type="invalid" id="invalidDate">
                        {errors.INVALID_DATE}
                    </Form.Control.Feedback>
                </Form.Group>
            </Form>
        );
    }

    /**
     * Handles the change of the date.
     * @param event
     * @private
     * @return {Promise<void>}
     */
    readonly #handleChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        let errorType = FormErrorType.NO_ERROR;

        if (!isValid) {
            errorType = FormErrorType.INVALID_FORM;
        }

        this.setState({
            validated: true,
            error: errorType,
        });

        if (errorType === FormErrorType.NO_ERROR) {
            this.props.changeDay(new DayPilot.Date(event.currentTarget.value));
        }
    };
}
