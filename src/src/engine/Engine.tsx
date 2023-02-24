import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";

//#region CSS
import "../deps/css/index.css";
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.compat.css'
//#endregion

import {Index} from "./pages";
import {ScheduleEmployee} from "./pages/ScheduleEmployee";
import {EmployeeWrapper} from "./pages/Employees";
import {About} from "./pages/About";
import {Login} from "./pages/Login";
import {AddEmployee} from "./pages/AddEmployee";
import {EditEmployeeWrapper} from "./pages/EditEmployee";
import {NavigationBar} from "./components/NavigationBar";
import {ChangePassword} from "./pages/ChangePassword";
import {Departments} from "./pages/Departments";
import {Availabilities} from "./pages/Availabilities";
import {API} from "./api/APIManager";
import {ResetPassword} from "./pages/ResetPassword";
import {ComponentLoading} from "./components/ComponentLoading";
import {ForgotPassword} from "./pages/ForgotPassword";

import {CreateSchedule} from "./pages/CreateSchedule";
import {RoutesPath} from "./RoutesPath";
import {Roles} from "./types/Roles";

import { ReactNotifications } from 'react-notifications-component';

interface EngineState {
    showSpinner: boolean;
}

export class Engine extends React.Component<unknown, EngineState> {
    public state: EngineState = {
        showSpinner: true
    };

    constructor(props: unknown) {
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
                        <ReactNotifications />
                        <Routes>
                            <Route path={RoutesPath.INDEX} element={<Index/>}/>
                            <Route path={RoutesPath.SCHEDULE} element={<ScheduleEmployee/>}/>
                            <Route path={RoutesPath.CREATE_SCHEDULE} element={ ? <CreateSchedule/> : <Navigate to={RoutesPath.INDEX}/>}/>
                            <Route path={RoutesPath.DEPARTMENTS} element={<Departments/>}/>
                            <Route path={`${RoutesPath.DEPARTMENTS}${RoutesPath.EMPLOYEE_WITH_PARAM}`} element={<EmployeeWrapper/>}/>
                            <Route path={RoutesPath.ABOUT} element={<About/>}/>
                            <Route path={RoutesPath.LOGIN} element={<Login/>}/>
                            <Route path={RoutesPath.ADD_EMPLOYEE} element={API.hasPermission(Roles.ADMIN) ? <AddEmployee/> : <Navigate to={RoutesPath.INDEX}/>}/>
                            <Route path={RoutesPath.EDIT_EMPLOYEE_WITH_PARAM} element={API.hasPermission(Roles.ADMIN) ? <EditEmployeeWrapper /> : <Navigate to={RoutesPath.INDEX}/>}/>
                            <Route path={RoutesPath.AVAILABILITIES} element={<Availabilities/>}/>
                            <Route path={RoutesPath.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
                            <Route path={RoutesPath.RESET_PASSWORD} element={<ResetPassword/>}/>
                            <Route path={RoutesPath.CHANGE_PASSWORD} element={<ChangePassword/>}/>
                        </Routes>
                    </Router>
                </React.StrictMode>
            );
        }
    }
}
