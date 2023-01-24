import { Logger } from "./Logger";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import "../deps/css/Engine.css";

/* === Images === */
// @ts-ignore
//import * as Logo from '../deps/images/logo_color.png';

/* === External Icons === */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCode,
  faEnvelope,
  faCube,
  faCodeBranch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

import { Index } from "./pages/index";
import { About } from "./pages/about";
import { Employees } from "./pages/employees";

export class Engine extends React.Component {
  private logger: Logger = new Logger(`Engine`, `#20f6a4`);

  public render(): JSX.Element {
    this.logger.log(`Running rendering engine...`);
    let pageJSX = <this.Navigation />;

    return pageJSX;
  }

  //<img src={Logo.default} alt="FunLogo"/>
  private Navigation(): JSX.Element {
    return (
      <div>
        <Router>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="/">Task Master</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/schedule">Horaire</Nav.Link>
                  <Nav.Link href="/about">À propos</Nav.Link>
                  <Nav.Link href="/employees">Employees</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link href="#deets">More deets</Nav.Link>
                  <Nav.Link eventKey={2} href="#memes">
                    Dank memes
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/employees" element={<Employees />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
