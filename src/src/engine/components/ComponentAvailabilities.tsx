import React, {Component} from "react";
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import "../../deps/css/navigator_default.css";

interface ComponentAvailabilitiesProps {
    employeeAvailabilities: DayPilot.EventData[];
    onTimeRangeSelected: (start: Date, end: Date, selectedDate: Date) => DayPilot.EventData[];
    getStartData: () => Promise<DayPilot.EventData[]>;
    startDate: DayPilot.Date;
    selectionDay: DayPilot.Date;
    isCellInStartToEndTimeRange: (weekStart: DayPilot.Date, startDate: DayPilot.Date, endDate: DayPilot.Date) => boolean;
}

export class ComponentAvailabilities extends Component<ComponentAvailabilitiesProps, unknown> {
    public props: ComponentAvailabilitiesProps;
    private calendarRef: React.RefObject<DayPilotCalendar> = React.createRef();
    private datePickerRef: React.RefObject<DayPilotNavigator> = React.createRef();
    constructor(props) {
        super(props);

        this.props = props;
    }

    /**
     * @returns the calendar that has a ref in the component
     */
    get calendar() {
        return this.calendarRef?.current?.control;
    }

    /**
     * @return the datePicker that is a child of the component
     */
    get datePicker() {
        return this.datePickerRef?.current?.control;
    }

    public async componentDidMount(): Promise<void> {
        let events = await this.props.getStartData();
        this.calendar?.update({
            events: events
        });

        this.datePicker?.update({
            events: events
        });
    }

    /**
     *
     * @returns all events in the calendar in {DayPilot.EventData[]} or undefined if the calendar is undefined
     */
    public getListFromTheCalendar(): DayPilot.EventData[] | undefined {
        return this.calendar?.events.list;
    }

    public render(): JSX.Element {
        return (
            <div className={"flex_hundred"}>
                <div className={"left"}>
                    <DayPilotNavigator
                        locale={"fr-fr"}
                        selectMode={"Week"}
                        showMonths={1}
                        skipMonths={1}
                        weekStarts={0}
                        rowsPerMonth={"Auto"}
                        startDate={DayPilot.Date.today()}
                        selectionDay={DayPilot.Date.today()}
                        onTimeRangeSelected={this.#onTimeRangeSelectedNavigator}
                        ref={this.datePickerRef}
                    />
                </div>
                <div className="main">
                    <DayPilotCalendar
                        heightSpec={"Parent100Pct"}
                        locale={"fr-fr"}
                        headerDateFormat={"dddd"}
                        viewType={"Week"}
                        businessBeginsHour={6}
                        businessEndsHour={24}
                        weekStarts={0}
                        onTimeRangeSelected={this.#onTimeRangeSelectedCalendar}
                        eventDeleteHandling={"Update"}
                        allowEventOverlap={false}
                        durationBarVisible={true}
                        onBeforeCellRender={this.#onBeforeCellRender}
                        onEventMoved={this.#onEventMoved}
                        onEventResized={this.#onEventResized}
                        ref={this.calendarRef}
                    />
                </div>
            </div>
        );
    }

    /**
     * This function is called when the user selects a date in the navigator
     * @param args Contains the date selected by the user
     * @returns void
     */
    readonly #onTimeRangeSelectedNavigator = (args: DayPilot.NavigatorTimeRangeSelectedArgs): void => {
        let start = args.start.toDateLocal();
        let end = args.end.toDateLocal();
        let selectedDate = args.day.toDateLocal();

        let events: DayPilot.EventData[] = this.props.onTimeRangeSelected(start, end, selectedDate);

        // @ts-ignore
        args.preventDefault();

        this.calendar?.update({
            startDate: args.start,
            events: events
        });

        this.datePicker?.update({
            events: events,
            startDate: args.start
        });
    };

    /**
     * This function is called when the user selects a date in the calendar
     * @param args Contains the date selected by the user
     * @private
     * @returns void
     * @see https://code.daypilot.org/42221/react-weekly-calendar-tutorial
     */
    readonly #onTimeRangeSelectedCalendar = (args: DayPilot.CalendarTimeRangeSelectedArgs): void => {
        let event = this.calendar?.events?.list;
        if (!event) {
            event = [];
        }

        const eventToAdd: DayPilot.EventData = {
            start: args.start,
            end: args.end,
            id: args.start.toString() + args.end.toString(),
            text: this.transformToDayPilotText(args.start, args.end),
        };

        event.push(eventToAdd);

        this.datePicker?.update({events: event});
        this.calendar?.update({events: event});
        this.calendar?.clearSelection();
    };

    /**
     * 
     * @param start date of the event
     * @param end date of the event
     * @returns A string containing the hours of the things
     */
    private transformToDayPilotText(start: DayPilot.Date, end: DayPilot.Date): string {
        return start.toString().slice(11,16) + " à " + end.toString().slice(11,16);
    }

    readonly #onEventResized= (args: DayPilot.CalendarEventResizedArgs): void => {
        let events = this.calendar?.events?.list;
        if (!events) {
            events = [];
        }

        const eventToAdd: DayPilot.EventData = {
            start: args.newStart,
            end: args.newEnd,
            id: args.newStart.toString() + args.newEnd.toString(),
            text: this.transformToDayPilotText(args.newStart, args.newEnd),
        };

            for (let index = 0; index < events.length; index++) {
                if(events[index].id == args.e.id()) {
                    events[index] = eventToAdd;
                } 
             }

        this.datePicker?.update({events: events});
        this.calendar?.update({events: events});
        this.calendar?.clearSelection();
    }

    readonly #onEventMoved= (args: DayPilot.CalendarEventMovedArgs): void => {
        let events = this.calendar?.events?.list;
        if (!events) {
            events = [];
        }
        

        const eventToAdd: DayPilot.EventData = {
            start: args.newStart,
            end: args.newEnd,
            id: args.newStart.toString() + args.newEnd.toString(),
            text: this.transformToDayPilotText(args.newStart, args.newEnd),
        };

            for (let index = 0; index < events.length; index++) {
                if(events[index].id == args.e.id()) {
                    events[index] = eventToAdd;
                } 
             }

        this.datePicker?.update({events: events});
        this.calendar?.update({events: events});
        this.calendar?.clearSelection();

    }

    /**
     *
     * @param args is the args that the method has by DayPilot
     */
    readonly #onBeforeCellRender = (args: any): void => {
        let cell = args.cell;
        let start: DayPilot.Date = cell.start;
        let end: DayPilot.Date = cell.end;
        let startDateOfWeek: DayPilot.Date = start.firstDayOfWeek("en-us");

        if (startDateOfWeek) {
            let isDisabled: boolean = this.props.isCellInStartToEndTimeRange(startDateOfWeek, start, end);

            if (isDisabled) {
                args.cell.properties.disabled = true;
                args.cell.properties.backColor = "#eeeeee";
            }
        }
    };
}


