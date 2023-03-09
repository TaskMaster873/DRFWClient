import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

//#region CSS
import "../deps/css/index.css";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.compat.css";
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

import {ReactNotifications} from "react-notifications-component";
import {RouteNotFound} from "./pages/RouteNotFound";

import {FirstResetPassword} from "./pages/FirstResetPassword";
import {ManageAvailabilities} from "./pages/ManageAvailabilities";

interface EngineState {
    showSpinner: boolean;
    forceResetPassword: boolean;
}

export class Engine extends React.Component<unknown, EngineState> {
    public state: EngineState = {
        showSpinner: true,
        forceResetPassword: false
    };

    constructor(props: unknown) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    public async componentDidMount(): Promise<void> {
        await this.verifyLogin();
    }

    /**
     * This function is called when the APIManager emits an event.
     */
    public async verifyLogin(): Promise<void> {
        await API.awaitLogin;

        this.setState({
            showSpinner: false,

            // We show the reset password prompt if the user is logged in and has not reset their password
            forceResetPassword: !(API.hasChangedDefaultPassword || !API.isAuth())
        });
    }

    public render(): JSX.Element {
        if (this.state.showSpinner) {
            return (
                <React.StrictMode>
                    <ComponentLoading/>
                </React.StrictMode>
            );
        } else if (this.state.forceResetPassword) {
            return (
                <Router>
                    <ReactNotifications/>
                    <Routes>
                        <Route path="*" element={<FirstResetPassword
                            onChangePasswordCallbackParent={this.#onChangePasswordCallbackParent}/>}/>
                    </Routes>
                </Router>
            );
        } else {
            return (
                <Router>
                    <NavigationBar/>
                    <ReactNotifications/>
                    <Routes>
                        <Route path={RoutesPath.INDEX} element={<Index/>}/>
                        <Route path={RoutesPath.SCHEDULE} element={<ScheduleEmployee/>}/>
                        <Route path={RoutesPath.CREATE_SCHEDULE} element={<CreateSchedule/>}/>
                        <Route path={RoutesPath.DEPARTMENTS} element={<Departments/>}/>
                        <Route path={`${RoutesPath.DEPARTMENTS}${RoutesPath.EMPLOYEE_WITH_PARAM}`}
                               element={<EmployeeWrapper/>}/>
                        <Route path={RoutesPath.ABOUT} element={<About/>}/>
                        <Route path={RoutesPath.LOGIN} element={<Login/>}/>
                        <Route path={RoutesPath.ADD_EMPLOYEE} element={<AddEmployee/>}/>
                        <Route path={RoutesPath.EDIT_EMPLOYEE_WITH_PARAM} element={<EditEmployeeWrapper/>}/>
                        <Route path={RoutesPath.AVAILABILITIES} element={<Availabilities/>}/>
                        <Route path={RoutesPath.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
                        <Route path={RoutesPath.RESET_PASSWORD} element={<ResetPassword/>}/>
                        <Route path={RoutesPath.CHANGE_PASSWORD} element={<ChangePassword/>}/>
                        <Route path={RoutesPath.MANAGE_AVAILABILITIES} element={<ManageAvailabilities/>}/>
                        <Route path="*" element={<RouteNotFound/>}/>
                    </Routes>
                </Router>
            );
        }
    }

    /**
     * Called when the API login state changes.
     * @private
     */
    private onEvent(): void {
        this.setState({
            forceResetPassword: !(API.hasChangedDefaultPassword || !API.isAuth())
        });
    }

    /**
     * Callback for the first reset password page.
     * @private
     */
    readonly #onChangePasswordCallbackParent = () => {
        window.location.reload();
    };
}
