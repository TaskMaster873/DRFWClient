import React from "react";
import {API} from "../api/APIManager";
import {errors, successes} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import {Roles} from "../types/Roles";
import {AvailabilitiesList} from "../components/AvailabilitiesList";
import {ComponentLoading} from "../components/ComponentLoading";
import {Employee} from "../types/Employee";

enum FetchState {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

type State = {
    employees: Employee[],
    unavailabilities: any[];
    fetchState: FetchState;
    redirectTo: string | null;
};

// This page is not done.
export class ManageAvailabilities extends React.Component<unknown, State> {
    public state: State = {
        employees: [],
        unavailabilities: [],
        fetchState: FetchState.WAITING,
        redirectTo: null,
    };

    /**
     * Called when the page is loaded
     * @description This function is called when the page is loaded. It will set the title of the
     * page and call the API to get the list of availabilities and employees.
     * @returns {Promise<void>}
     * @memberof ManageAvailabilities
     * @public
     * @override
     * @async
     */
    public async componentDidMount(): Promise<void> {
        document.title = "Gestion des disponibilités - TaskMaster";

        const isLoggedIn: boolean = await this.verifyLogin();
        if (isLoggedIn) {
            await this.fetchEmployees();
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

        const hasPerms = API.hasPermission(Roles.MANAGER);
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

    /**
     * Fetches all employees and if no errors pop up, fetch unavailabilities too
     */
    private async fetchEmployees(): Promise<void> {
        const employees: string | Employee[] = await API.getEmployees();
        if (this.manageError(employees, errors.GET_EMPLOYEES)) {
            this.fetchPendingUnavailabilities(employees as Employee[])
        }
    }

    /**
     * Fetches all pending availabilities if admin, or your department's pending availabilities if manager.
     * @param employees the employees to set in state
     */
    private async fetchPendingUnavailabilities(employees: Employee[]): Promise<void> {
        let unavailabilities: string | any[] = "";
        if (API.hasPermission(Roles.ADMIN)) {
            unavailabilities = await API.getAllPendingUnavailabilities();
        } else {
            let currentDepartmentName = API.getCurrentEmployeeInfos().department;
            if (currentDepartmentName)
                unavailabilities = await API.getPendingUnavailabilitiesForDepartment(currentDepartmentName);
        }
        if (this.manageError(unavailabilities, errors.GET_AVAILABILITIES)){
            this.setState({
                employees: employees,
                unavailabilities: unavailabilities as any[],
                fetchState: FetchState.OK
            });
        }
    }

    readonly #changeAcceptedValue = async (unavailability: any): Promise<void> => {
        unavailability.isAccepted = !unavailability.isAccepted;
        const error = await API.changeUnavailabilityAcceptedValue(unavailability);

        if (error) {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, error);
            return;
        }

        const unavailabilities = this.state.unavailabilities;

        if (!unavailabilities) {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, errors.SERVER_ERROR);
            return;
        }
        const oldUnavailability = unavailabilities.find((elem: any) => elem.id === unavailability.id);

        if (!oldUnavailability) {
            NotificationManager.error(errors.SERVER_ERROR, errors.EMPLOYEE_NOT_FOUND);
            return;
        }

        oldUnavailability.isAccepted = unavailability.isAccepted;
        this.refreshList(oldUnavailability, unavailabilities);

        if (unavailability.isActive) {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_ACTIVATED);
        } else {
            NotificationManager.success(successes.SUCCESS_GENERIC_MESSAGE, successes.EMPLOYEE_DEACTIVATED);
        }
    }

    /**
     * Used to refresh the list of employees
     * @param unavailability {any} The unavailability to refresh
     * @param unavailabilities {any[]} The list of unavailabilities
     * @private
     * @return {void}
     */
    private refreshList(unavailability: any, unavailabilities: any[]) {
        const index = unavailabilities.findIndex(elem => elem.id == unavailability.id);
        if (unavailability && index != -1) {
            unavailabilities[index] = unavailability;
            this.setState({unavailabilities: unavailabilities});
        }
    }

    /**
     * Manages the error sending a notification and refreshing the state with error
     * @param error recieved possible error from the API
     * @param errorMessage message to send in the event of there being an error
     * @returns true, if there are no errors. false, if there was an error
     */
    private manageError(error: string | any, errorMessage: string): boolean {
        if (typeof error === "string") {
            NotificationManager.error(errorMessage, error);
            this.setState({fetchState: FetchState.ERROR});
            return false;
        }
        return true;
    }

    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo} />);
        }
        switch (this.state.fetchState) {
            case FetchState.WAITING:
                return <ComponentLoading />;
            case FetchState.OK:
                return <AvailabilitiesList
                    employees={this.state.employees}
                    unavailabilities={this.state.unavailabilities}
                    onChangeAcceptedValue={this.#changeAcceptedValue}
                />;
            default:
                return <AvailabilitiesList
                    employees={[]}
                    unavailabilities={[]}
                    onChangeAcceptedValue={this.#changeAcceptedValue}
                />;
        }

    }
}
