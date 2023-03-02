import React from "react";
import {ComponentLoading} from "../components/ComponentLoading";
import {ComponentScheduleCreate} from "../components/ComponentScheduleCreate";
import {API} from "../api/APIManager";
import {EventForCalendar, EventForShiftCreation, EventForShiftEdit, Shift} from "../types/Shift";
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {Department} from "../types/Department";
import {SelectDepartment} from "../components/SelectDepartment";
import {Container} from "react-bootstrap";
import {Employee} from "../types/Employee";
import {errors} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import {Roles} from "../types/Roles";
import {DateManager} from "../utils/DateManager";
import {SelectDate} from "../components/SelectDate";

enum FetchState {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

interface State {
    currentDepartment: Department | null;
    currentDay: DayPilot.Date;
    departments: Department[];
    employees: Employee[];
    shifts: Shift[];
    fetchState: FetchState;
    redirectTo: string | null;
}

export class CreateSchedule extends React.Component<unknown, State> {
    public state: State = {
        currentDepartment: null,
        currentDay: DayPilot.Date.today(),
        departments: [],
        employees: [],
        shifts: [],
        fetchState: FetchState.WAITING,
        redirectTo: null
    };

    /**
     * Called when the page is loaded
     * @description This function is called when the page is loaded. It will set the title of the page and call the API to get the list of shifts.
     * @returns {Promise<void>}
     * @memberof CreateSchedule
     * @public
     * @override
     * @async
     */
    public async componentDidMount(): Promise<void> {
        document.title = "Création d'horaire - TaskMaster";

        let isLoggedIn: boolean = await this.verifyLogin();
        if (isLoggedIn) {
            let fetchedDepartments = await API.getDepartments();
            if (typeof fetchedDepartments === "string") {
                NotificationManager.error(errors.GET_DEPARTMENTS, fetchedDepartments);
                this.setState({fetchState: FetchState.ERROR});
            } else {
                //If current user is a manager, limit access to other departments
                if (!this.verifyPermissions(Roles.ADMIN)) {
                    fetchedDepartments = fetchedDepartments.filter(d =>
                        d.name === API.getCurrentEmployeeInfos()?.department
                    );
                }
                await this.#changeDepartment(fetchedDepartments[0], fetchedDepartments);
            }
        } else {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
        }
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

        let hasPerms = this.verifyPermissions(Roles.MANAGER);
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
     * Change employees, shifts to a new current department and refresh state down the function chain (Start of function chain)
     * @param currentDepartment 
     * @param departments 
     */
    readonly #changeDepartment = async (currentDepartment: Department, departments?: Department[]): Promise<void> => {
        //Get all employees of this department
        let fetchedEmployees = await API.getEmployees(currentDepartment.name);
        //Manage errors
        if (typeof fetchedEmployees === "string") {
            NotificationManager.error(errors.GET_EMPLOYEES, fetchedEmployees);
            this.setState({fetchState: FetchState.ERROR});
        } else {
            console.log(this.state.currentDay);
            await this.getShifts(currentDepartment, this.state.currentDay, departments, fetchedEmployees);
        }
    };

    /**
     * Fetch shifts and refresh state with all data (End of function chain)
     * @param currentDepartment The department to fetch the shifts from
     * @param departments OPTIONAL. The departments to set in state
     * @param employees OPTIONAL. The employees to set in state
     */
    private getShifts = async (currentDepartment: Department, currentDay: DayPilot.Date, departments?: Department[], employees?: Employee[]): Promise<void> => {
        //Get all daily shifts of this department
        let fetchedShifts = await API.getDailyScheduleForDepartment(currentDay, currentDepartment);
        //Manage errors
        if (typeof fetchedShifts === "string") {
            NotificationManager.error(errors.GET_SHIFTS, fetchedShifts);
            this.setState({fetchState: FetchState.ERROR});
        } else {
            this.setState({
                currentDepartment: currentDepartment,
                currentDay: currentDay,
                departments: departments || this.state.departments,
                employees: employees || this.state.employees,
                shifts: fetchedShifts,
                fetchState: FetchState.OK,
            });
        }
    };


    /**
     * Adds a shift to the DB and refreshes the state (Halfway through the function chain)
     * @param shiftEvent The shift to add
     */
    readonly #addShift = async (shiftEvent: EventForShiftCreation): Promise<void> => {
        let currentDepartment = this.state.currentDepartment ?? {name: "", director: ""};
        //Create Shift
        let error = await API.createShift({
            employeeId: shiftEvent.employeeId,
            start: shiftEvent.start,
            end: shiftEvent.end,
            department: currentDepartment.name,
        });
        //Manage errors
        if (typeof error === "string") {
            NotificationManager.error(errors.CREATE_SHIFT, error);
            this.setState({fetchState: FetchState.ERROR});
        }
        //Refresh shifts
        else await this.getShifts(currentDepartment, this.state.currentDay);
    };

