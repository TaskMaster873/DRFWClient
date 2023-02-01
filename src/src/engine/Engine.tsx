import React from "react";
import {BrowserRouter as Router, Route, Routes, useParams} from "react-router-dom";

import "../deps/css/Engine.css";
import "../deps/css/index.css";

import { Index } from "./pages";
import { Schedule } from "./pages/schedule";
import { Employees } from "./pages/employees";
import { About } from "./pages/about";
import { Login } from "./pages/login";
import { Memes } from "./pages/memes";
import { AddEmployee } from "./pages/addEmployee";
import { NavigationBar } from "./components/NavigationBar";
import { ChangePassword } from "./pages/changePassword";
import { FooterBar } from "./components/FooterBar";
import { Departements } from "./pages/departements";


function EmployeeWrapper() : any {
  let params : any = useParams();
  return (
      <Employees  params={...params}/>
  );
}

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
              <Route path="/departements" element={<Departements />} />
              <Route path="/employees/:id" element={<EmployeeWrapper />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/memes" element={<Memes />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/add-departement" element={<AddEmployee />} />
              <Route path="/changePassword" element={<ChangePassword />} />
            </Routes>
            <FooterBar />
          </div>
        </Router>
      </React.StrictMode>
    );
  }
}
