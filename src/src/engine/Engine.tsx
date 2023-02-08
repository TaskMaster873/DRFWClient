import React, {CSSProperties} from "react";
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
import {API} from "./api/APIManager";
import {ResetPassword} from "./pages/resetPassword";

function EmployeeWrapper(): any {
    let parameters: any = useParams();
    return (
        <Employees  {...{params: parameters}}/>
    );
}

import {BeatLoader} from "react-spinners";
import {NotificationContainer} from 'react-notifications';

const override: CSSProperties = {
    display: 'flex',
    alignSelf: 'center',
    margin: '0 auto',
};

import 'react-notifications/lib/notifications.css';

export class Engine extends React.Component {
    private showSpinner: boolean = true;

    constructor(props) {
        super(props);
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
                <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <BeatLoader
                        color={"#A020F0"}
                        loading={true}
                        size={25}
                        cssOverride={override}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
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
                            <Route path="/resetPassword" element={<ResetPassword/>}/>
                            <Route path="/changePassword" element={<ChangePassword/>}/>
                        </Routes>
                    </Router>
                </React.StrictMode>
            );
        }
    }
}
