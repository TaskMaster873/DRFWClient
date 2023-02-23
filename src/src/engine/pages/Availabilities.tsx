import React from "react";
import {DAYS, EmployeeAvailabilities, EmployeeRecursiveExceptionList} from "../types/EmployeeAvailabilities";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";
import {DayPilot} from "@daypilot/daypilot-lite-react";

/**
 * Ceci est la page pour ajouter un employé
 */

export interface AvailabilitiesState {
    availabilities: EmployeeAvailabilities;
    timesUnavailable?: EmployeeRecursiveExceptionList;

}

export class Availabilities extends React.Component<{}, AvailabilitiesState> {
    //It is a placeholder value, because the db doesn't exist for now.
    public state = {
        availabilities: {
            recursiveExceptions: [{
                startDate: "2023-02-26T00:00:00",
                endDate: "2023-03-04T00:00:00",
                [DAYS.SUNDAY]: [],
                //time not available
                [DAYS.MONDAY]: [
                    {
                        startHour: 0,
                        endHour: 24
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
        timesUnavailable: []

    };

    public componentDidMount() {
        document.title = "Disponibilitées - TaskMaster";
        this.computeAllAvailabilities();
    }

    public render(): JSX.Element {
        return (
            //The ... will need some changes here 
            <ComponentAvailabilities {...{employeeAvailabilities: this.state.availabilities}} />
        );
    }

    private computeAllAvailabilities(): void {

       const numberOfDays = 7;
        let startDate = this.state.availabilities.recursiveExceptions[0].startDate;
        let endDate = this.state.availabilities.recursiveExceptions[0].endDate;
        console.log("thelength", this.state.availabilities.recursiveExceptions.length);
        console.log("dates:", startDate, endDate);
        for(let recursive of this.state.availabilities.recursiveExceptions)
        {   
            for (let index = 0; index < numberOfDays; index++) {
                if(recursive[index] > 0) {
                    console.log("length:",recursive[index].length, index);
                    this.state.timesUnavailable.push
                }
               
                //const element = recursive[index];
                
            }
            
        }
    }

    private getAllDaysInArray() {

    }
}
