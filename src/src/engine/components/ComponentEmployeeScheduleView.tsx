import React from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import {Shift, ShiftForCalendar} from '../types/Shift';
import {DayPilotCalendarSettings} from '../types/StatesForDaypilot';

interface ComponentEmployeeScheduleViewProps {
	listOfShifts: Shift[];
}

export interface CalendarAttributesForEmployeeSchedule {
	dayPilotSettings: DayPilotCalendarSettings;
}

export class ComponentEmployeeScheduleView extends React.Component<ComponentEmployeeScheduleViewProps, CalendarAttributesForEmployeeSchedule> {
	private calendarRef: React.RefObject<any> = React.createRef();
	private datePickerRef: React.RefObject<any> = React.createRef();

	public props: ComponentEmployeeScheduleViewProps = {
		listOfShifts: []
	};

	public state: CalendarAttributesForEmployeeSchedule = {
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

		for (let shift of this.props.listOfShifts) {
			let convertedStartTime = this.parseDateToString(shift.start);
			let convertedEndTime = this.parseDateToString(shift.end);

			events.push({
				text: `${convertedStartTime} à ${convertedEndTime}\nProjet: ${shift.projectName}`,
				start: shift.start,
				end: shift.end,
			});
		}

		this.calendar.update({events, startDate});
		this.datePicker.update({events, startDate});
	}

	/**
	 * 
	 * @param time 
	 * @returns time in good format
	 */
	private parseDateToString(time: string): string {
		return DayPilot.Date.parse(time, "yyyy-MM-ddTHH:mm:ss").toString("H:mm");
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
						selectMode={"week"}
						showMonths={3}
						skipMonths={3}
						startDate={DayPilot.Date.today()}
						selectionDay={DayPilot.Date.today()}
						rowsPerMonth={"Auto"}
						onTimeRangeSelected={this.#onTimeRangeSelected}
						ref={this.datePickerRef}
					/>
				</div>
				<div className='main'>
					<DayPilotCalendar
						{...this.state.dayPilotSettings}
						ref={this.calendarRef}
					/>
				</div>
			</div>
		);
	}
}
