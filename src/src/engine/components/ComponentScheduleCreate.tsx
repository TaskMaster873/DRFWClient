import React from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import {EventForCalendar, EventForShiftCreation, EventForShiftEdit} from "../types/Shift";
import {ComponentPopupSchedule} from "./ComponentPopupSchedule";
import {Employee} from "../types/Employee";
import {HeightSpecType, EventManipulationType, ViewType, EventDeleteHandlingType, ColumnsType} from "../types/StatesForDaypilot";

interface ScheduleCreateProps {
	events: EventForCalendar[];
	employees: Employee[];
	addShift: (shiftEvent: EventForShiftCreation) => Promise<void>;
	editShift: (shiftEvent: EventForShiftEdit) => Promise<void>;
	deleteShift: (shiftEvent: EventForShiftEdit) => Promise<void>;
};

interface ScheduleCreateState {
	/** is the popup child active or not */
	isShowingModal: boolean;
	/** Shift id and serves as a unique DayPilot marker */
	currentEventId: string;
	/** start of the calendar */
	start: DayPilot.Date;
	/** end of the calendar */
	end: DayPilot.Date;
	/** for the popup */
	resource: string;
	/** Popup taskType */
	taskType: EventManipulationType;
};

export class ComponentScheduleCreate extends React.Component<ScheduleCreateProps, ScheduleCreateState> {
	public state: ScheduleCreateState = {
		isShowingModal: false,
		currentEventId: "",
		start: "",
		end: "",
		resource: "",
		taskType: EventManipulationType.CREATE,
	};

	constructor(props: ScheduleCreateProps) {
		super(props);
	}

	public render(): JSX.Element {
		return (
			<div>
				<DayPilotCalendar
					businessBeginsHour={8}
					businessEndsHour={20}
					height={2000}
					cellHeight={20}
					cellDuration={30}
					onTimeRangeSelected={this.#onTimeRangeSelected}
					onEventClick={this.#onEventClick}
					onEventMoved={this.#onEventMoved}
					onEventResized={this.#onEventResized}
					onEventDelete={this.#onEventDelete}
					startDate={DayPilot.Date.today()}
					columns={this.getEmployeeColumns()}
					events={this.props.events}
					heightSpec={HeightSpecType.Full}
					viewType={ViewType.Resources}
					eventDeleteHandling={EventDeleteHandlingType.Update}
				/>
				<ComponentPopupSchedule
					hideModal={this.#hideModal}
					isShown={this.state.isShowingModal}
					eventAdd={this.props.addShift}
					eventEdit={this.props.editShift}
					id={this.state.currentEventId}
					start={this.state.start}
					end={this.state.end}
					resource={this.state.resource}
					taskType={this.state.taskType}
					employees={this.props.employees}
				/>
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
		let listToReturn: ColumnsType[] = [];
		if (this.props.employees.length > 0) {
			for (let employee of this.props.employees) {
				listToReturn.push({
					id: employee.id ?? "1",
					name: `${employee.firstName} ${employee.lastName}`
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
			resource: args.resource,
			taskType: EventManipulationType.CREATE,
		});

		DayPilot.Calendar.clearSelection;
	};

	/**
	 * When you click an event in order to modify its details, this function is called
	 * @param args info on the clicked event
	 */
	readonly #onEventClick = (args: any): void => {
		this.setState({
			isShowingModal: true,
			currentEventId: args.e.data.id,
			start: args.e.data.start,
			end: args.e.data.end,
			resource: args.e.data.resource,
			taskType: EventManipulationType.EDIT,
		});
	};

	/**
	 * When you drag an event in order to modify its position, this function is called
	 * @param args info on the dragged event
	 */
	readonly #onEventMoved = async (args: any): Promise<void> => {
		let eventToSend: EventForShiftEdit = {
			id: args.e.data.id,
			employeeId: args.newResource,
			start: args.newStart,
			end: args.newEnd,
		};
		await this.props.editShift(eventToSend);
	};

	/**
	 * When you resize an event in order to modify its length, this function is called
	 * @param args info on the dragged event
	 */
	readonly #onEventResized = async (args: any): Promise<void> => {
		let eventToSend: EventForShiftEdit = {
			id: args.e.data.id,
			employeeId: args.e.data.resource,
			start: args.newStart,
			end: args.newEnd,
		};
		await this.props.editShift(eventToSend);
	};

	/**
	 * When you delete an event, this function is called
	 * @param args 
	 */
	readonly #onEventDelete = async (args: any): Promise<void> => {
		let eventToSend: EventForShiftEdit = {
			id: args.e.data.id,
			employeeId: args.e.data.resource,
			start: args.e.data.start,
			end: args.e.data.end,
		};
		await this.props.deleteShift(eventToSend);
	};

	/**
	 * When you close the modal window, this function is called in order to hide it
	 */
	readonly #hideModal = () => {
		this.setState({
			isShowingModal: false
		});
	};
}
