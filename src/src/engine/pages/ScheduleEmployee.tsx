import React from "react";
import {ComponentEmployeeScheduleView} from "../components/ComponentEmployeeScheduleView";
import {Shift} from "../types/Shift";
import {API} from "../api/APIManager";
import {ComponentLoading} from "../components/ComponentLoading";
import {errors} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";
import {RoutesPath} from "../RoutesPath";
import {Navigate, Params, useParams} from "react-router-dom";
import {Roles} from "../types/Roles";

export interface ScheduleProps {
    params: Readonly<Params>;
}

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

export function ScheduleEmployee(): JSX.Element {
    const parameters: Readonly<Params<string>> = useParams();
    return (
        <ScheduleEmployeeInternal  {...{params: parameters}}/>
    );
}

/**
 * Page qui affiche l'horaire des employés
 */
export class ScheduleEmployeeInternal extends React.Component<ScheduleProps, ScheduleState> {
    public state: ScheduleState = {
        list: [],
        fetchState: enumStateOfFetching.WAITING,
        redirectTo: null
    };

    public async componentDidMount(): Promise<void> {
        document.title = "Horaire - TaskMaster";

        let isLoggedIn: boolean = await this.verifyLogin();
        if(isLoggedIn) {
            let result = await this.loadShiftsFromAPI();
            if (typeof result === "string") {
                this.redirectTo(RoutesPath.INDEX);
                NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, result);
            } else {
                this.setState({list: result, fetchState: enumStateOfFetching.OK});
            }
        } else {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
        }
    }

    /**
     * Verify if the user is logged in
     * @private
     */
    private async verifyLogin(): Promise<boolean> {
        let isLoggedIn: boolean = false;
        await API.awaitLogin;

        let hasPerms = API.hasPermission(Roles.EMPLOYEE);
        if (!API.hasPermission(Roles.ADMIN) && !API.isAuth() || !hasPerms || (this.props.params && !API.isManagerPermitted(API.getCurrentEmployeeInfos().department))) {
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
        if(this.props.params.id) {
            return await API.getScheduleForOneEmployee(this.props.params.id);
        }
        return await API.getCurrentEmployeeSchedule();
    }

    public render(): JSX.Element {
        if(this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo}></Navigate>);
        }

        let listData: Shift[] = this.state.list;
        if (this.state.fetchState === enumStateOfFetching.WAITING) {
            return (
                <ComponentLoading />
            );
        } else if (this.state.fetchState === enumStateOfFetching.OK) {
            return (<ComponentEmployeeScheduleView shifts={listData}/>);
        } else {
            return (<ComponentEmployeeScheduleView shifts={[]}/>);
        }
    }
}
