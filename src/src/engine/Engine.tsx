import { Logger } from "./Logger";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "../deps/css/Engine.css";
import "../deps/css/index.css";

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
import { NavigationBar } from "./components/NavigationBar";

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
          <NavigationBar />
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
