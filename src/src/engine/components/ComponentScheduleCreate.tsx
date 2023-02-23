import React from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import {EventForCalendar, EventForShiftCreation, Shift} from "../types/Shift";
import {ComponentPopupSchedule} from "./ComponentPopupSchedule";
import {CalendarAttributesForEmployeeShiftCreationComponent, ColumnsType, EventDeleteHandlingType, HeightSpecType, ViewType} from "../types/StatesForDaypilot";
import {Employee} from "../types/Employee";

type ComponentScheduleCreateProps = {
	events: EventForCalendar[];
	employees: Employee[];
	addShift: (shift: Shift) => {};
};

export class ComponentScheduleCreate extends React.Component<ComponentScheduleCreateProps, CalendarAttributesForEmployeeShiftCreationComponent> {
	public state: CalendarAttributesForEmployeeShiftCreationComponent = {
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
		await this.props.addShift({
			employeeId: event.employeeId,
			start: event.start.toString("yyyy-MM-ddTHH:mm:ss"),
			end: event.end.toString("yyyy-MM-ddTHH:mm:ss"),
			department: "",
			projectName: ""
		});

		this.setState({
			isShowingModal: false,
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
					events={this.props.events}
					heightSpec={HeightSpecType.Full}
					viewType={ViewType.Resources}
					eventDeleteHandling={EventDeleteHandlingType.Update}
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

	// TODO type this arg
	/**
	 * Called when the user selects a time range in the calendar
	 * @param args {TimeRangeSelectedParams}
	 * @private
	 * @memberof ComponentScheduleCreate
	 * @returns {void}
	 */
	readonly #onTimeRangeSelected = (args: any): void => {
		this.setState({
			isShowingModal: true,
			start: args.start,
			end: args.end,
			resourceName: args.resource
		});

		DayPilot.Calendar.clearSelection;
	};
}
