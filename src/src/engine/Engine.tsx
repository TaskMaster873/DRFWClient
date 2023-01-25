import { Logger } from "./Logger";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "../deps/css/Engine.css";
import "../deps/css/index.css";

/* === Images === */
// @ts-ignore
import Logo from "../deps/images/logo.png";

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
import { Schedule } from "./pages/schedule";
import { Employees } from "./pages/employees";
import { About } from "./pages/about";
import { Login } from "./pages/login";
import { Memes } from "./pages/memes";
import { AddEmploye } from "./pages/addEmploye";

export class Engine extends React.Component {
  private logger: Logger = new Logger(`Engine`, `#20f6a4`);

  public render(): JSX.Element {
    let pageJSX = <this.Navigation />;

    return pageJSX;
  }

  private Navigation(): JSX.Element {
    return (
      <div>
        <Router>
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
                <Nav activeKey={location.pathname}>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/memes">Dank memes</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/memes" element={<Memes />} />
            <Route path="/creer-employe" element={<AddEmploye />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
