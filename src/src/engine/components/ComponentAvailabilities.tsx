import React from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import {ScheduleGroups} from "../types/Schedule";
import "./ComponentPopupSchedule";
import {EventForCalendar} from "../types/Shift";
import {Availability, AvailabilityList} from "../types/Availability";
import {constants} from "../../../Constants/Constants";

/**
 * Ceci est le composant de disponibilitées
 */
export class ComponentAvailabilities extends React.Component {
    private list: Availability[] = [];
    private datePicker: DayPilot.DatePicker;
    private listEvent: EventForCalendar[] = [];
    private dateRef: React.RefObject<unknown> /*= React.createRef()*/;

    constructor(props: AvailabilityList) {
        super(props);
        this.list = props.list;
        this.dateRef = React.createRef(); //DayPilot.Date.today();
        this.state = {
            timeHeaders: [{"groupBy": "Month"}, {"groupBy": "Day", "format": "d"}],
            startDate: DayPilot.Date.today(),
            events: this.doEvents(),
        };
    }

    /*   get calendar() {
        return this.calendarRef.current.control;
    } */

    private doEvents(): EventForCalendar[] {


        this.listEvent.push({
            id: 1,
            text: "Il faut mettre le temps et le titre",
            start: DayPilot.Date.today(),
            end: DayPilot.Date.now(),
            resource: "1",
            barColor: "#0C2840",
        });
        return this.listEvent;
    }

    componentDidMount() {
    }

    loadGroups() {
        let data: ScheduleGroups = {
            groups: [
                {
                    name: "Locations",
                    id: "locations",
                    resources: [
                        {name: "Room 1", id: "R1"},
                        {name: "Room 2", id: "R2"},
                        {name: "Room 3", id: "R3"},
                        {name: "Room 4", id: "R4"},
                        {name: "Room 5", id: "R5"},
                        {name: "Room 6", id: "R6"},
                        {name: "Room 7", id: "R7"},
                    ],
                }
            ],
        };
        return data;
    }

    eventAdd = (args: { event: EventForCalendar }) => {
        console.log(args.event);
        this.listEvent.push({
            id: args.event.id,
            text: args.event.text,
            start: args.event.start,
            end: args.event.end,
            resource: args.event.resource,
            barColor: args.event.barColor,
        })
        this.setState({events: this.listEvent});
    }

    onTimeRangeSelected = (args: any) => {
        DayPilot.Calendar.clearSelection;
        this.listEvent.push({
            id: 1,
            text: args.text,
            start: args.start,
            end: args.end,
            resource: args.resource,
            barColor: args.barColor,
        })
        this.setState({events: this.listEvent});
    }

    public render(): JSX.Element {
        if (this.list === undefined || this.list.length == 0) {
            return <div> { constants.messageScheduleUnavailable }</div>;
        } else
            return (
                <div>
                    <DayPilotCalendar
                        businessBeginsHour={8}
                        businessEndsHour={20}
                        heightSpec={"Full"}
                        height={2000}
                        cellHeight={20}
                        cellDuration={5}
                        showNonBusiness={false}
                        onTimeRangeSelected={this.onTimeRangeSelected}
                        {...this.state}
                    />
                </div>
            );
    }
}