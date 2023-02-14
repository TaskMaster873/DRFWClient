import React from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { Shift, ShiftForCalendar } from '../types/Shift';

type Props = { listOfShifts: Shift[]}

export class ComponentEmployeScheduleView extends React.Component<Props> {
    calendarRef: React.RefObject<any>;
    datePickerRef: React.RefObject<any>;
    listOfShifts: Shift[] = [];
    constructor(props: Props) {
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
        };
    }

    get calendar() {
        return this.calendarRef.current.control;
    }

    get datePicker() {
        return this.datePickerRef.current.control;
    }

   componentDidMount(): void {
        let listOfEvent: ShiftForCalendar[] = [];
        for (let index = 0; index < this.props.listOfShifts.length; index++) { // foreach met des erreurs
            listOfEvent.push({ 
                start: this.props.listOfShifts[index].start,
                end: this.props.listOfShifts[index].end,
            });
            
        }
        this.calendar.update({events: listOfEvent });
        this.datePicker.update({ events: listOfEvent,  });

        console.log("listemount:",listOfEvent);
    }


    componentDidUpdate(): void {
        let listOfEvent: ShiftForCalendar[] = [];
        for (let index = 0; index < this.props.listOfShifts.length; index++) { // foreach met des erreurs
            listOfEvent.push({ 
                start: this.props.listOfShifts[index].start,
                end: this.props.listOfShifts[index].end,
            });
            
        }
        this.calendar.update({events: listOfEvent });
        this.datePicker.update({ events: listOfEvent });

        console.log("liste:",listOfEvent);
    }

    render() {
        return (
            <div className='flex_Hundred'>
                <div className='left'>
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
                <div className='main'>
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
