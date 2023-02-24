import React from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import {Shift, ShiftForCalendar} from '../types/Shift';
import {DayPilotCalendarSettings} from '../types/StatesForDaypilot';
import {Converter} from '../utils/DateConverter';

interface ComponentEmployeeScheduleViewProps {
	shifts: Shift[];
}

export interface EmployeeScheduleState {
	dayPilotSettings: DayPilotCalendarSettings;
}

export class ComponentEmployeeScheduleView extends React.Component<ComponentEmployeeScheduleViewProps, EmployeeScheduleState> {
	private calendarRef: React.RefObject<any> = React.createRef();
	private datePickerRef: React.RefObject<any> = React.createRef();

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
			let convertedStartTime = Converter.convertTimestampToDayPilotDate(shift.start);
			let convertedEndTime = Converter.convertTimestampToDayPilotDate(shift.end);

			events.push({
				text: `${convertedStartTime} à ${convertedEndTime}`,
				start: shift.start,
				end: shift.end,
			});
		}

		this.calendar.update({events, startDate});
		this.datePicker.update({events, startDate});
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

	public render(): JSX.Element {
		return (
			<div className='flex_Hundred'>
				<div className='left'>

					<DayPilotNavigator
						//how many days showed at a time
						selectMode={"week"}
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
						ref={this.calendarRef}
					/>
				</div>
			</div>
		);
	}
}
