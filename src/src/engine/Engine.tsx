import React from "react";
import {BrowserRouter as Router, Route, Routes, useParams, Params} from "react-router-dom";

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
import {API} from "./api/APIManager";
import {ResetPassword} from "./pages/resetPassword";
import {NotificationContainer} from 'react-notifications';
import { ComponentLoading } from "./components/ComponentLoading";
import { ForgotPassword } from "./pages/forgotPassword";
import 'react-notifications/lib/notifications.css';

function EmployeeWrapper(): any {
    let parameters: Readonly<Params<string>> = useParams();
    return (
        <Employees  {...{params: parameters}}/>
    );
}

export class Engine extends React.Component {
    private showSpinner: boolean = true;

    constructor(props) {
        super(props);
    }

    public componentDidMount(): void {
        this.verifyLogin();
    }

    public verifyLogin(): void {
        if (API.awaitLogin) {
            API.awaitLogin.then(() => {
                this.showSpinner = false;

                this.forceUpdate();
            });
        }
    }

    public render(): JSX.Element {
        if (this.showSpinner) {
            return (<React.StrictMode>
                <ComponentLoading/>
            </React.StrictMode>);
        } else {
            return (
                <React.StrictMode>
                    <Router>
                        <NavigationBar/>
                        <NotificationContainer/>
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
                            <Route path="/forgot-password" element={<ForgotPassword/>}/>
                            <Route path="/reset-password" element={<ResetPassword/>}/>
                            <Route path="/change-password" element={<ChangePassword/>}/>
                        </Routes>
                    </Router>
                </React.StrictMode>
            );
        }
    }
}
