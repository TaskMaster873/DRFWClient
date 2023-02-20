import React from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { Shift, ShiftForCalendar } from '../types/Shift';
import { DayPilotCalendarSettings } from '../types/StatesForDaypilot';

interface ComponentEmployeeScheduleViewProps {
	listOfShifts: Shift[]
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
			cellsMarkBusiness: false, //
			businessWeekends: true, // travail possible la fin de semaine, bool
			headerDateFormat: "dddd", // pour voir les jours de la semaine, string
			viewType: "Week", // 7 jours, string
			timeRangeSelectedHandling: "Disabled", // la sélection des heures, string
			eventResizeHandling: "Disabled", //changer la grosseur de l'event, string
			eventMoveHandling: "Disabled", //pouvoir le bouger ,string
			eventDeleteHandling: "Disabled", // pouvoir le, delete}*/
		}
	}

	constructor(props: ComponentEmployeeScheduleViewProps) {
		super(props);

		this.props = props;
	}

	/**
	 * @returns Return the calendar component
	 */
	get calendar() : any {
		return this.calendarRef.current.control;
	}

	/**
	 * @returns Return the date picker component
	 */
	get datePicker() : any {
		return this.datePickerRef.current.control;
	}

	/**
	 * Pour le moment on ne fait pas de refresh dans notre app quand il y a des changements dans la bd
	 * donc on fait un update de la liste des shifts quand le component est monté
	 */
	public componentDidMount(): void {
		let events: ShiftForCalendar[] = [];
		let startDate = DayPilot.Date.today();

		for (let shift of this.props.listOfShifts) {
			let convertedStartTime = DayPilot.Date.parse(shift.start, "yyyy-MM-ddTHH:mm:ss").toString("H:mm");
			let convertedEndTime = DayPilot.Date.parse(shift.end, "yyyy-MM-ddTHH:mm:ss").toString("H:mm");

			events.push({
				text: `${convertedStartTime} à ${convertedEndTime}\nProjet: ${shift.projectName}`,
				start: shift.start,
				end: shift.end,
			});
		}

		this.calendar.update({ events, startDate });
		this.datePicker.update({ events, startDate });
	}

	/**
	 * Triggered when a date is selected in the date picker
	 * @param args
	 */
	readonly #onTimeRangeSelected = (args: any): void => {
		this.calendar.update({
			startDate: args.day
		});
	}

	public render(): JSX.Element {
		return (
			<div className='flex_Hundred'>
				<div className='left'>
					<DayPilotNavigator //ceci est les mini calendriers
						selectMode={"week"}
						showMonths={3} // le nombre de calendrier
						skipMonths={3} // change 3 mois plus tard quand cliqué
						startDate={DayPilot.Date.today()} // date de base
						selectionDay={DayPilot.Date.today()} // date de base
						rowsPerMonth= {"Auto"}
						onTimeRangeSelected={this.#onTimeRangeSelected}
						ref={this.datePickerRef}
					/>
				</div>
				<div className='main'>
					<DayPilotCalendar // le calendrier principal
						{...this.state.dayPilotSettings}
						ref={this.calendarRef}
					/>
				</div>
			</div>
		);
	}
}
