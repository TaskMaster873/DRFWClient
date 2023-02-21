import React from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import {EventForCalendar, EventForShiftCreation, Shift} from "../types/Shift";
import {ComponentPopupSchedule} from "./ComponentPopupSchedule";
import {CalendarAttributesForEmployeeShiftCreationComponent, ColumnsType, EventDeleteHandlingType, HeightSpecType, ViewType} from "../types/StatesForDaypilot";
import {API} from "../api/APIManager";

type ComponentScheduleCreateProps = {
	shifts: Shift[];
};

export class ComponentScheduleCreate extends React.Component<ComponentScheduleCreateProps, CalendarAttributesForEmployeeShiftCreationComponent> {
	private calendarRef: React.RefObject<DayPilotCalendar> = React.createRef();

	public state: CalendarAttributesForEmployeeShiftCreationComponent = {
		startDate: DayPilot.Date.today().toString(),
		columns: [],
		events: [],
		heightSpec: HeightSpecType.Full,
		viewType: ViewType.Resources,
		eventDeleteHandling: EventDeleteHandlingType.Update,
		isShowingModal: false,
		start: "2023-02-17T00:00:00",
		end: "2023-02-18T00:00:00",
		resourceName: ""
	};

	constructor(props: ComponentScheduleCreateProps) {
		super(props);
	}

	/**
	 * Called when the user clicks on the "Add Shift" button
	 * @param args {EventForShiftCreation}
	 * @returns {Promise<void>}
	 * @private
	 * @memberof ComponentScheduleCreate
	 */
	readonly #shiftAdd = async (event: EventForShiftCreation): Promise<void> => {
		const listEvent = this.state.events;
		listEvent.push({
			id: 1,
			text: event.start.toString("dd MMMM yyyy ", "fr-fr") + " " + event.start.toString("hh") + "h" + event.start.toString("mm") + "-" + event.end.toString("hh") + "h" + event.end.toString("mm"),
			start: event.start,
			end: event.end,
		});

		console.log("You have reached CreateShift", event.start);

		await API.createShift({
			employeeId: event.employeeId,
			start: event.start.toString("yyyy-MM-ddTHH:mm:ss"),
			end: event.end.toString("yyyy-MM-ddTHH:mm:ss"),
			department: "",
			projectName: ""
		});

		this.setState({
			isShowingModal: false,
			events: listEvent
		});
	};

	private showScheduleCreationModal(): JSX.Element {
		return (
			<ComponentPopupSchedule
				isShowing={this.state.isShowingModal}
				eventAdd={this.#shiftAdd}
				start={this.state.start}
				end={this.state.end}
				resource={this.state.resourceName}
			/>
		);
	}

	private get calendar(): unknown {
		return this.calendarRef?.current.control;
	}

	public render(): JSX.Element {
		return (
			//<ResourceGroups groups={this.loadGroups().groups} /*onChange={this.onChange}*/ onChange={undefined} /*onChange={this.onChange}*/ />
			<div>
				<DayPilotCalendar
					businessBeginsHour={8}
					businessEndsHour={20}
					height={2000}
					cellHeight={20}
					cellDuration={5}
					onTimeRangeSelected={this.#onTimeRangeSelected}
					{...this.state}
					ref={this.calendarRef}
				/>
				{this.showScheduleCreationModal()}
			</div>
		);
	}

	/**
	 * Called when the user selects a time range in the calendar
	 * @private
	 * @memberof ComponentScheduleCreate
	 * @returns {void} The list of employee names formatted for DayPilotCalendar columns
	 */
	private doColumns(): void {
		let listToReturn: ColumnsType[];
		listToReturn = [];
		if (this.props.shifts.length > 0) {
			for (let shift of this.props.shifts) {
				listToReturn.push({
					name: shift.employeeName || 'Inconnu',
					id: /*shift.employeeId*/ "1",
				});
			}
		}

		this.setState({columns: listToReturn});
	}

	/**
	 * Called when the user selects a time range in the calendar
	 * @private
	 * @memberof ComponentScheduleCreate
	 * @returns {void} The list of employee names formatted for DayPilotCalendar columns
	 * @param args {TimeRangeSelectedParams}
	 * @returns {void}
	 */
	private loadShifts(): void {
		const listToUpdate: EventForCalendar[] = this.state.events;

		if (this.props.shifts.length > 0) {
			for (let shift of this.props.shifts) {

				listToUpdate.push({
					id: 1,
					start: shift.start,//heure de début
					end: shift.end, //heure de fin
					resource: /*this.state.ListOfShifts[index].employeeId*/"1",
				});
			}
		}

		this.setState({
			events: listToUpdate
		});

		//this.calendar.update({events: listToUpdate});
		console.log("les events:", this.state.events);
	}

	// TODO type this arg
	/**
	 * Called when the user selects a time range in the calendar
	 * @param args {TimeRangeSelectedParams}
	 * @private
	 * @memberof ComponentScheduleCreate
	 * @returns {void}
	 */
	readonly #onTimeRangeSelected = (args: any): void => {
		console.log("ontime:", args);

		this.setState({
			isShowingModal: true,
			start: args.start,
			end: args.end,
			resourceName: args.resource
		});

		DayPilot.Calendar.clearSelection;
	};

	public componentDidMount(): void {
		this.doColumns();
		this.loadShifts();

		console.log(this.state.events, this.state.columns);
	}
}

/*private loadGroups(): ScheduleGroups {
	let data: ScheduleGroups = {
		groups: [
			{
				name: "department",
				id: "department",
				resources: [
					{ name: "Room 1", id: "R1" },
					{ name: "Room 2", id: "R2" },
					{ name: "Room 3", id: "R3" },
					{ name: "Room 4", id: "R4" },
					{ name: "Room 5", id: "R5" },
					{ name: "Room 6", id: "R6" },
					{ name: "Room 7", id: "R7" },
				],
			},
		],
	};
	return data;
}*/

/**
 *
 * @param args le groupe sélectionné
 * la fonction change le groupe qui est affiché
 */
/*onChange = (args: { selected: { resources: ResourceGroups } }) => {
	this.groupChanged(args.selected);
};*/

/**
 *
 * @param group étant le projet qu'on veut montrer ses employés assigné
 */
/*private groupChanged(group: { resources: ResourceGroups }): void {
	const columns = group.resources;

	const events = [
		{
			id: 1,
			text: "Event 1",
			start: DayPilot.Date.today(),
			end: "2023-02-01T13:00:00",
			barColor: "#fcb711",
			resource: "R1",
		},
		// ...
	];
	this.setState({ columns: columns, events: events });
}*/
//}
