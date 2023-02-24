import React from "react";
import {DAYS, EmployeeAvailabilities, eventsForUnavailabilityList, eventsForUnavailability, EmployeeRecursiveException} from "../types/EmployeeAvailabilities";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";
import {ManagerDate} from '../utils/DateManager';

/**
 * Ceci est la page pour ajouter un employé
 */

export interface AvailabilitiesState {
    availabilities: EmployeeAvailabilities;
    timesUnavailable: eventsForUnavailabilityList;
    popupActive: boolean;

    currentWeekStart: Date;
    currentWeekEnd: Date;
}

let curr = new Date;
let firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
let lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));

export class Availabilities extends React.Component<unknown, AvailabilitiesState> {
    //It is a placeholder value, because the db doesn't exist for now.

    public state: AvailabilitiesState = {
        availabilities: {
            recursiveExceptions: [{
                [DAYS.SUNDAY]: [],
                //time not available
                [DAYS.MONDAY]: [
                    {
                        startTime: 15,
                        endTime: 360
                    },
                    {
                        startTime: 700,
                        endTime: 820
                    }
                ],
                [DAYS.TUESDAY]: [],
                [DAYS.WEDNESDAY]: [],
                [DAYS.THURSDAY]: [],
                [DAYS.FRIDAY]: [],
                [DAYS.SATURDAY]: [],

            }, {
                startDate: "2023-02-19T00:00:00",
                endDate: "2023-02-26T00:00:00",
                [DAYS.SUNDAY]: [],
                //time not available
                [DAYS.FRIDAY]: [
                    {
                        startTime: 15,
                        endTime: 360
                    },
                    {
                        startTime: 700,
                        endTime: 820
                    }
                ],
                [DAYS.TUESDAY]: [],
                [DAYS.WEDNESDAY]: [],
                [DAYS.THURSDAY]: [],
                [DAYS.MONDAY]: [],
                [DAYS.SATURDAY]: [],

            }],
            employeeId: "",
        },
        currentWeekStart: firstday,
        currentWeekEnd: lastday,
        timesUnavailable: [],
        popupActive: false,
    };

    public componentDidMount() {
        document.title = "Disponibilitées - TaskMaster";
        this.computeAllAvailabilities(this.state.currentWeekStart, this.state.currentWeekEnd);
    }

    private isInTimeRangeFromStartDate(date: Date, startDate: Date): boolean {
        return date >= startDate;
    }

    private isInTimeRangeFromEndDate(date: Date, endDate: Date): boolean {
        return date <= endDate;
    }

    readonly #onTimeRangeSelected = (start: Date, end: Date) : void => {
        /*this.setState({
            currentWeekEnd: end,
            currentWeekStart: start,
        }, () => {
            this.computeAllAvailabilities();
        });*/

        this.computeAllAvailabilities(start, end);
    }

    public render(): JSX.Element {
        return (
            //The ... will need some changes here 
            <div>
                <button type="button" className="btn btn-primary">Primary</button>
                <ComponentAvailabilities onTimeRangeSelected={this.#onTimeRangeSelected} employeeAvailabilities={this.state.timesUnavailable} />
            </div>
        );
    }

    /**
     * Compute the availabilities in the state to convert it for daypilot 
     */
    private computeAllAvailabilities(start: Date, end: Date): void {
        let listOfUnavailbility: eventsForUnavailabilityList = [];

        for (let recursive of this.state.availabilities.recursiveExceptions) {
            let canRenderData: boolean = true;
            if(recursive.startDate) {
                if(!this.isInTimeRangeFromStartDate(start, new Date(recursive.startDate))) {
                    canRenderData = false;
                }
            }

            if(recursive.endDate && canRenderData) {
                if(!this.isInTimeRangeFromEndDate(end, new Date(recursive.endDate))) {
                    canRenderData = false;
                }
            }

            if(canRenderData) {
                for (let day in recursive) {
                    if(day === 'startDate' || day === 'endDate') {
                        continue;
                    }

                    if (recursive[day].length > 0) {
                        for (let i = 0; i < recursive[day].length; i++) {
                            const eventToPush = this.transformForDayPilot(start, recursive[day][i]);
                            listOfUnavailbility.push(eventToPush);
                        }
                    }
                }
            }
        }

        console.log(listOfUnavailbility);
        this.setState({
            timesUnavailable: listOfUnavailbility,
        });

        /*
        const numberOfDaysAWeek = 7;
        let startDate = new Date(this.state.availabilities.recursiveExceptions[0].startDate);
        let endDate = new Date(this.state.availabilities.recursiveExceptions[0].endDate);
        let dateToIncrement = startDate;

        console.log(dateToIncrement);

        console.log(startDate);

        for (let recursive of this.state.availabilities.recursiveExceptions) {
            let i = 0;
            while (dateToIncrement < endDate) {
                if (recursive[i].length > 0) {
                    console.log("length:", recursive[i], i);
                    //to pushThisIntoTheStateAtTheEnd
                    for (let j = 0; j < recursive[i].length; j++) {
                        console.log("le i j:", recursive[i][j]);
                        const eventToPush = this.transformForDayPilot(dateToIncrement, recursive[i][j]);
                        listOfUnavailbility.push(eventToPush);
                        console.log("length de la liste to return:", listOfUnavailbility.length);
                    }

                }
                dateToIncrement = ManagerDate.addDaysToADate(1, dateToIncrement);

                i++;

                if (i == numberOfDaysAWeek) {
                    i = 0;
                }

            }
            console.log("final list:", listOfUnavailbility);


        }*/

        /*this.setState({
            timesUnavailable: listOfUnavailbility,
        });*/
    }

    private transformForDayPilot(startTime: Date, hours: EmployeeRecursiveException): eventsForUnavailability {
        // console.log("la date transformée", data, "et le jour de base:", startTime, hours.startTime);
        let listToReturn: eventsForUnavailability;
        //console.log(data);
        listToReturn = {
            start: ManagerDate.addHoursAndMinutes(hours.startTime, startTime),
            end: ManagerDate.addHoursAndMinutes(hours.endTime, startTime),
            text: "yo "
        };

        console.log("hours:", startTime, hours);


        return listToReturn;
    }


}

