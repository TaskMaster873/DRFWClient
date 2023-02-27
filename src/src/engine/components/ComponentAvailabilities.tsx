/**
 * Ceci est du code qui a été cherché en partie sur https://code.daypilot.org/42221/react-weekly-calendar-tutorial,  la documentation de la librairie daypilot
 */
import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import "../../deps/css/navigator_default.css";
import {EventsForUnavailabilityList} from '../types/EmployeeAvailabilities';

interface ComponentAvailabilitiesProps {
    employeeAvailabilities: EventsForUnavailabilityList;
    onTimeRangeSelected: (start: Date, end: Date, selectedDate: Date) => void;
    startDate: DayPilot.Date;
    selectionDay: DayPilot.Date;
}

interface ComponentAvailabilitiesState {
    daypilotSettings: {
        businessBeginsHour: number
    };
}

interface DayPilotArgumentTimeRange {
    start: DayPilot.Date,
    end: DayPilot.Date,
    day: string;
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
        return this.calendarRef.current.control;
    }

    get datePicker() {
        return this.datePickerRef.current.control;
    }

    /**
     * This function is called when the user selects a date in the navigator
     * @param args Contains the date selected by the user
     * @returns void
     */
    readonly #onTimeRangeSelectedNavigator = (args: DayPilotArgumentTimeRange): void => {
        /*this.calendar.update({
            startDate: args.day,
        });*/

        /*this.datePicker.update({
            selectionDay: args.day,
        });*/

        // @ts-ignore
        args.preventDefault();

        // @ts-ignore
        window.ag = args;
        let start = new Date(args.start);
        let end = new Date(args.end);
        let selectedDate = new Date(args.day);

        console.log(args);
        this.props.onTimeRangeSelected(start, end, selectedDate);
    };

    public render(): JSX.Element {
        console.log(this.props.startDate, this.props.selectionDay);

        return (
            <div className='wrap'>
                <div className='left'>
                    <DayPilotNavigator
                        selectMode={"week"}
                        showMonths={3}
                        skipMonths={3}
                        rowsPerMonth={"Auto"}
                        startDate={this.props.startDate}
                        selectionDay={this.props.selectionDay}
                        onTimeRangeSelected={this.#onTimeRangeSelectedNavigator}
                        ref={this.datePickerRef}
                    />
                </div>
                <div className='main'>
                    <DayPilotCalendar
                        {...this.state.daypilotSettings}
                        cellsMarkBusiness={false}
                        businessWeekends={true}
                        headerDateFormat={"dddd"}
                        viewType={"Week"}
                        businessBeginsHour={0}
                        businessEndsHour={24}
                        onTimeRangeSelected={this.#onTimeRangeSelectedCalendar}
                        eventDeleteHandling={"Update"}
                        allowEventOverlap={false}
                        durationBarVisible={true}
                        ref={this.calendarRef}
                    />
                </div>
            </div>
        );
    }


    public componentDidUpdate(prevProps: Readonly<ComponentAvailabilitiesProps>, prevState: Readonly<ComponentAvailabilitiesState>, snapshot?: any): void {
        /*for(events of this.props.employeeAvailabilities) {
            eventToReturn.push({ start: events })
        }*/

        console.log('update!', prevProps, prevState);
        //this.calendar.update({ events: this.props.employeeAvailabilities, startDate: this.props.startDate });
        //this.datePicker.update({ events: this.props.employeeAvailabilities, startDate: this.props.startDate });
    }

    public componentDidMount(): void {
        console.log("componentAvailabilities a mount",this.props.employeeAvailabilities);

        //this.calendar.update({ selectionDay: this.props.selectionDay, startDate: this.props.startDate, events: this.props.employeeAvailabilities });
        //this.datePicker.update({ selectionDay: this.props.selectionDay, startDate: this.props.startDate, events: this.props.employeeAvailabilities });
    }

    readonly #onTimeRangeSelectedCalendar = (args: DayPilotArgumentTimeRange): void => {
        let event = this.calendar.events.list;
        if (!event) {
            console.log("les events", event);
            event = [];
        }

        const eventToAdd = {
            start: args.start,
            end: args.end
        };

        event.push(eventToAdd);
        console.log("event après", event);

        this.datePicker.update({events: event});
        this.calendar.update({events: event});
    };
}


