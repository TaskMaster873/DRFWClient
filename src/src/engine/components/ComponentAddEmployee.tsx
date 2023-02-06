import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FormErrorType, constants } from "../messages/FormMessages";
import { Container } from "react-bootstrap";
import { SocketManager } from "../networking/WebsocketManager";

type Props = { titles: string[]; roles: string[] };
/**
 *
 * Ceci est le composant pour ajouter les employés
 */
export class ComponentAddEmployee extends React.Component<Props> {
  private jobTitles: string[] = [];
  private roles: string[] = [];
  private errorMessage = "";
  public state: {
    clientId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    validated?: boolean;
    error: FormErrorType;
  };

  constructor(props: Props) {
    super(props);
    this.jobTitles = props.titles;
    this.roles = props.roles;
    this.state = {
      clientId: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      validated: false,
      error: FormErrorType.NO_ERROR,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public render(): JSX.Element {
    return (
      <Container>
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          data-error={this.state.error}
        >
          <Row className="mb-3 mt-3">
            <Form.Group as={Col} md="4">
              <Form.Label>Numéro d'employé</Form.Label>
              <Form.Control
                id="clientId"
                required
                type="number"
                placeholder="000000"
                min="100000"
                max="999999"
              />
              <Form.Control.Feedback type="invalid">
                {constants.errorInvalidEmployeeId}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                id="firstName"
                required
                type="text"
                placeholder="Prénom"
              />
              <Form.Control.Feedback type="invalid">
                {constants.errorRequiredFirstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                id="lastName"
                required
                type="text"
                placeholder="Nom"
              />
              <Form.Control.Feedback type="invalid">
                {constants.errorRequiredName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Numéro de téléphone</Form.Label>
              <Form.Control
                id="phoneNumber"
                required
                type="tel"
                pattern="^(\+?1 ?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$"
                placeholder="000-000-0000"
              />
              <Form.Control.Feedback type="invalid">
                {constants.errorInvalidPhoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Mot de passe initial</Form.Label>
              <Form.Control
                id="password"
                required
                type="password"
                pattern='^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$'
                placeholder="Mot de passe"
              />
              <Form.Control.Feedback type="invalid">
                {constants.errorInvalidInitialPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Corps d'emploi</Form.Label>
              {this.jobTitles.map((corps) => (
                <Form.Check
                  key={`${corps}`}
                  type="checkbox"
                  id={`${corps}`}
                  label={`${corps}`}
                />
              ))}
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Rôle de l'employé</Form.Label>
              <Form.Select required id="roleAddEmployee">
                {this.roles.map((role) => (
                  <option key={`${role}`} value={`${role}`}>{`${role}`}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {constants.errorRequiredRole}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <div className="d-flex justify-content-center">
            <Form.Text
              className="text-muted"
              id="loginErrorMsg"
              aria-errormessage={this.errorMessage}
            ></Form.Text>
            <Button
              onClick={() => history.back()}
              className="mb-3 me-4 btn-lg"
              variant="secondary"
            >
              Retour
            </Button>
            <Button className="mb-3 btn-lg" variant="primary" type="submit">
              Créer
            </Button>
          </div>
        </Form>
      </Container>
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

    if (errorType === FormErrorType.NO_ERROR) {
      SocketManager.createEmployee(
        {
          id: this.state.clientId,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          phoneNumber: this.state.phoneNumber,
          password: this.state.password,
          departmentId: "1",
          jobTitles: []
        }
      );
    }
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
