import React from "react";
import {BrowserRouter as Router, Route, Routes, useParams, Params} from "react-router-dom";

import "../deps/css/Engine.css";
import "../deps/css/index.css";

import {Index} from "./pages";
import {ScheduleEmployee} from "./pages/ScheduleEmployee";
import { EmployeeWrapper } from "./pages/employees";
import {About} from "./pages/about";
import {Login} from "./pages/login";
import {AddEmployee} from "./pages/addEmployee";
import {NavigationBar} from "./components/NavigationBar";
import {ChangePassword} from "./pages/changePassword";
import {Departments} from "./pages/departments";
import {Availabilities} from "./pages/availabilities";
import {API} from "./api/APIManager";
import {ResetPassword} from "./pages/ResetPassword";
import {NotificationContainer} from 'react-notifications';
import { ComponentLoading } from "./components/ComponentLoading";
import { ForgotPassword } from "./pages/forgotPassword";
import 'react-notifications/lib/notifications.css';
import { CreateSchedule } from "./pages/createSchedule";

interface EngineState {
    showSpinner: boolean;
}

export class Engine extends React.Component<unknown, EngineState> {
    public state: EngineState = {
        showSpinner: true
    };

    constructor(props: never) {
        super(props);
    }

    public componentDidMount(): void {
        this.verifyLogin();
    }

    public async verifyLogin(): Promise<void> {
        await API.awaitLogin;

        this.setState({showSpinner: false});
    }

    public render(): JSX.Element {
        if (this.state.showSpinner) {
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
                            <Route path="/schedule" element={<ScheduleEmployee/>}/>
                            <Route path="/create-schedule" element={<CreateSchedule/>}/>
                            <Route path="/departments" element={<Departments/>}/>
                            <Route path="/employees/:id/employee" element={<EmployeeWrapper/>}/>
                            <Route path="/about" element={<About/>}/>
                            <Route path="/login" element={<Login/>}/>
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
