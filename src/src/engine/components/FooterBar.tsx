import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { Logger } from "../Logger";

/* === Images === */
// @ts-ignore
import Logo from "../../deps/images/logo.png";
import Container from "react-bootstrap/esm/Container";

export class FooterBar extends React.Component {
  private logger: Logger = new Logger(`NavigationBar`, `#20f6a4`);

  public render(): JSX.Element {
    return (
      <div>
        <div className="pt-5 pb-4"></div>
        <Navbar variant="dark" fixed="bottom">
          <Container className="d-flex flex-wrap justify-content-between align-items-center">
            <Nav className="ms-2">
              <Navbar.Text>Équipe DRFW</Navbar.Text>
            </Nav>
            <LinkContainer to="/">
              <Navbar.Brand>
                <img
                  className="ms-4"
                  src={Logo}
                  alt="Logo TaskMaster"
                  width={50}
                  height={60}
                />
              </Navbar.Brand>
            </LinkContainer>
            <Nav className="me-2">
              <LinkContainer to="/login">
                <Nav.Link>Connexion</Nav.Link>
              </LinkContainer>
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }
}
