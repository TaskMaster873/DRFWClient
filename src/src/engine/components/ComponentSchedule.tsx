import React from "react";
import { EmployeeList, Employee } from "../types/Employee";
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";

export class ComponentSchedule extends React.Component {
    private list: Employee[] = [];
    constructor(props: EmployeeList) {
        super(props);
        this.list = props.list;

        this.state = {
            viewType: "Resources",
            startDate: "2022-11-07",
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

    private doColumns() {
        let listToReturn: Array<{ name: string, id: string }>;
        listToReturn = [];
        for (let index = 0; index < this.list.length; index++) {
            listToReturn.push({ name: this.list[index].name, id: this.list[index].no.toString() });
        }
        return listToReturn;
    }

    public render(): JSX.Element {
        if(this.list === undefined || this.list.length == 0){
            return (
                <div> Vous n'avez pas d'horaire à regarder </div>
            );
        }
        else return (
            <DayPilotCalendar viewType={"Resources"} columns={this.doColumns()} />
            /* <div>
            <DayPilotCalendar
            {...this.state} />
            </div>*/
        );
    }
}
