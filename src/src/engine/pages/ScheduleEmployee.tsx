import React from "react";
import {ComponentEmployeeScheduleView} from "../components/ComponentEmployeeScheduleView";
import {Shift} from "../types/Shift";
import {API} from "../api/APIManager";
import {ComponentLoading} from "../components/ComponentLoading";
import {errors} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import {Roles} from "../types/Roles";

interface ScheduleState {
    list: Shift[];
    fetchState: enumStateOfFetching;
    redirectTo: string | null;
}

enum enumStateOfFetching {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

/**
 * Page qui affiche l'horaire des employés
 */
export class ScheduleEmployee extends React.Component<unknown, ScheduleState> {
    public state: ScheduleState = {
        list: [],
        fetchState: enumStateOfFetching.WAITING,
        redirectTo: null
    };

    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    public async componentDidMount(): Promise<void> {
        document.title = "Horaire - TaskMaster";

        let isLoggedIn: boolean = await this.verifyLogin();
        if (isLoggedIn) {
            let shifts = await this.loadShiftsFromAPI();
            if (typeof shifts === "string") {
                this.setState({fetchState: enumStateOfFetching.ERROR});
                NotificationManager.error(errors.GET_SHIFTS, errors.ERROR_GENERIC_MESSAGE);
            } else {
                this.setState({list: shifts, fetchState: enumStateOfFetching.OK});
            }
        } else {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
        }
    }

    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo}></Navigate>);
        }

        let listData: Shift[] = this.state.list;
        if (this.state.fetchState === enumStateOfFetching.WAITING) {
            return (
                <ComponentLoading/>
            );
        } else if (this.state.fetchState === enumStateOfFetching.OK) {
            return (<ComponentEmployeeScheduleView shifts={listData}/>);
        } else {
            return (<ComponentEmployeeScheduleView shifts={[]}/>);
        }
    }

    private async onEvent(): Promise<void> {
        await this.verifyLogin();
    }

    /**
     * Verify if the user has the permission to access this page
     * @param role
     * @private
     */
    private verifyPermissions(role: Roles): boolean {
        return API.hasPermission(role);
    }

    /**
     * Verify if the user is logged in
     * @private
     */
    private async verifyLogin(): Promise<boolean> {
        let isLoggedIn: boolean = false;
        await API.awaitLogin;

        let hasPerms = this.verifyPermissions(Roles.EMPLOYEE);
        if (!API.isAuth() || !hasPerms) {
            this.redirectTo(RoutesPath.INDEX);
        } else {
            isLoggedIn = true;
        }

        return isLoggedIn;
    }

    /**
     * Redirect to a path
     * @param path
     * @private
     */
    private redirectTo(path: string): void {
        this.setState({
            redirectTo: path
        });
    }

    // I did this function if we need to do something before the return (if there is some changes)
    private async loadShiftsFromAPI(): Promise<Shift[] | string> {
        return await API.getCurrentEmployeeSchedule();
    }
}
