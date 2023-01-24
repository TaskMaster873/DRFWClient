import { Logger } from "./Logger";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "../deps/css/bootstrap.min.css";
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

import { ComponentEmployeeList } from "./components/ComponentEmployeeList";
import { EmployeePage } from "./pages/employees";

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
      <div className="container py-3 text-body bg-body">
        <Router>
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">
                Task Master
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      About
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/employees">
                      Employees
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/employees" element={<EmployeePage />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
