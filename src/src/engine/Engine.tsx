import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";

import "../deps/css/Engine.css";
import "../deps/css/index.css";

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
import {NotificationContainer} from 'react-notifications';
import {ComponentLoading} from "./components/ComponentLoading";
import {ForgotPassword} from "./pages/ForgotPassword";
import 'react-notifications/lib/notifications.css';
import {CreateSchedule} from "./pages/CreateSchedule";
import {RoutePaths} from "./api/routes/RoutePaths";
import {Roles} from "./types/Roles";

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

    readonly ProtectedRoute = ({auth, children}): any => {
        if(auth) {
            return children;
        }
        return <Navigate to={RoutePaths.INDEX} replace/>
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
                            <Route path={RoutePaths.INDEX} element={<Index />}/>
                            <Route path={RoutePaths.SCHEDULE} element={<this.ProtectedRoute auth={API.isAuth()}><ScheduleEmployee/></this.ProtectedRoute>}/>
                            <Route path={RoutePaths.CREATE_SCHEDULE} element={<this.ProtectedRoute auth={API.hasPermission(Roles.ADMIN)}><CreateSchedule/></this.ProtectedRoute>}/>
                            <Route path={RoutePaths.DEPARTMENTS} element={<Departments/>}/>
                            <Route path={`${RoutePaths.DEPARTMENTS}${RoutePaths.EMPLOYEE_WITH_PARAM}`} element={<EmployeeWrapper/>}/>
                            <Route path={RoutePaths.ABOUT} element={<About/>}/>
                            <Route path={RoutePaths.LOGIN} element={<this.ProtectedRoute auth={!API.isAuth()}><Login/></this.ProtectedRoute>}/>
                            <Route path={RoutePaths.ADD_EMPLOYEE} element={<this.ProtectedRoute auth={API.hasPermission(Roles.ADMIN)}><AddEmployee/></this.ProtectedRoute>}/>
                            <Route path={RoutePaths.EDIT_EMPLOYEE_WITH_PARAM} element={<this.ProtectedRoute auth={API.hasPermission(Roles.ADMIN)}><EditEmployeeWrapper /></this.ProtectedRoute>}/>
                            <Route path={RoutePaths.AVAILABILITIES} element={<this.ProtectedRoute auth={!API.isAuth()}><Availabilities/></this.ProtectedRoute>}/>
                            <Route path={RoutePaths.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
                            <Route path={RoutePaths.RESET_PASSWORD} element={<ResetPassword/>}/>
                            <Route path={RoutePaths.CHANGE_PASSWORD} element={<ChangePassword/>}/>
                        </Routes>
                    </Router>
                </React.StrictMode>
            );
        }
    }
}
