import React from "react";
import {
    DateOfUnavailabilityList,
    DAYS,
    EmployeeAvailabilities,
    EmployeeAvailabilitiesForCreate,
    EmployeeAvailabilityException
} from "../types/EmployeeAvailabilities";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";
import {DateManager} from "../utils/DateManager";
import {DayPilot} from "daypilot-pro-react";

import "../../deps/css/daypilot_custom.css";
import {ComponentAvailabilitiesPopup} from "../components/ComponentAvailabilitiesPopup";
import {API} from "../api/APIManager";
import {NotificationManager} from "../api/NotificationManager";
import {errors} from "../messages/FormMessages";
import {RoutesPath} from "../RoutesPath";
import {Roles} from "../types/Roles";
import {Navigate} from "react-router-dom";
import {successes} from "../messages/APIMessages";

enum FetchState {
    WAITING = 0,
    ERROR = 1,
}

export interface AvailabilitiesState {
    availabilities: EmployeeAvailabilities;
    timesUnavailable: DayPilot.EventData[];
    popupInactive: boolean;
    currentWeekStart: Date;
    currentWeekEnd: Date;
    selectedDate: Date;
    fetchState: FetchState;
    redirectTo: string | null;
}

/**
 * Get the first and last day of the current week
 *
 */
let curr = new Date;
let firstDay = new Date((new Date(curr.setDate(curr.getDate() - curr.getDay()))).setHours(0, 0, 0, 0));
let lastDay = new Date((new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))).setHours(0, 0, 0, 0));

export class Availabilities extends React.Component<unknown, AvailabilitiesState> {
    public state: AvailabilitiesState = {
        availabilities: {
            recursiveExceptions: [],
            employeeId: ""
        },
        currentWeekStart: firstDay,
        currentWeekEnd: lastDay,
        timesUnavailable: [],
        popupInactive: true,
        selectedDate: new Date,
        fetchState: FetchState.WAITING,
        redirectTo: null
    };
    //It is to have acces more easily to the datepicker and calendar getters and their public methods
    private componentAvailabilitiesRef: React.RefObject<ComponentAvailabilities> = React.createRef();

    constructor(props) {
        super(props);

        API.subscribeToEvent(this.onEvent.bind(this));
    }

    /**
     * get the child componentAvailability
     * @returns the componentAvailability child of the component
     */
    get componentAvailability() {
        return this.componentAvailabilitiesRef?.current;
    }

    public async componentDidMount() {
        document.title = "Disponibilit??s - TaskMaster";
    }

