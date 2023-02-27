import React from "react";
import {DAYS, EmployeeAvailabilities, EventsForUnavailabilityList, EventsForUnavailability, EmployeeRecursiveException} from "../types/EmployeeAvailabilities";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";
import {ManagerDate} from '../utils/DateManager';
import { DayPilot } from "@daypilot/daypilot-lite-react";

import '../../deps/css/daypilot_custom.css';

/**
 * Ceci est la page pour ajouter un employé
 */

export interface AvailabilitiesState {
    availabilities: EmployeeAvailabilities;
    timesUnavailable: EventsForUnavailabilityList;
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
                        startTime: 120,
                        endTime: 120+60
                    }
                ],
                [DAYS.TUESDAY]: [
                    {
                        startTime: 120+60+60,
                        endTime: 120+60+60+60
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

        this.computeAllAvailabilities(this.state.currentWeekStart, this.state.currentWeekEnd, this.state.selectedDate);
    }

    private isInTimeRangeFromStartDate(date: Date, startDate: Date): boolean {
        return date >= startDate;
    }

    private isInTimeRangeFromEndDate(date: Date, endDate: Date): boolean {
        return date <= endDate;
    }

    readonly #onTimeRangeSelected = (start: Date, end: Date, selectedDate: Date): void => {
        /*this.setState({
            currentWeekEnd: end,
            currentWeekStart: start,
        }, () => {
            this.computeAllAvailabilities();
        });*/

        this.computeAllAvailabilities(start, end, selectedDate);
    };

    public render(): JSX.Element {
        return (
            <div>
                <button type="button" className="btn btn-primary">Primary</button>
                <ComponentAvailabilities onTimeRangeSelected={this.#onTimeRangeSelected} startDate={new DayPilot.Date(this.state.currentWeekStart)} selectionDay={new DayPilot.Date(this.state.selectedDate)} employeeAvailabilities={this.state.timesUnavailable} />
            </div>
        );
    }

    private convertRecursiveExceptionDate(startDate: Date, day: number, numberOfMinutes: number): Date {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);
        date.setHours(Math.floor(numberOfMinutes / 60));
        date.setMinutes(numberOfMinutes % 60);

        return date;
    }

    private transformObjToEventForUnavailability(start: Date, day: number, hours: EmployeeRecursiveException): EventsForUnavailability {
        let startTime = this.convertRecursiveExceptionDate(start, day, hours.startTime);
        let endTime = this.convertRecursiveExceptionDate(start, day, hours.endTime);

        return {
            start: ManagerDate.changeDateToDayPilotFormat(startTime),
            end: ManagerDate.changeDateToDayPilotFormat(endTime),
            text: "Unavailable"
        };
    }

    /**
     * Compute the availabilities in the state to convert it for daypilot 
     */
    private computeAllAvailabilities(start: Date, end: Date, selectedDate: Date): void {
        let listOfUnavailbility: EventsForUnavailabilityList = [];

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
                            console.log(DAYS[day], DAYS[DAYS[day]], start, recursive[day][i], i, eventToPush);
                            listOfUnavailbility.push(eventToPush);
                        }
                    }
                }
            }
        }

        this.setState({
            currentWeekStart: start,
            currentWeekEnd: end,
            timesUnavailable: listOfUnavailbility,
        });
    }
}

