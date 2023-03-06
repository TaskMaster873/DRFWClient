import React from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import {Shift, ShiftForCalendar} from '../types/Shift';
import {DayPilotCalendarSettings} from '../types/StatesForDaypilot';

import {DateManager} from '../utils/DateManager';

interface ComponentEmployeeScheduleViewProps {
    shifts: Shift[];
}

export interface EmployeeScheduleState {
    dayPilotSettings: DayPilotCalendarSettings;
}

export class ComponentEmployeeScheduleView extends React.Component<ComponentEmployeeScheduleViewProps, EmployeeScheduleState> {
    public props: ComponentEmployeeScheduleViewProps = {
        shifts: []
    };
    public state: EmployeeScheduleState = {
        //To know more, go in types/StatesForDaypilot.ts
        dayPilotSettings: {
            durationBarVisible: false,
            cellsMarkBusiness: false,
            businessWeekends: true,
            headerDateFormat: "dddd",
            viewType: "Week",
            timeRangeSelectedHandling: "Disabled",
            eventResizeHandling: "Disabled",
            eventMoveHandling: "Disabled",
            eventDeleteHandling: "Disabled",
        }
    };
    private calendarRef: React.RefObject<any> = React.createRef();
    private datePickerRef: React.RefObject<any> = React.createRef();

    constructor(props: ComponentEmployeeScheduleViewProps) {
        super(props);

        this.props = props;
    }

    /**
     * @returns Return the calendar component
     */
    get calendar(): any {
        return this.calendarRef.current.control;
    }

    /**
     * @returns Return the date picker component
     */
    get datePicker(): any {
        return this.datePickerRef.current.control;
    }

    public componentDidMount(): void {
        let events: ShiftForCalendar[] = [];
        let startDate = DayPilot.Date.today();

        for (let shift of this.props.shifts) {
            let convertedStartTime = DateManager.convertTimestampToDayPilotDate(shift.start);
            let convertedEndTime = DateManager.convertTimestampToDayPilotDate(shift.end);

            events.push({
                text: `${convertedStartTime} à ${convertedEndTime}`,
                start: shift.start,
                end: shift.end,
            });
        }

        this.calendar.update({events, startDate});
        this.datePicker.update({events, startDate});
    }

    public render(): JSX.Element {
        return (
            <div className='flex_hundred'>
                <div className='left'>
                    <DayPilotNavigator
                        locale= {"fr-fr"}
                        //how many days showed at a time
                        selectMode={"Week"}
                        //month showed at the same time
                        showMonths={3}
                        //when we change month, it skip to the other 3 months
                        skipMonths={3}
                        //date where it start
                        startDate={DayPilot.Date.today()}
                        //day selected in red at the beginning
                        selectionDay={DayPilot.Date.today()}
                        //no space that are not used
                        rowsPerMonth={"Auto"}
                        //when a cell is selected
                        onTimeRangeSelected={this.#onTimeRangeSelected}
                        //the ref of the datepicker
                        ref={this.datePickerRef}
                    />
                </div>

                <div className='main'>
                    <DayPilotCalendar
                        //to start the calendar with the good attributes
                        {...this.state.dayPilotSettings}
                        heightSpec={"Parent100Pct"}
                        ref={this.calendarRef}
                        locale= {"fr-fr"}
                    />
                </div>
            </div>
        );
    }

    /**
     * Triggered when a date is selected in the date picker
     * @param args
     */
    readonly #onTimeRangeSelected = (args: any): void => {
        this.calendar.update({
            startDate: args.day
        });
    };
}
