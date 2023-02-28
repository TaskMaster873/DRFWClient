/**
 * Ceci est du code qui a été cherché en partie sur https://code.daypilot.org/42221/react-weekly-calendar-tutorial,  la documentation de la librairie daypilot
 */
import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import "../../deps/css/navigator_default.css";

interface ComponentAvailabilitiesProps {
    employeeAvailabilities: DayPilot.EventData[];
    onTimeRangeSelected: (start: Date, end: Date, selectedDate: Date) => DayPilot.EventData[];
    getStartData: () => DayPilot.EventData[];
    startDate: DayPilot.Date;
    selectionDay: DayPilot.Date;
    isCellInStartToEndTimeRange: (weekStart: DayPilot.Date, startDate: DayPilot.Date, endDate: DayPilot.Date) => boolean;
}

interface ComponentAvailabilitiesState {
    daypilotSettings: {
        businessBeginsHour: number
    };
}

export class ComponentAvailabilities extends Component<ComponentAvailabilitiesProps, ComponentAvailabilitiesState> {
    private calendarRef: React.RefObject<DayPilotCalendar> = React.createRef();
    private datePickerRef: React.RefObject<DayPilotNavigator> = React.createRef();
    
    public state: ComponentAvailabilitiesState = {
        daypilotSettings: {
            businessBeginsHour: 0,
        }
    };

    public props: ComponentAvailabilitiesProps;

    constructor(props) {
        super(props);

        this.props = props;
    }

    get calendar() {
        return this.calendarRef?.current?.control;
    }

    get datePicker() {
        return this.datePickerRef?.current?.control;
    }

    public componentDidMount(): void {
        let events = this.props.getStartData();

        this.calendar?.update({
            events: events
        });

        this.datePicker?.update({
            events: events
        });
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
            console.log("les events", event);
            event = [];
        }

        const eventToAdd: DayPilot.EventData = {
            start: args.start,
            end: args.end,
            id: '',
            text: ''
        };

        event.push(eventToAdd);

        this.datePicker?.update({events: event});
        this.calendar?.update({events: event});
    };

    readonly #onBeforeCellRender = (args: any): void => {
        let cell = args.cell;
        let start: DayPilot.Date = cell.start;
        let end: DayPilot.Date = cell.end;
        let startDateOfWeek: DayPilot.Date = start.firstDayOfWeek('en-us');

        if(startDateOfWeek) {
            let isDisabled: boolean = this.props.isCellInStartToEndTimeRange(startDateOfWeek, start, end);
            console.log(isDisabled);

            if(isDisabled) {
                args.cell.properties.disabled = true;
                args.cell.properties.backColor = "#eeeeee";
            }
        }

        /*const previousWeekStart = DayPilot.Date.today().firstDayOfWeek().addDays(-7);
        const previousWeekEnd = previousWeekStart.addDays(7);

        if (DayPilot.Util.overlaps(args.cell.start, args.cell.end, previousWeekStart, previousWeekEnd)) {
            args.cell.properties.disabled = true;
            args.cell.properties.backColor = "#eeeeee";
        }*/
    }

    public render(): JSX.Element {
        return (
            <div className='wrap'>
                <div className='left'>
                    <DayPilotNavigator
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
                <div className='main'>
                    <DayPilotCalendar
                        {...this.state.daypilotSettings}
                        headerDateFormat={"dddd"}
                        viewType={"Week"}
                        businessBeginsHour={0}
                        businessEndsHour={24}
                        weekStarts={0}
                        onTimeRangeSelected={this.#onTimeRangeSelectedCalendar}
                        eventDeleteHandling={"Update"}
                        allowEventOverlap={false}
                        durationBarVisible={true}
                        onBeforeCellRender={this.#onBeforeCellRender}
                        ref={this.calendarRef}
                    />
                </div>
            </div>
        );
    }
}


