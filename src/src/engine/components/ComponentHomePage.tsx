import { Logger } from "../Logger";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";

export class ComponentHomePage extends React.Component {
    private logger: Logger = new Logger(`ComponentAddEmployee`, `#20f6a4`, false);
    private isLoggedIn: boolean = false;

    public render(): JSX.Element {
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