import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FormErrorType, constants} from "../messages/FormMessages";
import {Logger} from "../Logger";

/**
 *
 * Ceci est le composant pour ajouter les employés
 */
export class ComponentAddDepartement extends React.Component {
    private logger: Logger = new Logger(
        `ComponentAddDepartement`,
        `#20f6a4`,
        false
    );
    private jobTitles: string[] = [];
    private roles: string[] = [];
    private errorMessage = "";
    public state: {
        name?: string;
        validated?: boolean;
        error: FormErrorType;
    };

    constructor(props: { titles: string[]; roles: string[] }) {
        super(props);
        this.jobTitles = props.titles;
        this.roles = props.roles;
        this.state = {
            name: "",
            validated: false,
            error: FormErrorType.NO_ERROR
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render(): JSX.Element {
        return (
            <Form
                noValidate
                validated={this.state.validated}
                onSubmit={this.handleSubmit}
                onChange={this.handleChange}
                data-error={this.state.error}
            >
                <Row className="mb-3">
                    <Form.Group as={Col} md="3">
                        <Form.Label className="mt-3">Ajouter un département</Form.Label>
                        <Form.Control
                            id="nameAddEmployee"
                            required
                            type="text"
                            placeholder="Nom"
                        />
                        <Form.Control.Feedback type="invalid">
                            {constants.errorRequiredDepartementName}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button className="mb-3" variant="primary" type="submit">
                    Ajouter
                </Button>

                <div className="d-flex justify-content-center">
                    <Form.Text
                        className="text-muted"
                        id="loginErrorMsg"
                        aria-errormessage={this.errorMessage}
                    ></Form.Text>
                </div>
            </Form>
        );
    }

    private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        const form = event.currentTarget;
        let isValid = form.checkValidity();

        let errorType = FormErrorType.NO_ERROR;
        if (!isValid) {
            event.preventDefault();
            event.stopPropagation();

            errorType = FormErrorType.INVALID_FORM;
        }

        this.setState({
            validated: true,
            error: errorType,
        });
    }

    private handleChange(event: React.ChangeEvent<HTMLFormElement>): void {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.id;

        if (!name) {
            throw new Error("Id is undefined for element in form.");
        }

        this.setState({
            [name]: value,
        });
    }
}
