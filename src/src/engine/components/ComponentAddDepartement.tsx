import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LoginFormErrorType } from "../errors/LoginFormErrorType";
import { constants } from "../../../Constants/Constants";
import { Logger } from "../Logger";

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
    no: number;
    firstName?: string;
    name?: string;
    phoneNumber?: string;
    initialPassword?: string;
    validated?: boolean;
    error: LoginFormErrorType;
  };
  constructor(props: { titles: string[]; roles: string[] }) {
    super(props);
    this.jobTitles = props.titles;
    this.roles = props.roles;
    this.state = {
      no: 0,
      firstName: "",
      name: "",
      phoneNumber: "",
      initialPassword: "",
      validated: false,
      error: LoginFormErrorType.NO_ERROR,
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

    let errorType = LoginFormErrorType.NO_ERROR;
    if (!isValid) {
      event.preventDefault();
      event.stopPropagation();

      errorType = LoginFormErrorType.INVALID_FORM;
    }

    this.setState({
      validated: true,
      error: errorType,
    });
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
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
