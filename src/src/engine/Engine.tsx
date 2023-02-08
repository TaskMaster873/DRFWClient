import React from "react";
import {BrowserRouter as Router, Route, Routes, useParams} from "react-router-dom";

import "../deps/css/Engine.css";
import "../deps/css/index.css";

import {Index} from "./pages";
import {Schedule} from "./pages/schedule";
import {Employees} from "./pages/employees";
import {About} from "./pages/about";
import {Login} from "./pages/login";
import {Memes} from "./pages/memes";
import {AddEmployee} from "./pages/addEmployee";
import {NavigationBar} from "./components/NavigationBar";
import {ChangePassword} from "./pages/changePassword";
import {Departments} from "./pages/departments";
import {Availabilities} from "./pages/availabilities";
import {ResetPassword} from "./pages/resetPassword";


function EmployeeWrapper(): any {
    let parameters: any = useParams();
    return (
        <Employees  {...{params: parameters}}/>
    );
}

export class Engine extends React.Component {
    public render(): JSX.Element {
        return (
            <React.StrictMode>
                <Router>
                    <NavigationBar/>
                    <Routes>
                        <Route path="/" element={<Index/>}/>
                        <Route path="/schedule" element={<Schedule/>}/>
                        <Route path="/departments" element={<Departments/>}/>
                        <Route path="/employees/:id" element={<EmployeeWrapper/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/memes" element={<Memes/>}/>
                        <Route path="/add-employee" element={<AddEmployee/>}/>
                        <Route path="/availabilities" element={<Availabilities/>}/>
                        <Route path="/resetPassword" element={<ResetPassword/>}/>
                        <Route path="/changePassword" element={<ChangePassword/>}/>
                    </Routes>
                </Router>
            </React.StrictMode>
        );
    }
}
