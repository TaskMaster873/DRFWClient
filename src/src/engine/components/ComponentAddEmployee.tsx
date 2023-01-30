import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LinkContainer } from "react-router-bootstrap";

/**
 *
 * Ceci est le composant pour ajouter les employés
 */
export class ComponentAddEmployee extends React.Component<
  {},
  { validated: boolean }
> {
  private jobTitles: string[] = [];
  private roles: string[] = [];
  constructor(props: { titles: string[]; roles: string[] }) {
    super(props);
    this.jobTitles = props.titles;
    this.roles = props.roles;
    this.state = { validated: false };
  }
  public render(): JSX.Element {
    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.setState({ validated: true });
    };
    return (
      <Form noValidate validated={this.state.validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="formEmployeId">
            <Form.Label>Numéro d'employé</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="NE: 000000"
              pattern="^[1-9]{6}$"
            />
            <Form.Control.Feedback type="invalid">
              Un numéro d'employé est nécessaire
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="formPrenom">
            <Form.Label>Prénom</Form.Label>
            <Form.Control required type="text" placeholder="Prénom" />
            <Form.Control.Feedback type="invalid">
              Un prénom est nécessaire
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="formNom">
            <Form.Label>Nom</Form.Label>
            <Form.Control required type="text" placeholder="Nom" />
            <Form.Control.Feedback type="invalid">
              Un nom est nécessaire
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="formTel">
            <Form.Label>Numéro de téléphone</Form.Label>
            <Form.Control
              required
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="Tel: 000-000-0000"
            />
            <Form.Control.Feedback type="invalid">
              Un numéro de téléphone est nécessaire
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="formPassword">
            <Form.Label>Mot de passe initial</Form.Label>
            <Form.Control required type="password" placeholder="Mot de passe" />
            <Form.Control.Feedback type="invalid">
              Un mot de passe initial est nécessaire
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="formCorpsEmploi">
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
          <Form.Group as={Col} md="6" controlId="formRole">
            <Form.Label>Rôle de l'employé</Form.Label>
            <Form.Select required aria-label="Default select example">
              {this.roles.map((role) => (
                <option key={`${role}`} value={`${role}`}>{`${role}`}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <div className="d-flex justify-content-center">
          <LinkContainer to="/employees">
            <Button className="mb-3 me-4 btn-lg" variant="secondary">
              Retour
            </Button>
          </LinkContainer>
          <Button className="mb-3 btn-lg" variant="primary" type="submit">
            Créer
          </Button>
        </div>
      </Form>
    );
  }
}
