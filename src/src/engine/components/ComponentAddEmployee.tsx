import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { JobTitleList } from "../types/JobTitleList";

export class ComponentAddEmployee extends React.Component {
    private corpsEmplois: string[] = [];
    constructor(props: JobTitleList) {
      super(props);
      this.corpsEmplois = props.list;
    }
    public render() : JSX.Element {
        return (<Form className="row">
            <Form.Group className="mb-3 col-12" controlId="formEmployeId">
                <Form.Label>Numéro d'employé</Form.Label>
                <Form.Control type="number" placeholder="Entrez le numéro d'employé" />
            </Form.Group>
            <Form.Group className="mb-3 col-sm-12 col-md-6 col-lg-4" controlId="formPrenom">
                <Form.Label>Prénom de l'employé</Form.Label>
                <Form.Control type="text" placeholder="Entrez le prénom" />
            </Form.Group>
            <Form.Group className="mb-3 col-sm-12 col-md-6 col-lg-4" controlId="formNom">
                <Form.Label>Nom de l'employé</Form.Label>
                <Form.Control type="text" placeholder="Entrez le nom" />
            </Form.Group>
            <Form.Group className="mb-3 col-sm-12 col-lg-4" controlId="formTel">
                <Form.Label>Numéro de téléphone de l'employé</Form.Label>
                <Form.Control type="tel" placeholder="Entrez le numéro de téléphone" />
            </Form.Group>
            <Form.Group className="mb-3 col-12" controlId="formPassword">
                <Form.Label>Mot de passe initial de l'employé</Form.Label>
                <Form.Control type="password" placeholder="Entrez le mot de passe" />
            </Form.Group>
            <Form.Group className="mb-3 col-sm-12 col-md-6" controlId="formCorpsEmploi">
                <Form.Label>Corps d'emploi de l'employé</Form.Label>
                {this.corpsEmplois.map((corps) => (
                    <Form.Check key={`${corps}`} type="checkbox" id={`${corps}`} label={`${corps}`}/>
                ))}
            </Form.Group>
            <Form.Group className="mb-3 col-sm-12 col-md-6" controlId="formRole">
                <Form.Label>Rôle de l'employé</Form.Label>
                <Form.Select aria-label="Default select example">
                    {['Employé', 'Administrateur'].map((role) => (
                        <option key={`${role}`} value={`${role}`}>{`${role}`}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <hr/>
            <div className="d-flex justify-content-center">
                <Form.Group className="mb-3" controlId="formIsActif">
                    <Form.Check type="checkbox" label="Profil désactivé à la création"/>
                </Form.Group>
            </div>
            <div className="d-flex justify-content-center">
                <Button className="mb-3 btn-lg" variant="primary" type="submit">Créer</Button>
            </div>
        </Form>
        );
    }
}