    public render(): JSX.Element {
        if (this.state.redirectTo) {
            return (<Navigate to={this.state.redirectTo}/>);
        } else {
            return (
                <div>
                    <button type="button"
                            className="btn btn-primary submit-abilities-button"
                            onClick={() => this.#hideModal(false)}>Transmettre
                    </button>

                    <ComponentAvailabilities
                        getStartData={this.#getStartData}
                        onTimeRangeSelected={this.#onTimeRangeSelected}
                        isCellInStartToEndTimeRange={this.#isCellInStartToEndTimeRange}
                        startDate={new DayPilot.Date(this.state.currentWeekStart)}
                        selectionDay={new DayPilot.Date(this.state.selectedDate)}
                        employeeAvailabilities={this.state.timesUnavailable}
                        ref={this.componentAvailabilitiesRef}/>
                    <ComponentAvailabilitiesPopup
                        hideModal={this.#hideModal}
                        isShown={this.state.popupInactive}
                        start={this.toUTC(this.state.currentWeekStart)}
                        end={this.toUTC(this.state.currentWeekEnd)}
                        availabilityAdd={this.#createNewAvailabilityRequest}
                    />
                </div>
            );
        }
    }

    private async onEvent(): Promise<void> {
        await this.verifyLogin();
    }

    /**
     * Check if the date given higher than the startDate
     * @param date
     * @param startDate is the start date and date is the date to check if it is higher than startDate
     * @returns a boolean of date >= startDate
     */
    private isInTimeRangeFromStartDate(date: Date, startDate: Date): boolean {
        return date >= startDate;
    }

    /**
     * Check if the date given lower than the endDate
     * @param date
     * @param endDate is the start date and date is the date to check if it is higher than endDate
     * @returns a boolean of date <= endDate
     */
    private isInTimeRangeFromEndDate(date: Date, endDate: Date): boolean {
        return date <= endDate;
    }

    /**
     * Go fetch in the API the data of the events
     * @returns  Promise<DayPilot.EventData[]>
     */
    readonly #getStartData = async (): Promise<DayPilot.EventData[]> => {
        const isLoggedIn: boolean = await this.verifyLogin();
        if (isLoggedIn) {
            if (API.hasPermission(Roles.EMPLOYEE)) {
                let recursiveException = await API.getCurrentEmployeeUnavailabilities();
                if (this.manageError(recursiveException, errors.GET_AVAILABILITIES)) {
                    if (typeof recursiveException === "string") {
                        NotificationManager.error(errors.GET_AVAILABILITIES, recursiveException);

                    } else if (recursiveException) {
                        //we need to do the 2 because Daypilot cannot render correctly
                        this.setState({availabilities: recursiveException});
                        this.state.availabilities = recursiveException;
                    }
                }
            }

        } else {
            NotificationManager.warn(errors.SORRY, errors.NO_PERMISSION);
        }
        return this.computeAllAvailabilities(this.state.currentWeekStart, this.state.currentWeekEnd);
    };

    /**
     * Check if the cell is in the time range of the start and end date
     * @param start the start date selected
     * @param end the end date selected
     * @returns {DayPilot.EventData[]}
     */
    readonly #onTimeRangeSelected = (start: Date, end: Date): DayPilot.EventData[] => {
        return this.computeAllAvailabilities(start, end);
    };

    /**
     * Create a new availability
     * @param start is optional and is for the start of a recursiveEvent
     * @param end is optional and is for the start of a recursiveEvent
     */
    readonly #createNewAvailabilityRequest = async (start: DayPilot.Date, end: DayPilot.Date): Promise<void> => {
        let unavailabilitiesInCalendar = this.componentAvailability?.getListFromTheCalendar();
        let datesList: DateOfUnavailabilityList = [];
        if (unavailabilitiesInCalendar) {
            datesList = this.transformListIntoDateList(unavailabilitiesInCalendar);
        }
        //add a recursive
        let listCreate: EmployeeAvailabilitiesForCreate = {
            recursiveExceptions: {
                startDate: start,
                endDate: end,
                [DAYS.SUNDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.SUNDAY, datesList),
                [DAYS.MONDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.MONDAY, datesList),
                [DAYS.TUESDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.TUESDAY, datesList),
                [DAYS.WEDNESDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.WEDNESDAY, datesList),
                [DAYS.THURSDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.THURSDAY, datesList),
                [DAYS.FRIDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.FRIDAY, datesList),
                [DAYS.SATURDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.SATURDAY, datesList)
            },
        };

        let error = await API.pushAvailabilitiesToManager(listCreate);
        if (!error) {
            NotificationManager.success(successes.AVAILABILITY_CREATED, successes.CREATED);
        } else {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, errors.AVAILABILITY_ERROR);
        }
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
            return false;
        }
        return true;
    }

    /**
     * Verify if the user is logged in
     * @private
     */
    private async verifyLogin(): Promise<boolean> {
        let isLoggedIn: boolean = false;
        await API.awaitLogin;

        const hasPerms = API.hasPermission(Roles.EMPLOYEE);
        if (!API.isAuth() || !hasPerms) {
            this.setState({
                redirectTo: RoutesPath.INDEX
            });
        } else {
            isLoggedIn = true;
        }

        return isLoggedIn;
    }

    /**
     *
     * @param unavailabilitiesInCalendar is the calendar to transform in Date the DayPilot format of the dates
     * @returns DateOfUnavailabilityList with the information in the @params
     */
    private transformListIntoDateList(unavailabilitiesInCalendar: DayPilot.EventData[]): DateOfUnavailabilityList {
        let listSortedByStart: DateOfUnavailabilityList = [];
        for (let eventData of unavailabilitiesInCalendar) {
            listSortedByStart.push({
                start: new Date(eventData.start as string),
                end: new Date(eventData.end as string)
            });
        }

        return listSortedByStart;
    }

    /**
     *
     * @param active change state of the modal (false = show)
     */
    readonly #hideModal = (active: boolean): void => {
        this.setState({popupInactive: active});
    };

    /**
     *
     * @param startDate the date to convert
     * @param day the day of the recursive ex: DAYS.SUNDAY
     * @param numberOfMinutes the minutes of the
     * @returns a Date in good format
     */
    private convertRecursiveExceptionDate(startDate: Date, day: number, numberOfMinutes: number): Date {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);
        date.setHours(numberOfMinutes / 60);
        date.setMinutes(numberOfMinutes % 60);

