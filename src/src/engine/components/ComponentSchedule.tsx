import React from "react";
import { EmployeeList, Employee } from "../types/Employee";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { ResourceGroups } from "./ComponentFilterProjects";
import { ScheduleGroups, ScheduleResource } from "../types/Schedule";
import "./ComponentPopupSchedule";
import { EventForCalendar } from "../types/Shift";
/**
 * Ceci est le composant d'horaire
 */
export class ComponentSchedule extends React.Component {
	private list: Employee[] = [];
	private datePicker: DayPilot.DatePicker;
	private listEvent: EventForCalendar[] = [];
	private dateRef: React.RefObject<unknown> /*= React.createRef()*/;
	constructor(props: EmployeeList) {
		super(props);
		this.list = props.list;
		this.dateRef = React.createRef(); //DayPilot.Date.today();
		this.state = {
			startDate: DayPilot.Date.today(),
			columns: this.doColumns(),
			events: this.doEvents(),
		};
	}

	/*   get calendar() {
		return this.calendarRef.current.control;
	} */


	/**
	 *
	 * @returns la liste des nom d'employé formatté pour columns de DayPilotCalendar
	 *
	 */
	private doColumns() {
		let listToReturn: Array<{ name: string; id: string }>;
		listToReturn = [];
		for (let index = 0; index < this.list.length; index++) {
			listToReturn.push({
				name: this.list[index].firstName + " " + this.list[index].name,
				id: this.list[index].no.toString(),
			});
		}
		return listToReturn;
	}

	private doEvents(): EventForCalendar[] {

		
	 
		this.listEvent.push({
			id: 1,
			text: "Il faut mettre le temps et le titre",
			start: DayPilot.Date.today(),
			end: DayPilot.Date.now(),
			resource: "1",
			barColor: "#0C2840",
		});
		return this.listEvent;
	}

	componentDidMount() { }

	loadGroups() {
		let data: ScheduleGroups = {
			groups: [
				{
					name: "Locations",
					id: "locations",
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
				{
					name: "People",
					id: "people",
					resources: [
						{ name: "Person 1", id: "P1" },
						{ name: "Person 2", id: "P2" },
						{ name: "Person 3", id: "P3" },
						{ name: "Person 4", id: "P4" },
						{ name: "Person 5", id: "P5" },
						{ name: "Person 6", id: "P6" },
						{ name: "Person 7", id: "P7" },
					],
				},
				{
					name: "Tools",
					id: "tools",
					resources: [
						{ name: "Tool 1", id: "T1" },
						{ name: "Tool 2", id: "T2" },
						{ name: "Tool 3", id: "T3" },
						{ name: "Tool 4", id: "T4" },
						{ name: "Tool 5", id: "T5" },
						{ name: "Tool 6", id: "T6" },
						{ name: "Tool 7", id: "T7" },
					],
				},
			],
		};
		return data;
	}

	private returnEmployeeForTheGoodGroup() {

	}

	private groupChanged(group: { resources: ResourceGroups }) {
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
	}

	eventAdd = (args: {event: EventForCalendar}) => {
		this.listEvent.push({
			id: args.event.id,
			text: args.event.text,
			start: args.event.start,
			end: args.event.end,
			resource: args.event.resource,
			barColor: args.event.barColor,
		})
		this.setState({  events: this.listEvent });
	}

	onTimeRangeSelected = (args: any) => {
		var name = prompt("New event name:", "Event");
		DayPilot.Calendar.clearSelection;
		console.log(!name);
		if (!name) return;
		var e = new DayPilot.Event({
			start: args.start,
			end: args.end,
			id: DayPilot.guid(),
			resource: args.resource,
			text: name
		});
		this.eventAdd(e);
		DayPilot.Calendar.message("Created");
	}

	
	
	onChange = (args: { selected: { resources: ResourceGroups } }) => {
		this.groupChanged(args.selected);
	};

	public render(): JSX.Element {
		if (this.list === undefined || this.list.length == 0) {
			return <div> Il n'y a pas d'horaire à voir</div>;
		} else
			return (
				<div>
					<ResourceGroups groups={this.loadGroups().groups} onChange={this.onChange} />
					<DayPilotCalendar
						businessBeginsHour={8}
						businessEndsHour={20}
						heightSpec={"Full"}
						height={2000}
						cellHeight={20}
						cellDuration={5}
						viewType={"Resources"}
						showNonBusiness={false}
						onTimeRangeSelected={this.onTimeRangeSelected}
						{...this.state}
					/>
				</div>
			);
	}
}