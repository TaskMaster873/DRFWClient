import React from "react";
import {ComponentLoading} from "../components/ComponentLoading";
import {ComponentScheduleCreate} from "../components/ComponentScheduleCreate";
import {API} from "../api/APIManager";
import {EventForCalendar, EventForShiftCreation, EventForShiftEdit, Shift} from "../types/Shift";
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {Department} from "../types/Department";
import {SelectDepartment} from "../components/SelectDepartment";
import {Col, Container, Row} from "react-bootstrap";
import {Employee} from "../types/Employee";
import {errors} from "../messages/FormMessages";
import {NotificationManager} from "../api/NotificationManager";
import {RoutesPath} from "../RoutesPath";
import {Navigate} from "react-router-dom";
import {Roles} from "../types/Roles";
import {DateManager} from "../utils/DateManager";
import {SelectDate} from "../components/SelectDate";
import {ViewableAvailabilities} from "../types/EmployeeAvailabilities";

enum FetchState {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

interface State {
    currentDepartment: Department;
    currentDay: DayPilot.Date;
    departments: Department[];
    employees: Employee[];
    unavailabilities: ViewableAvailabilities[];
    shifts: Shift[];
    fetchState: FetchState;
    redirectTo: string | null;
}

export class CreateSchedule extends React.Component<unknown, State> {
    public state: State = {
        currentDepartment: {name: "", director: ""},
        currentDay: DayPilot.Date.today(),
        departments: [],
        employees: [],
        unavailabilities: [],
        shifts: [],
        fetchState: FetchState.WAITING,
        redirectTo: null
    };

    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    private async onEvent() : Promise<void> {
        await this.verifyLogin();
    }

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

