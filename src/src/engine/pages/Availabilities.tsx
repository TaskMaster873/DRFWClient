import React from "react";
import {DAYS, EmployeeAvailabilities, EmployeeRecursiveException} from "../types/EmployeeAvailabilities";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";
import { DayPilot } from "daypilot-pro-react";

import '../../deps/css/daypilot_custom.css';

/**
 * Ceci est la page pour ajouter un employé
 */

export interface AvailabilitiesState {
    availabilities: EmployeeAvailabilities;
    timesUnavailable: DayPilot.EventData[];
    popupActive: boolean;

    currentWeekStart: Date;
    currentWeekEnd: Date;
    selectedDate: Date;
}

let curr = new Date;
let firstday = new Date ((new Date(curr.setDate(curr.getDate() - curr.getDay()))).setHours(0,0,0,0));
let lastday = new Date ((new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))).setHours(0,0,0,0));

export class Availabilities extends React.Component<unknown, AvailabilitiesState> {
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
                //time not available
                [DAYS.MONDAY]: [
                    {
                        startTime: 60,
                        endTime: 60+60
                    }
                ],
                [DAYS.TUESDAY]: [
                    {
                        startTime: 120,
                        endTime: 120+60
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
        currentWeekStart: firstday,
        currentWeekEnd: lastday,
        timesUnavailable: [],
        popupActive: false,
        selectedDate: new Date,
    };

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
    }

    readonly #onTimeRangeSelected = (start: Date, end: Date, selectedDate: Date): DayPilot.EventData[] => {
        return this.computeAllAvailabilities(start, end, selectedDate);
    };

    public render(): JSX.Element {
        return (
            <div>
                <button type="button" className="btn btn-primary">Primary</button>
                <ComponentAvailabilities getStartData={this.#getStartData}
                                         onTimeRangeSelected={this.#onTimeRangeSelected}
                                         isCellInStartToEndTimeRange={this.#isCellInStartToEndTimeRange}
                                         startDate={new DayPilot.Date(this.state.currentWeekStart)}
                                         selectionDay={new DayPilot.Date(this.state.selectedDate)}
                                         employeeAvailabilities={this.state.timesUnavailable} />
            </div>
        );
    }

    /**
     * This function will compute all the availabilities for the current week and the selected day.
     * @description This function will compute all the availabilities for the current week and the selected day.
     * @param startDate
     * @param day
     * @param numberOfMinutes
     * @private
     */
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
            let canRenderData: boolean = true;
            if (recursive.startDate) {
                if (!this.isInTimeRangeFromStartDate(startDate.toDateLocal(), new Date(recursive.startDate))) {
                    canRenderData = false;
                }
            }

            if (recursive.endDate && canRenderData) {
                if (!this.isInTimeRangeFromEndDate(endDate.toDateLocal(), new Date(recursive.endDate))) {
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

                            const eventToPush: DayPilot.EventData = this.transformObjToEventForUnavailability(weekStart.toDateLocal(), dayNumber, recursive[day][i]);

                            let eventStart = new Date((eventToPush.start as DayPilot.Date).toDateLocal());
                            let eventEnd = new Date((eventToPush.end as DayPilot.Date).toDateLocal());

                            let startDateTime = new Date(startDate.toDateLocal());
                            let endDateTime = new Date(endDate.toDateLocal());
                            //console.log(eventStart, eventEnd, startDateTime, endDateTime, eventStart.getTime() >= startDateTime.getTime(), eventEnd.getTime() <= endDateTime.getTime());

                            if(eventStart.getTime() <= startDateTime.getTime() && endDateTime.getTime() <= eventEnd.getTime()) {
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

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
                            //console.log(DAYS[day], DAYS[DAYS[day]], start, recursive[day][i], i, eventToPush);
                            listOfUnavailbility.push(eventToPush);
                        }
                    }
                }
            }
        }

        return listOfUnavailbility;
    }
}