    /**
     * Edits a shift in the DB and refreshes the state (Halfway through the function chain)
     * @param shiftEvent The shift to add
     */
    readonly #editShift = async (shiftEvent: EventForShiftEdit): Promise<void> => {
        let currentDepartment = this.state.currentDepartment ?? {name: "", director: ""};
        //Create Shift
        let error = await API.editShift({
            id: shiftEvent.id,
            employeeId: shiftEvent.employeeId,
            start: shiftEvent.start,
            end: shiftEvent.end,
            department: currentDepartment.name,
        });
        //Manage errors
        if (typeof error === "string") {
            NotificationManager.error(errors.EDIT_SHIFT, error);
            this.setState({fetchState: FetchState.ERROR});
        }
        //Refresh shifts
        else await this.getShifts(currentDepartment, this.state.currentDay);
    };

    /**
     * Deletes a shift in the DB and refreshes the state (Halfway through the function chain)
     * @param shiftEvent The id of the shift to delete
     */
    readonly #deleteShift = async (shiftEvent: EventForShiftEdit): Promise<void> => {
        let currentDepartment = this.state.currentDepartment ?? {name: "", director: ""};
        //Delete shift
        let error = await API.deleteShift({
            id: shiftEvent.id,
            employeeId: shiftEvent.employeeId,
            start: shiftEvent.start,
            end: shiftEvent.end,
            department: currentDepartment.name,
        });
        //Manage errors
        if (typeof error === "string") {
            NotificationManager.error(errors.DELETE_SHIFT, error);
            this.setState({fetchState: FetchState.ERROR});
        }
        //Refresh shifts
        else await this.getShifts(currentDepartment, this.state.currentDay);
    };

    /**
     * Changes the current day and refreshes the state (Halfway through the function chain)
     * @param newDay The day to change to
     */
    readonly #changeDay = async (newDay: DayPilot.Date): Promise<void> => {
        let currentDepartment = this.state.currentDepartment ?? {name: "", director: ""};
        await this.getShifts(currentDepartment, newDay);
    };

    /**
     * Converts the shift into events for the Daypilot calendar
     * @param shifts the Shift objects to convert
     * @returns the converted shifts
     */
    private getEventsForCalendarFromShifts(shifts: Shift[]): EventForCalendar[] {
        let events: EventForCalendar[] = [];
        for (let shift of shifts) {
            let startText = DateManager.convertTimestampToDayPilotDate(shift.start);
            let endText = DateManager.convertTimestampToDayPilotDate(shift.end);
            events.push({
                id: shift.id,
                text: `${startText} à ${endText}`,
                start: shift.start,
                end: shift.end,
                resource: shift.employeeId
            });
        }
        return events;
    }

    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo} />);
        }

        switch (this.state.fetchState) {
            case FetchState.WAITING:
                return <ComponentLoading />;
            case FetchState.OK:
                if (this.state.departments.length > 1) {
                    return (
                        <Container className="mb-4">
                            <SelectDepartment
                                departments={this.state.departments}
                                changeDepartment={this.#changeDepartment}
                            />
                            <SelectDate
                                currentDay={this.state.currentDay}
                                changeDay={this.#changeDay}
                            />
                            <ComponentScheduleCreate
                                currentDay={this.state.currentDay}
                                events={this.getEventsForCalendarFromShifts(this.state.shifts)}
                                employees={this.state.employees}
                                addShift={this.#addShift}
                                editShift={this.#editShift}
                                deleteShift={this.#deleteShift}
                            />
                        </Container>
                    );
                } else {
                    return (
                        <Container className="mb-4">
                            <ComponentScheduleCreate
                                currentDay={this.state.currentDay}
                                events={this.getEventsForCalendarFromShifts(this.state.shifts)}
                                employees={this.state.employees}
                                addShift={this.#addShift}
                                editShift={this.#editShift}
                                deleteShift={this.#deleteShift}
                            />
                            <SelectDate
                                currentDay={this.state.currentDay}
                                changeDay={this.#changeDay}
                            />
                        </Container>
                    );
                }
            default:
                return <ComponentScheduleCreate
                    currentDay={this.state.currentDay}
                    events={[]}
                    employees={[]}
                    addShift={this.#addShift}
                    editShift={this.#editShift}
                    deleteShift={this.#deleteShift}
                />;
        }
    }
}