        const isLoggedIn: boolean = await this.verifyLogin();
        if (isLoggedIn) {
            let fetchedDepartments = await API.getDepartments();
            if (this.manageError(fetchedDepartments, errors.GET_DEPARTMENTS)) {
                fetchedDepartments = fetchedDepartments as Department[];
                //If current user is a manager, limit access to other departments
                if (!API.hasPermission(Roles.ADMIN)) {
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
                        <Container fluid={true}>
                            <Row className={"mx-auto"}>
                                <Col>
                                    <SelectDepartment
                                        departments={this.state.departments}
                                        changeDepartment={this.#changeDepartment}
                                    />
                                </Col>
                                <Col>
                                    <SelectDate
                                        currentDay={this.state.currentDay}
                                        changeDay={this.#changeDay}
                                    />
                                </Col>
                            </Row>

                            <Row className={"mt-3"}>
                                <ComponentScheduleCreate
                                    currentDay={this.state.currentDay}
                                    events={this.getEventsForCalendarFromShifts(this.state.shifts)}
                                    employees={this.state.employees}
                                    unavailabilities={this.state.unavailabilities}
                                    addShift={this.#addShift}
                                    editShift={this.#editShift}
                                    deleteShift={this.#deleteShift}
                                />
                            </Row>
                        </Container>
                    );
                } else {
                    return (
                        <Container fluid={true}>
                            <Row className={"mx-auto"}>
                                <Col>
                                    <SelectDate
                                        currentDay={this.state.currentDay}
                                        changeDay={this.#changeDay}
                                    />
                                </Col>
                            </Row>

                            <Row className={"mt-3"}>
                                <ComponentScheduleCreate
                                    currentDay={this.state.currentDay}
                                    events={this.getEventsForCalendarFromShifts(this.state.shifts)}
                                    employees={this.state.employees}
                                    unavailabilities={this.state.unavailabilities}
                                    addShift={this.#addShift}
                                    editShift={this.#editShift}
                                    deleteShift={this.#deleteShift}
                                />
                            </Row>
                        </Container>
                    );
                }
            default:
                return <ComponentScheduleCreate
                    currentDay={this.state.currentDay}
                    events={[]}
                    employees={[]}
                    unavailabilities={[]}
                    addShift={this.#addShift}
                    editShift={this.#editShift}
                    deleteShift={this.#deleteShift}
                />;
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
     * Change employees, shifts to a new current department and refresh state down the function chain (Start of function chain)
     * @param currentDepartment current department to view
     * @param departments OPTIONAL. all departments available
     */
    readonly #changeDepartment = async (currentDepartment: Department, departments?: Department[]): Promise<void> => {
        const fetchedEmployees = await API.getEmployees(currentDepartment.name);
        const fetchedUnavailabilities = await API.getUnavailabilitiesForDepartment(currentDepartment.name, true);
        if (this.manageError(fetchedEmployees, errors.GET_EMPLOYEES)) {
            if (this.manageError(fetchedUnavailabilities, errors.GET_AVAILABILITIES)) {
                await this.getShifts(
                    this.state.currentDay, 
                    currentDepartment, 
                    departments, 
                    fetchedEmployees as Employee[], 
                    fetchedUnavailabilities as ViewableAvailabilities[]
                );
            }
        }
    };

    /**
     * Fetch shifts and refresh state with all data (End of function chain)
     * @param currentDay OPTIONAL. The current day to fetch the shifts from
     * @param currentDepartment OPTIONAL. The department to fetch the shifts from
     * @param departments OPTIONAL. The departments to set in state
     * @param employees OPTIONAL. The employees to set in state
     */
    private getShifts = async (
        currentDay?: DayPilot.Date,
        currentDepartment?: Department,
        departments?: Department[],
        employees?: Employee[],
        unavailabilities?: ViewableAvailabilities[]
    ): Promise<void> => {
        //Get all daily shifts of this department
        const fetchedShifts = await API.getDailyScheduleForDepartment(
            currentDay || this.state.currentDay,
            currentDepartment || this.state.currentDepartment
        );
        if (this.manageError(fetchedShifts, errors.GET_SHIFTS)) {
            this.setState({
                currentDepartment: currentDepartment || this.state.currentDepartment,
                currentDay: currentDay || this.state.currentDay,
                departments: departments || this.state.departments,
                employees: employees || this.state.employees,
                unavailabilities: unavailabilities || this.state.unavailabilities,
                shifts: fetchedShifts as Shift[],
                fetchState: FetchState.OK,
            });
        }
    };

    /**
     * Adds a shift to the DB and refreshes the state (Halfway through the function chain)
     * @param shiftEvent The shift to add
     */
    readonly #addShift = async (shiftEvent: EventForShiftCreation): Promise<void> => {
        //Create Shift
        const error = await API.createShift({
            employeeId: shiftEvent.employeeId,
            start: shiftEvent.start,
            end: shiftEvent.end,
            department: this.state.currentDepartment.name,
        });
        if (this.manageError(error, errors.CREATE_SHIFT)) {
            //Refresh shifts
            await this.getShifts();
        }
    };

    /**
     * Edits a shift in the DB and refreshes the state (Halfway through the function chain)
     * @param shiftEvent The shift to add
     */
    readonly #editShift = async (shiftEvent: EventForShiftEdit): Promise<void> => {
        //Create Shift
        const error = await API.editShift({
            id: shiftEvent.id,
            employeeId: shiftEvent.employeeId,
            start: shiftEvent.start,
            end: shiftEvent.end,
            department: this.state.currentDepartment.name,
        });
        if (this.manageError(error, errors.EDIT_SHIFT)) {
            //Refresh shifts
            await this.getShifts();
        }
    };

    /**
     * Deletes a shift in the DB and refreshes the state (Halfway through the function chain)
     * @param shiftEvent The id of the shift to delete
     */
    readonly #deleteShift = async (shiftEvent: EventForShiftEdit): Promise<void> => {
        //Delete shift
        const error = await API.deleteShift({
            id: shiftEvent.id,
            employeeId: shiftEvent.employeeId,
            start: shiftEvent.start,
            end: shiftEvent.end,
            department: this.state.currentDepartment.name,
        });
        if (this.manageError(error, errors.DELETE_SHIFT)) {
            //Refresh shifts
            await this.getShifts();
        }
    };

    /**
     * Changes the current day and refreshes the state (Halfway through the function chain)
     * @param newDay The day to change to
     */
    readonly #changeDay = async (newDay: DayPilot.Date): Promise<void> => {
        await this.getShifts(newDay);
    };

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

    /**
     * Converts the shift into events for the Daypilot calendar
     * @param shifts the Shift objects to convert
     * @returns the converted shifts
     */
    private getEventsForCalendarFromShifts(shifts: Shift[]): EventForCalendar[] {
        const events: EventForCalendar[] = [];
        for (const shift of shifts) {
            const startText = DateManager.convertTimestampToDayPilotDate(shift.start);
            const endText = DateManager.convertTimestampToDayPilotDate(shift.end);
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
}
