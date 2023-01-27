import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "../deps/css/Engine.css";
import "../deps/css/index.css";

import { Index } from "./pages/index";
import { Schedule } from "./pages/schedule";
import { Employees } from "./pages/employees";
import { About } from "./pages/about";
import { Login } from "./pages/login";
import { Memes } from "./pages/memes";
import { AddEmployee } from "./pages/addEmployee";
import { NavigationBar } from "./components/NavigationBar";
import { ChangePassword } from "./pages/changePassword";

export class Engine extends React.Component {
  public render(): JSX.Element {
    return (
      <React.StrictMode>
        <Router>
          <div>
            <NavigationBar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/memes" element={<Memes />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/changePassword" element={<ChangePassword />} />
            </Routes>
          </div>
        </Router>
      </React.StrictMode>
    );
  }
}
