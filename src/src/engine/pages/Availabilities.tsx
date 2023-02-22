import React from "react";
import {DAYS, EmployeeAvailabilities} from "../types/EmployeeAvailabilities";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";
import {DayPilot} from "@daypilot/daypilot-lite-react";

/**
 * Ceci est la page pour ajouter un employé
 */
export class Availabilities extends React.Component {
    //It is a placeholder value, because the db doesn't exist for now.
    private availabilities: EmployeeAvailabilities = {
        recursiveExceptions: {
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
            [DAYS.SUNDAY]: [],
        },
        employeeId: "",
        exception: [{
            startDate: new Date(),
            endDate: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7))
        }],
       
    };

    public componentDidMount() {
        document.title = "Disponibilitées - TaskMaster";
    }

    public render(): JSX.Element {
        let events = {
            id: 0,
            text: 'a',
            start: DayPilot.Date,
            end: DayPilot.Date
        };

        return (
            //The ... will need some changes here 
            <ComponentAvailabilities {...{employeeAvailabilities: this.availabilities}} />
        );
    }
}
