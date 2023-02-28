import React from "react";
import {DAYS, EmployeeAvailabilities, eventsForUnavailabilityList, eventsForUnavailability, EmployeeRecursiveException, EmployeeAvailabilitiesForCreate} from "../types/EmployeeAvailabilities";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";
import { ComponentAvailabilitiesPopup } from "../components/ComponentAvailabilitiesPopup";
import {ManagerDate} from '../utils/DateManager';
import {DayPilot} from "@daypilot/daypilot-lite-react";
import { API } from "../api/APIManager";
import {Timestamp} from "firebase/firestore";


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
let firstday = new Date((new Date(curr.setDate(curr.getDate() - curr.getDay()))).setHours(0, 0, 0, 0));
let lastday = new Date((new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))).setHours(0, 0, 0, 0));

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
        console.log(this.state);
        this.computeAllAvailabilities(this.state.currentWeekStart, this.state.currentWeekEnd);
        //this.#addAvailability();
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

               < ComponentAvailabilitiesPopup availabilityAdd={this.#addAvailability} isShown={this.state.popupActive} hideModal={this.#hideModal} start={DayPilot.Date.today()} end={DayPilot.Date.today()}></ComponentAvailabilitiesPopup>

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

    readonly #addAvailability = async (): Promise<void> => {
        let tryToAddToApi: EmployeeAvailabilitiesForCreate = {
            recursiveExceptions: {
                [DAYS.SUNDAY]: [{
                    startTime: 15,
                    endTime: 360
                },
                ],
                //time not available
                [DAYS.MONDAY]: [

                    {
                        startTime: 700,
                        endTime: 820
                    }
                ],
                [DAYS.TUESDAY]: [{
                    startTime: 500,
                    endTime: 620
                }],
                [DAYS.WEDNESDAY]: [],
                [DAYS.THURSDAY]: [],
                [DAYS.FRIDAY]: [],
                [DAYS.SATURDAY]: [],

            },
            employeeId: "yo",
            start: Timestamp.now(),
            end: Timestamp.now(),

        }
        await API.pushAvailabilitiesToManager(tryToAddToApi);
    }



    private showModal = (): void => {
        this.setState({popupActive: true});

    };

    /**
	 * When you close the modal window, this function is called in order to hide it
	 */
	readonly #hideModal = () => {
		this.setState({
			popupActive: false
		})
	}

    /**
     * Compute the availabilities in the state to convert it for daypilot
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

        //this.state.timesUnavailable = listOfUnavailbility;

        return listOfUnavailbility;
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
