import React from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import {EventForCalendar, EventForShiftCreation, EventForShiftEdit, Shift} from "../types/Shift";
import {ComponentPopupSchedule} from "./ComponentPopupSchedule";
import {Employee} from "../types/Employee";
import {HeightSpecType, EventManipulationType, ViewType, EventDeleteHandlingType, ColumnsType} from "../types/StatesForDaypilot";

type Props = {
	events: EventForCalendar[];
	employees: Employee[];
	addShift: (shiftEvent: EventForShiftCreation) => Promise<void>;
	editShift: (shiftEvent: EventForShiftEdit) => Promise<void>;
};

type State = {
	/** date of the start */
	//startDate: string;
	/** the columns */
	//columns: ColumnsType[]; 
	/** the shifts */
	//events: EventForCalendar[]; 
	/** height */
	heightSpec?: HeightSpecType;
	/** hardcoded height, so not important */
	height?: number; 
	/** hardcoded height, so not important */
	cellHeight?: number; 
	/** precision in minutes of cells (minimum 15min) in lite version */
	cellDuration?: number 
	/** the type of view of data */
	//viewType: ViewType; 
	/** if we can delete or not in the calendar */
	//eventDeleteHandling: EventDeleteHandlingType;
	/** is the popup child active or not */
	isShowingModal: boolean;
    /** Shift id and Daypilot marker */
    currentEventId: string;
	/** start of the calendar */
	start: DayPilot.Date;
	/** end of the calendar */
	end: DayPilot.Date;
	/** for the popup */
	resourceName: string;
    /** Popup taskType */
    taskType: EventManipulationType;
}

export class ComponentScheduleCreate extends React.Component<Props, State> {
	public state: State = {
		isShowingModal: false,
		currentEventId: "",
		start: "2023-02-17T00:00:00",
		end: "2023-02-18T00:00:00",
		resourceName: "",
		taskType: EventManipulationType.CREATE,
	};

	constructor(props: Props) {
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
					cellDuration={5}
					onTimeRangeSelected={this.#onTimeRangeSelected}
					onEventClick={this.#onEventClick}
					onEventMoved={this.#onEventMoved}
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
					resource={this.state.resourceName}
					taskType={this.state.taskType}
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
		console.log(args)
		this.setState({
			isShowingModal: true,
			start: args.start,
			end: args.end,
			resourceName: args.resource,
			taskType: EventManipulationType.CREATE,
		});

		DayPilot.Calendar.clearSelection;
	};

	readonly #onEventClick = (args: any): void => {
		this.setState({
			isShowingModal: true,
			currentEventId: args.e.data.id,
			start: args.e.data.start,
			end: args.e.data.end,
			resourceName: args.e.data.resource,
			taskType: EventManipulationType.EDIT,
		});
	};

	readonly #onEventMoved = async (args: any): Promise<void> => {
		let eventToSend: EventForShiftEdit = {
			id: args.e.data.id,
			employeeId: args.NewResource,
			start: args.NewStart,
			end: args.NewEnd,
		};
		await this.props.editShift(eventToSend)
	};

	readonly #hideModal = () => {
		this.setState({
			isShowingModal: false
		})
	}
}
