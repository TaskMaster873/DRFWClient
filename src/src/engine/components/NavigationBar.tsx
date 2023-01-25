import { Logger } from "../Logger";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";

export class NavigationBar extends React.Component {
  private logger: Logger = new Logger(`NavigationBar`, `#20f6a4`);
  private isLoggedIn: boolean = false;

  public render(): JSX.Element {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <img
            className="me-3"
            src={Logo}
            alt="Logo TaskMaster"
            width={50}
            height={60}
          />
          <Navbar.Brand href="/">Task Master</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav activeKey={location.pathname}>
              <Nav.Link href="/schedule">Horaire</Nav.Link>
              <Nav.Link href="/employees">Employés</Nav.Link>
              <Nav.Link href="/about">À propos</Nav.Link>
            </Nav>
            <Nav activeKey={location.pathname} className="ms-auto">
              {this.loginButton()}
              <Nav.Link href="/memes">Dank memes</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  private loginButton() {
    if (this.isLoggedIn) {
      return <Nav.Link onClick={this.logOut}>Se déconnecter</Nav.Link>;
    } else {
      return <Nav.Link href="/login">Connexion</Nav.Link>;
    }
  }

  private logOut() {}
}
