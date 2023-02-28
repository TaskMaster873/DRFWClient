/**
 * Ceci est du code qui a été cherché en partie sur https://code.daypilot.org/42221/react-weekly-calendar-tutorial,  la documentation de la librairie daypilot
 */
import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import "../../deps/css/navigator_default.css";
import {eventsForUnavailabilityList} from '../types/EmployeeAvailabilities';

interface ComponentAvailabilitiesProps {
    employeeAvailabilities: eventsForUnavailabilityList,
    onTimeRangeSelected: (start: Date, end: Date) => void;
}

interface ComponentAvailabilitiesState {
    businessBeginsHour: number;
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
        businessBeginsHour: 0,
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
        this.calendar.update({
            startDate: args.day,
        });

        let start = new Date(args.start);
        let end = new Date(args.end);

        this.props.onTimeRangeSelected(start, end);
    };

    public render(): JSX.Element {
        return (
            <div className='wrap'>
                <div className='left'>
                    <DayPilotNavigator
                        selectMode={"week"}
                        showMonths={3}
                        skipMonths={3}
                        rowsPerMonth={"Auto"}
                        startDate={DayPilot.Date.today()}
                        selectionDay={DayPilot.Date.today()}
                        onTimeRangeSelected={this.#onTimeRangeSelectedNavigator}
                        ref={this.datePickerRef}
                    />
                </div>
                <div className='main'>
                    <DayPilotCalendar
                        {...this.state}
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
        
       /* for(events of this.props.employeeAvailabilities) {
            eventToReturn.push({ start: events })
        }*/
        this.calendar.update({ events: this.props.employeeAvailabilities });
        this.datePicker.update({events: this.props.employeeAvailabilities });
    }

    public componentDidMount(): void {
        console.log("componentAvailabilities a mount",this.props.employeeAvailabilities);
        this.calendar.update({ events: this.props.employeeAvailabilities });
        this.datePicker.update({startDate: DayPilot.Date.today(), events: this.props.employeeAvailabilities });
        /*const events = [
            {
                id: 1,
                start: "2023-03-07T10:30:00",
                end: "2023-03-07T13:00:00"
            },
            {
                id: 2,
                start: "2023-03-08T09:30:00",
                end: "2023-03-08T11:30:00",
                backColor: "#6aa84f"
            },
            {
                id: 3,
                start: "2023-03-08T12:00:00",
                end: "2023-03-08T15:00:00",
                backColor: "#f1c232"
            },
            {
                id: 4,
                start: "2023-03-06T11:30:00",
                end: "2023-03-06T14:30:00",
                backColor: "#cc4125"
            },
            {
                id: 5,
                start: "2023-03-11T11:30:00",
                end: "2023-03-12T14:30:00",
                backColor: "#eeaabb"
            },
        ];

        const startDate = "2023-03-07";

        this.calendar.update({ startDate, events });
        this.datePicker.update({ events: events });*/
    }
   /* getCurrentAvailabilities(): EmployeeRecursiveExceptionList[]  {
        
        
    }*/

    

    private getDaysException(dayNumber: number) {

        return 0;
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


