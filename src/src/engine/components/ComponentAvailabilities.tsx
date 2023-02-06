import React from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import "./ComponentPopupSchedule";
import {EventForCalendar} from "../types/Shift";
import {Availability, AvailabilityList} from "../types/Availability";
import { constants } from "../messages/FormMessages";

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
            timeHeaders: [{"groupBy": "Day", "format": "dddd"}],
            startDate: DayPilot.Date.today(),
            days: 7,
            //events: this.doEvents(),
        };
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