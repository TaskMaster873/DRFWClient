import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {LinkContainer} from "react-router-bootstrap";
import {NotificationManager} from 'react-notifications';

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";
import {API} from "../api/APIManager";
import {errors, successes} from "../messages/FormMessages";

/**
 * Ceci est le composant de la barre de navigation qu'on retrouve presque partout dans le site
 */
export class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    private async onEvent(): Promise<void> {
        this.forceUpdate();
    }

    public render(): JSX.Element {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{fontSize: 15}}>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                    <img
                        className="me-3"
                        src={Logo}
                        alt="Logo TaskMaster"
                        width={50}
                        height={60}
                    />
                        Task Master</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {/* eslint-disable-next-line no-restricted-globals */}
                        <Nav activeKey={location.pathname}>
                            <LinkContainer to="/schedule">
                                <Nav.Link>Mon horaire</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/availabilities">
                                <Nav.Link>Mes disponibilités</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/departments">
                                <Nav.Link>Départements</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/about">
                                <Nav.Link>À propos</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        {/* eslint-disable-next-line no-restricted-globals */}
                        <Nav activeKey={location.pathname} className="ms-auto">
                            {this.loginButton()}
                            <LinkContainer to="/memes">
                                <Nav.Link>Dank memes</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }

    /**
     *
     * @returns se déconnecter si la personne est connectée
     */
    private loginButton() : JSX.Element {
        if (API.isAuth()) {
            return <Nav.Link onClick={this.logOut}>Se déconnecter</Nav.Link>;
        } else {
            return (
                <LinkContainer to="/login">
                    <Nav.Link id="loginLink">Connexion</Nav.Link>
                </LinkContainer>
            );
        }
    }

    /**
     * Je ne sais pas si il faudrait le garder
     */
    private async logOut() : Promise<void> {
        let error = await API.logout();
        if (!error) {
            NotificationManager.success(successes.successGenericMessage, successes.logout);
        } else {
            NotificationManager.error(error, errors.errorLogout);
        }
    }
}
