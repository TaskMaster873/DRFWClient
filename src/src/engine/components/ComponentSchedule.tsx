import React from "react";
import { EmployeeList, Employee } from "../types/Employee";
import {DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

/**
 * Ceci est le composant d'horaire
 */
export class ComponentSchedule extends React.Component {
    private list: Employee[] = [];
    constructor(props: EmployeeList) {
        super(props);
        this.list = props.list;

        this.state = {
            
            viewType: "Resources",
            startDate: DayPilot.Date.today(),
            columns: [
                { name: "Room 1", id: "R1" },
                { name: "Room 2", id: "R2" },
                { name: "Room 3", id: "R3" },
                { name: "Room 4", id: "R4" },
                { name: "Room 5", id: "R5" },
                { name: "Room 6", id: "R6" },
                { name: "Room 7", id: "R7" },
            ],
        };
    }

    /**
     * 
     * @returns la liste des nom d'employé formatté pour columns de DayPilotCalendar
     *
     */
    private doColumns() {
        let listToReturn: Array<{ name: string, id: string }>;
        listToReturn = [];
        for (let index = 0; index < this.list.length; index++) {
            listToReturn.push({ name: this.list[index].name, id: this.list[index].no.toString() });
        }
        return listToReturn;
    }

    private doEvents() {
        let listToReturn: Array<{ id: number, text: string, start: string, end: string, resource: string }>;
        listToReturn = [];
        listToReturn.push({ id: 1, text: "Event 1", start: DayPilot.Date.today(), end: DayPilot.Date.now(), resource: '1' });
        return listToReturn;
    }
    public render(): JSX.Element {
        if (this.list === undefined || this.list.length == 0) {
            return (
                <div> Il n'y a pas d'horaire à voir</div>
            );
        }
        else return (
            <DayPilotCalendar viewType={"Resources"} columns={this.doColumns()} events= { this.doEvents() } ></DayPilotCalendar>
            /* <div>
            <DayPilotCalendar
            {...this.state} />
            </div>*/
        );
    }
}
