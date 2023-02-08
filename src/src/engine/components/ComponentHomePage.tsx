import React from "react";
import Container from "react-bootstrap/Container";
import {LinkContainer} from "react-router-bootstrap";
import Button from "react-bootstrap/Button";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";
import {API} from "../api/APIManager";

export class ComponentHomePage extends React.Component {
    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    private onEvent(): void {
        this.forceUpdate();
    }

    public render(): JSX.Element {
        if(API.isAuth()) {
            return (
                <div>User is logged in as {API.getEmployeeName()}</div>
            );
        } else {
            return (
                <div className=" justify-content-left">
                    <Container className="mt-4 mb-4 d-flex justify-content-center"> <h1> TaskMaster </h1> </Container>
                    <Container className="mt-6 mb-4 d-flex justify-content-center"><img
                        className="me-3"
                        src={Logo}
                        alt="Logo TaskMaster"
                        width={200}
                        height={240}
                    /></Container>
                    <Container className="text-left mt-4 mb-4">TaskMaster est un gestionnaire d'horaire pour entreprise. En tant qu'application web, TaskMaster est accessible partout et permet à une entreprise de mieux gérer ses effectifs.</Container>
                    <div className="me-4 mt-4 d-block text-center justify-content-center mx-auto">
                        <LinkContainer to="/login">
                            <Button
                                data-testid="submitLogin"
                                className="mt-4 btn-dark"
                                variant="primary"
                                size="lg"
                                type="submit"
                                value="Submit"
                            >
                                Connexion
                            </Button>
                        </LinkContainer>
                    </div>
                </div>
            );
        }
    }
}
