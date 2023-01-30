import React from "react";
import { EmployeeList, Employee } from "../types/Employee";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

/**
 * Ceci est le composant d'horaire
 */
export class ComponentSchedule extends React.Component {

    private list: Employee[] = [];
    private datePicker: DayPilot.DatePicker;
    private dateRef /*= React.createRef()*/;
    constructor(props: EmployeeList) {
        super(props);
        this.list = props.list;
        this.dateRef = React.createRef(); //DayPilot.Date.today();
        this.state = {
            businessBeginsHour: 8, //ce serait une state qu'il faudrait mettre
            businessEndsHour: 20,
            heightSpec: "Full",
            height: 2000,
            cellHeight: 20,
            cellDuration: 5,
            viewType: "Resources",
            showNonBusiness: false,
            startDate: DayPilot.Date.today(),
            columns: this.doColumns(), /*[
                { name: "Room 1", id: "R1" },
                { name: "Room 2", id: "R2" },
                { name: "Room 3", id: "R3" },
                { name: "Room 4", id: "R4" },
                { name: "Room 5", id: "R5" },
                { name: "Room 6", id: "R6" },
                { name: "Room 7", id: "R7" },
            ],*/
            events: this.doEvents(),
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
            listToReturn.push({ name: this.list[index].firstName + " " + this.list[index].name, id: this.list[index].no.toString() });
        }
        //this.setState({ columns: listToReturn })
        return listToReturn;
    }

    private doEvents() {
        let listToReturn: Array<{ id: number, text: string, start: string, end: string, resource: string, barColor: string }>;
        listToReturn = [];
        listToReturn.push({ id: 1, text: "Il faut mettre le temps et le titre", start: DayPilot.Date.today(), end: DayPilot.Date.now(), resource: '1', barColor: "#0C2840" });
        //this.setState({ events: listToReturn })
        return listToReturn;

    }

    componentDidMount() {

        this.datePicker = new DayPilot.DatePicker({
            target: this.dateRef.current,
            pattern: 'MMMM dd, yyyy',
            date: "2022-09-07",
            onTimeRangeSelected: (args: { start: any; }) => {
                this.setState({
                    startDate: args.start
                })
            }
        });

    }

    private getDateRef() {
        return this.dateRef;
    }

    private changeDate() {
        this.datePicker.show();
    }

    public render(): JSX.Element {
        /*this.doColumns();
        this.doEvents();*/
        if (this.list === undefined || this.list.length == 0) {
            return (
                <div> Il n'y a pas d'horaire à voir</div>
            );
        }
        else return (
            <div>
                <div className="toolbar">
                    <span ref={this.dateRef}></span> <button onClick={ev => this.changeDate()}>Change date</button>
                </div>
                <div>
                    <DayPilotCalendar
                        {...this.state} />
                </div>

            </div>

            /* <DayPilotCalendar businessBeginsHour={8} 
                    businessEndsHour={20}
                    heightSpec="Full"
                    height={2000}
                    cellHeight={20}
                    cellDuration={5}
                    viewType={"Resources"}
                    columns={this.doColumns()}
                    events={this.doEvents()}
                    showNonBusiness={false}
                ></DayPilotCalendar>*/
        );
    }
}
