import React from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { Shift, ShiftForCalendar } from '../types/Shift';
import { CalendarAttributesForEmployeeSchedule } from '../types/StatesForDaypilot';

type Props = { listOfShifts: Shift[] }

export class ComponentEmployeScheduleView extends React.Component<Props> {
	private calendarRef: React.RefObject<any> = React.createRef();
	private datePickerRef: React.RefObject<any> = React.createRef();
	private listOfShifts: Shift[] = [];

	public state: CalendarAttributesForEmployeeSchedule = {
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

	constructor(props: Props) {
		super(props);
		this.listOfShifts = this.props.listOfShifts;
	}

	get calendar() {
		return this.calendarRef.current.control;
	}

	get datePicker() {
		return this.datePickerRef.current.control;
	}

	/**
	 * Pour le moment on ne fait pas de refresh dans notre app quand il y a des changements dans la bd
	 */
	public componentDidMount(): void {
		let events: ShiftForCalendar[] = [];
		let startDate = DayPilot.Date.today();

		for (let index = 0; index < this.listOfShifts.length; index++) {
			events.push({
				start: this.listOfShifts[index].start,
				end: this.listOfShifts[index].end,
			});
		}
		this.calendar.update({ events, startDate });

		this.datePicker.update({ events, startDate });
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
						onTimeRangeSelected={args => {
							this.calendar.update({
								startDate: args.day
							});
						}}
						ref={this.datePickerRef}
					/>
				</div>
				<div className='main'>
					<DayPilotCalendar // le calendrier principal
						{...this.state}
						ref={this.calendarRef}
					/>
				</div>
			</div>
		);
	}
}