        return date;
    }

    /**
     *
     * @param date
     * @returns a formatted date into utc
     */
    private toUTC(date: Date): DayPilot.Date {
        return new DayPilot.Date(date, true);
    }

    /**
     * This function will compute all the availabilities for the current week and the selected day.
     * @param start The start of the week
     * @param day The selected day
     * @param hours The hours of the selected day
     * @private
     */
    private transformObjToEventForUnavailability(start: Date, day: number, hours: EmployeeAvailabilityException): DayPilot.EventData {
        let startTime = this.convertRecursiveExceptionDate(start, day, hours.startTime);
        let endTime = this.convertRecursiveExceptionDate(start, day, hours.endTime);

        return {
            start: this.toUTC(startTime),
            end: this.toUTC(endTime),
            text: this.transformToDayPilotText(this.toUTC(startTime), this.toUTC(endTime)),
            id: "",
        };
    }

    /**
     *
     * @param start date of the event
     * @param end date of the event
     * @returns A string containing the hours of the things
     */
    private transformToDayPilotText(start: DayPilot.Date, end: DayPilot.Date): string {
        return start.toString().slice(11, 16) + " ?? " + end.toString().slice(11, 16);
    }

    /**
     * This function will compute all the availabilities for the current week and the selected day.
     * @description This function will compute all the availabilities for the current week and the selected day.
     * @param weekStart The start of the week
     * @param startDate The start of the selected day
     * @param endDate The end of the selected day
     * @private
     * @returns {DayPilot.EventData[]} The list of all the availabilities for the current week and the selected day.
     * @memberof Availabilities
     */
    readonly #isCellInStartToEndTimeRange = (weekStart: DayPilot.Date, startDate: DayPilot.Date, endDate: DayPilot.Date): boolean => {
        if (this.state.availabilities.recursiveExceptions.length == 0) return false;
        for (let recursive of this.state.availabilities.recursiveExceptions) {
            let canRenderWeeklyData: boolean = true;
            if (recursive.startDate) {
                if (!this.isInTimeRangeFromStartDate(startDate.toDateLocal(), new Date(recursive.startDate))) {
                    canRenderWeeklyData = false;
                }
            }

            if (recursive.endDate && canRenderWeeklyData) {
                if (!this.isInTimeRangeFromEndDate(endDate.toDateLocal(), new Date(recursive.endDate))) {
                    canRenderWeeklyData = false;
                }
            }

            if (canRenderWeeklyData) {
                for (let day in recursive) {
                    if (day === "startDate" || day === "endDate") {
                        continue;
                    }

                    if (recursive[day].length > 0) {
                        for (let i = 0; i < recursive[day].length; i++) {
                            // This enum return a number but typescript thinks it's a string for some reasons.
                            let dayNumber = DAYS[DAYS[day]] as unknown as number;

                            const eventToPush: DayPilot.EventData = this.transformObjToEventForUnavailability(weekStart.toDateLocal(), dayNumber, recursive[day][i]);

                            let eventStart = new Date((eventToPush.start as DayPilot.Date).toDateLocal());
                            let eventEnd = new Date((eventToPush.end as DayPilot.Date).toDateLocal());

                            let startDateTime = new Date(startDate.toDateLocal());
                            let endDateTime = new Date(endDate.toDateLocal());

                            if (eventStart.getTime() <= startDateTime.getTime() && endDateTime.getTime() <= eventEnd.getTime()) {
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    };

    /**
     * This function will compute all the availabilities for the current week and the selected day.
     * @description This function will compute all the availabilities for the current week and the selected day.
     * @param start The start of the selected day
     * @param end The end of the selected day
     * @private
     * @returns {DayPilot.EventData[]} The list of all the availabilities for the current week and the selected day.
     * @memberof Availabilities
     */
    private computeAllAvailabilities(start: Date, end: Date): DayPilot.EventData[] {
        let listOfUnavailbility: DayPilot.EventData[] = [];

        for (let recursive of this.state.availabilities.recursiveExceptions) {
            let canRenderData: boolean = true;
            if (recursive.startDate) {
                if (!this.isInTimeRangeFromStartDate(start, new Date(recursive.startDate))) {
                    canRenderData = false;
                }
            }

            if (recursive.endDate && canRenderData) {
                if (!this.isInTimeRangeFromEndDate(end, new Date(recursive.endDate))) {
                    canRenderData = false;

                }
            }

            if (canRenderData) {
                for (let day in recursive) {
                    if (day === "startDate" || day === "endDate") {
                        continue;
                    }

                    if (recursive[day].length > 0) {
                        for (let i = 0; i < recursive[day].length; i++) {
                            // This enum return a number but typescript thinks it's a string for some reasons.
                            let dayNumber = DAYS[DAYS[day]] as unknown as number;

                            const eventToPush = this.transformObjToEventForUnavailability(start, dayNumber, recursive[day][i]);
                            listOfUnavailbility.push(eventToPush);
                        }
                    }
                }
            }
        }

        return listOfUnavailbility;
    }
}
