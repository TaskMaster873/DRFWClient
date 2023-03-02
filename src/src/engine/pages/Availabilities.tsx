import React from "react";
import {
    DateOfUnavailabilityList,
    DAYS,
    EmployeeAvailabilities,
    EmployeeAvailabilitiesForCreate,
    EmployeeRecursiveException
} from "../types/EmployeeAvailabilities";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";
import {DateManager} from '../utils/DateManager';
import {DayPilot} from "daypilot-pro-react";

import '../../deps/css/daypilot_custom.css';
import {ComponentAvailabilitiesPopup} from "../components/ComponentAvailabilitiesPopup";
import {Timestamp} from "firebase/firestore";
import {API} from "../api/APIManager";
import {Container} from "react-bootstrap";


export interface AvailabilitiesState {
    availabilities: EmployeeAvailabilities;
    timesUnavailable: DayPilot.EventData[];
    popupActive: boolean;

    currentWeekStart: Date;
    currentWeekEnd: Date;
    selectedDate: Date;
}

/**
 * Get the first and last day of the current week
 * NON TERMINER
 */
let curr = new Date;
let firstDay = new Date((new Date(curr.setDate(curr.getDate() - curr.getDay()))).setHours(0, 0, 0, 0));
let lastDay = new Date((new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))).setHours(0, 0, 0, 0));

export class Availabilities extends React.Component<unknown, AvailabilitiesState> {


    //It is to have acces more easily to the datepicker and calendar getters and their public methods
    private componentAvailabilitiesRef: React.RefObject<ComponentAvailabilities> = React.createRef();

    //It is a placeholder value, because the db doesn't exist for now.
    public state: AvailabilitiesState = {
        availabilities: {
            recursiveExceptions: [{
                [DAYS.SUNDAY]: [
                    {
                        startTime: 0,
                        endTime: 60
                    },
                ],
                [DAYS.MONDAY]: [
                    {
                        startTime: 60,
                        endTime: 60 + 60
                    }
                ],
                [DAYS.TUESDAY]: [
                    {
                        startTime: 120,
                        endTime: 120 + 60
                    }
                ],
                [DAYS.WEDNESDAY]: [],
                [DAYS.THURSDAY]: [],
                [DAYS.FRIDAY]: [],
                [DAYS.SATURDAY]: [],

            }, {
                startDate: "2023-02-19T00:00:00",
                endDate: "2023-02-26T23:59:59",
                [DAYS.SUNDAY]: [],
                //time not available
                [DAYS.MONDAY]: [],
                [DAYS.TUESDAY]: [],
                [DAYS.WEDNESDAY]: [],
                [DAYS.THURSDAY]: [],

                [DAYS.FRIDAY]: [],
                [DAYS.SATURDAY]: [],

            }],
            employeeId: "",
        },
        currentWeekStart: firstDay,
        currentWeekEnd: lastDay,
        timesUnavailable: [],
        popupActive: true,
        selectedDate: new Date,
    };


    get componentAvailability() {
        return this.componentAvailabilitiesRef?.current;
    }

    public componentDidMount() {
        document.title = "Disponibilitées - TaskMaster";
    }

    private isInTimeRangeFromStartDate(date: Date, startDate: Date): boolean {
        return date >= startDate;
    }

    private isInTimeRangeFromEndDate(date: Date, endDate: Date): boolean {
        return date <= endDate;
    }

