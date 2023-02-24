import React from "react";
import {DAYS, EmployeeAvailabilities, EmployeeRecursiveExceptionList, eventsForUnavailabilityList, eventsForUnavailability, EmployeeRecursiveException} from "../types/EmployeeAvailabilities";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {ManagerDate} from '../utils/DateManager';
import {Container} from "react-bootstrap";

/**
 * Ceci est la page pour ajouter un employé
 */

export interface AvailabilitiesState {
    availabilities: EmployeeAvailabilities;
    timesUnavailable?: eventsForUnavailabilityList;
    popupActive: boolean;

}


export class Availabilities extends React.Component<{}, AvailabilitiesState> {
    //It is a placeholder value, because the db doesn't exist for now.
    public state = {
        availabilities: {
            recursiveExceptions: [{
                startDate: "2023-02-26T00:00:00",
                endDate: "2023-03-11T00:00:00",
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

            }],
            employeeId: "",
        },
        timesUnavailable: [],
        popupActive: false,

    };

    public componentDidMount() {
        document.title = "Disponibilitées - TaskMaster";
        this.setState({timesUnavailable: this.computeAllAvailabilities()});
    }

    public render(): JSX.Element {
        return (
            //The ... will need some changes here 
            <div>
                <button type="button" className="btn btn-primary">Primary</button>
                <ComponentAvailabilities employeeAvailabilities={this.state.timesUnavailable} />

            </div>

        );
    }

    /**
     * Compute the availabilities in the state to convert it for daypilot 
     */
    private computeAllAvailabilities(): eventsForUnavailabilityList {

        let listOfUnavailbility: eventsForUnavailabilityList = [];
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


        }
        return listOfUnavailbility;
    }

    private transformForDayPilot(startTime: Date, hours: EmployeeRecursiveException): eventsForUnavailability {
        console.log("hours:", hours);


        // console.log("la date transformée", data, "et le jour de base:", startTime, hours.startTime);
        let listToReturn: eventsForUnavailability;
        //console.log(data);
        listToReturn = {
            start: ManagerDate.addHoursAndMinutes(hours.startTime, startTime),
            end: ManagerDate.addHoursAndMinutes(hours.endTime, startTime),
            text: "yo "
        };


        return listToReturn;
    }


}

