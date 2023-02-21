import React from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import {EventForCalendar, EventForShiftCreation, Shift} from "../types/Shift";
import {ComponentPopupSchedule} from "./ComponentPopupSchedule";
import {CalendarAttributesForEmployeeShiftCreationComponent, ColumnsType, EventDeleteHandlingType, HeightSpecType, ViewType} from "../types/StatesForDaypilot";
import {API} from "../api/APIManager";
import {Employee} from "../types/Employee";

type ComponentScheduleCreateProps = {
	shifts: Shift[];
	employees: Employee[];
};

export class ComponentScheduleCreate extends React.Component<ComponentScheduleCreateProps, CalendarAttributesForEmployeeShiftCreationComponent> {
	private calendarRef: React.RefObject<DayPilotCalendar> = React.createRef();
	public state: CalendarAttributesForEmployeeShiftCreationComponent = {
		events: [],
		isShowingModal: false,
		start: "2023-02-17T00:00:00",
		end: "2023-02-18T00:00:00",
		resourceName: ""
	};

	constructor(props: ComponentScheduleCreateProps) {
		super(props);
		console.log("employees", props.employees)
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

		let success = await API.createShift({
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
					startDate={DayPilot.Date.today()}
					columns={this.getEmployeeColumns()}
					events={this.getShiftEvents()}
					heightSpec={HeightSpecType.Full}
					viewType={ViewType.Resources}
					eventDeleteHandling={EventDeleteHandlingType.Update}
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
	private getEmployeeColumns(): ColumnsType[] {
		let listToReturn: ColumnsType[];
		listToReturn = [];
		if (this.props.employees.length > 0) {
			for (let employee of this.props.employees) {
				listToReturn.push({
					id: employee.employeeId ?? "1",
					name: employee.firstName
				});
			}
		}
		return listToReturn;
	}

	/**
	 * Called when the user selects a time range in the calendar
	 * @private
	 * @memberof ComponentScheduleCreate
	 * @returns {void} The list of employee names formatted for DayPilotCalendar columns
	 * @param args {TimeRangeSelectedParams}
	 * @returns {void}
	 */
	private getShiftEvents(): EventForCalendar[] {
		let list : EventForCalendar[] = [];

		if (this.props.shifts.length > 0) {
			for (let shift of this.props.shifts) {
				list.push({
					id: 1,
					start: shift.start,//heure de début
					end: shift.end, //heure de fin
					resource: shift.employeeId,
				});
			}
		}
		return list;
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
}