    readonly #getStartData = (): DayPilot.EventData[] => {
        return this.computeAllAvailabilities(this.state.currentWeekStart, this.state.currentWeekEnd, this.state.selectedDate);
    };

    readonly #onTimeRangeSelected = (start: Date, end: Date, selectedDate: Date): DayPilot.EventData[] => {
        return this.computeAllAvailabilities(start, end, selectedDate);
    };

    public render(): JSX.Element {
        return (
            <div>
                <Container className="justify-content-end">
                    <button type="button" className="btn btn-primary" onClick={() => this.#hideModal(false)}>Sauvegarder</button>
                </Container>
                <ComponentAvailabilities getStartData={this.#getStartData}
                    onTimeRangeSelected={this.#onTimeRangeSelected}
                    isCellInStartToEndTimeRange={this.#isCellInStartToEndTimeRange}
                    startDate={new DayPilot.Date(this.state.currentWeekStart)}
                    selectionDay={new DayPilot.Date(this.state.selectedDate)}
                    employeeAvailabilities={this.state.timesUnavailable}
                    ref={this.componentAvailabilitiesRef} />
                <ComponentAvailabilitiesPopup
                    hideModal={this.#hideModal}
                    isShown={this.state.popupActive}
                    start={this.toUTC(this.state.currentWeekStart)}
                    end={this.toUTC(this.state.currentWeekEnd)}
                    availabilityAdd={this.#createNewAvailabilityRequest}
                />
            </div>
        );
    }

    readonly #createNewAvailabilityRequest = async (start?: Timestamp, end?: Timestamp): Promise<void> => {
        let starts;
        let ends;
        let unavailabilitiesInCalendar = this.componentAvailability?.getListFromTheCalendar();
        let datesList: DateOfUnavailabilityList = [];
        if (unavailabilitiesInCalendar) {
            //let unavailabilitiesFiltered = this.sortFromStart(unavailabilitiesInCalendar);
            console.log("calendar", unavailabilitiesInCalendar);
            datesList = this.transformListIntoDateList(unavailabilitiesInCalendar);
            console.log("list de date", datesList);
        }


        if (start) {
            starts = DateManager.getDayPilotDateString(start);
        }
        if (end) {
            ends = DateManager.getDayPilotDateString(end);
        }
        // let date = this.toUTC(this.state.currentWeekStart).addHours(2);
        //let ok = date.getHours()*60 + date.getMinutes();
        //console.log("ok", ok);
        let listCreate: EmployeeAvailabilitiesForCreate = {
            recursiveExceptions: {
                startDate: starts ?? undefined,
                endDate: ends ?? undefined,
                [DAYS.SUNDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.SUNDAY, datesList),
                [DAYS.MONDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.MONDAY, datesList),
                [DAYS.TUESDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.TUESDAY, datesList),
                [DAYS.WEDNESDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.WEDNESDAY, datesList),
                [DAYS.THURSDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.THURSDAY, datesList),
                [DAYS.FRIDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.FRIDAY, datesList),
                [DAYS.SATURDAY]: DateManager.getCertainDayOfWeekUnavailabilities(DAYS.SATURDAY, datesList)
            },
            start: start,
            end: end
        };

        await API.pushAvailabilitiesToManager(listCreate);

        console.log(this.componentAvailability?.getListFromTheCalendar());
    };

    private transformListIntoDateList(unavailabilitiesInCalendar: DayPilot.EventData[]): DateOfUnavailabilityList {
        let listSortedByStart: DateOfUnavailabilityList = [];
        for (let eventData of unavailabilitiesInCalendar) {
            listSortedByStart.push({start: new Date(eventData.start as string), end: new Date(eventData.end as string)});
        }

        return listSortedByStart;

    }

    readonly #hideModal = (active: boolean): void => {
        this.setState({popupActive: active});
    };

    private convertRecursiveExceptionDate(startDate: Date, day: number, numberOfMinutes: number): Date {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);
        date.setHours(numberOfMinutes / 60);
        date.setMinutes(numberOfMinutes % 60);

        return date;
    }

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
    private transformObjToEventForUnavailability(start: Date, day: number, hours: EmployeeRecursiveException): DayPilot.EventData {
        let startTime = this.convertRecursiveExceptionDate(start, day, hours.startTime);
        let endTime = this.convertRecursiveExceptionDate(start, day, hours.endTime);

        return {
            start: this.toUTC(startTime),
            end: this.toUTC(endTime),
            text: "Unavailable",
            id: "unavailable",
        };
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
                    if (day === 'startDate' || day === 'endDate') {
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
     * @param selectedDate The selected date
     * @private
     * @returns {DayPilot.EventData[]} The list of all the availabilities for the current week and the selected day.
     * @memberof Availabilities
     */
    private computeAllAvailabilities(start: Date, end: Date, selectedDate: Date): DayPilot.EventData[] {
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
                    if (day === 'startDate' || day === 'endDate') {
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
