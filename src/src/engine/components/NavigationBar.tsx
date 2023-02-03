import { Logger } from "../Logger";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";

/**
 * Ceci est le composant de la barre de navigation qu'on retrouve presque partout dans le site
 */
export class NavigationBar extends React.Component {
  private logger: Logger = new Logger(`NavigationBar`, `#20f6a4`);
  private isLoggedIn: boolean = false;

  public render(): JSX.Element {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ fontSize: 15 }}>
        <Container>
          <img
            className="me-3"
            src={Logo}
            alt="Logo TaskMaster"
            width={50}
            height={60}
          />
          <LinkContainer to="/">
            <Navbar.Brand>Task Master</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {/* eslint-disable-next-line no-restricted-globals */}
            <Nav activeKey={location.pathname}>
              <LinkContainer to="/schedule">
                <Nav.Link>Mon horaire</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/availabilities">
                <Nav.Link>Mes disponibilités</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/departements">
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
  private loginButton() {
    if (this.isLoggedIn) {
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
  private logOut() {
    this.logger.log(`Logging out`);
  }
}
