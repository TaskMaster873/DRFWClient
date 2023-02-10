import React from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";

const styles = {
    wrap: {
        display: "flex"
    },
    left: {
        marginRight: "10px"
    },
    main: {
        flexGrow: "1"
    },
    oneHundred: {
        height: "100vh"
    }
};

export class ComponentEmployeScheduleView extends React.Component {
    calendarRef: React.RefObject<any>;
    datePickerRef: React.RefObject<any>;
    constructor(props) {
        super(props);
        this.datePickerRef = React.createRef();
        this.calendarRef = React.createRef();
        this.state = {
            viewType: "Week",
            durationBarVisible: false,
            timeRangeSelectedHandling: "Enabled",
            eventResizeHandling: "Disabled",
            eventMoveHandling: "Disabled",
            eventDeleteHandling: "Disabled",
            /*businessBeginsHour: 0,
            businessEndsHour: 24,
            businessWeekends: true,
            durationBarVisible: false,
            showNonBusiness: true,*/
            //timeRangeSelectedHandling: "Disabled",
            // eventDeleteHandling: "Disabled",
           // onEventClick: this.onEventClick
        };
    }

    get calendar() {
        return this.calendarRef.current.control;
    }

    get datePicker() {
        return this.datePickerRef.current.control;
    }
    componentDidMount() {

        const events = [
            {
                id: 1,
                text: "Event 1",
                start: "2023-03-07T10:30:00",
                end: "2023-03-07T13:00:00"
            },
            {
                id: 2,
                text: "Event 2",
                start: "2023-03-08T09:30:00",
                end: "2023-03-08T11:30:00",
                backColor: "#6aa84f"
            },
            {
                id: 3,
                text: "Event 3",
                start: "2023-03-08T12:00:00",
                end: "2023-03-08T15:00:00",
                backColor: "#f1c232"
            },
            {
                id: 4,
                text: "Event 4",
                start: "2023-03-06T11:30:00",
                end: "2023-03-06T14:30:00",
                backColor: "#cc4125"
            },
            {
                id: 5,
                text: "Event 5",
                start: "2023-03-12T11:30:00",
                end: "2023-03-12T14:30:00",
                backColor: "#cc4125"
            },
        ];

        const startDate = "2023-03-07";

        this.calendar.update({ startDate, events });
        this.datePicker.update({ events: events });

    }

    render() {
        return (
            <div className='flex_Hundred'>
                <div style={styles.left}>
                    <DayPilotNavigator
                        selectMode={"week"}
                        showMonths={3}
                        skipMonths={3}
                        startDate={"2023-03-07"}
                        selectionDay={"2023-03-07"}
                        onTimeRangeSelected={args => {
                            this.calendar.update({
                                startDate: args.day
                            });
                        }}
                        ref= {this.datePickerRef}
                    />
                </div>
                <div style={styles.main}>
                    <DayPilotCalendar
                        {...this.state}
                        cellsMarkBusiness= {false}
                        businessWeekends= {true}
                        headerDateFormat= {"dddd"}
                        viewType= {"Week"}            
                        allowEventOverlap= {false}
                        durationBarVisible= {false}
                        timeRangeSelectedHandling= {"Disabled"}
                        ref={this.calendarRef}
                    />
                </div>
            </div>
        );
    }
}
