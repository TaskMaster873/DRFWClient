import React from "react";
import {Employee, EmployeeList} from "../types/Employee";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import {ResourceGroups} from "./ComponentFilterProjects";
import {ScheduleGroups} from "../types/Schedule";
import "./ComponentPopupSchedule";
import {EventForCalendar, ShiftForCalendar, ShiftForEventCreation} from "../types/Shift";
import {ComponentPopupSchedule} from "./ComponentPopupSchedule";
import { CalendarAttributesForEmployeeShiftCreationComponent, ColumnsType, EventDeleteHandlingType, HeightSpecType, ViewType } from "../types/StatesForDaypilot";

/**
 * Ceci est le composant d'horaire
 */

type Props = {listFetchedFromApi:ShiftForEventCreation[], /* liste d'employé*/ }

export class ComponentScheduleCreate extends React.Component<Props, CalendarAttributesForEmployeeShiftCreationComponent > {

	private list: Employee[] = [];
	private listEvent: EventForCalendar[] = [];
	private child: React.RefObject<ComponentPopupSchedule> = React.createRef();
	private calendar: React.RefObject<DayPilotCalendar> = React.createRef();

	public state:  CalendarAttributesForEmployeeShiftCreationComponent = {
		startDate: DayPilot.Date.today().toString(),
		columns: [],
		events: [],
		heightSpec: HeightSpecType.Full,
		viewType: ViewType.Resources,
		eventDeleteHandling: EventDeleteHandlingType.Update,
	}

	constructor(props: Props) {
		super(props);
		//this.dateRef = React.createRef(); //DayPilot.Date.today();
		/*this.state = {
			startDate: DayPilot.Date.today(),
			columns: this.doColumns(),
			//events: this.doEvents(),
		};*/

	}

	public render(): JSX.Element  {
		/*if (this.list === undefined || this.list.length == 0) {
			return <div> Il n'y a pas d'horaire à voir</div>;
		} else*/
			return (
				
				<div>
					<ResourceGroups groups={this.loadGroups().groups} /*onChange={this.onChange}*/ onChange={undefined} /*onChange={this.onChange}*/ />
					<DayPilotCalendar
						businessBeginsHour={8}
						businessEndsHour={20}
						height={2000}
						cellHeight={20}
						cellDuration={5}
						onTimeRangeSelected={this.onTimeRangeSelected}
						{...this.state}
					/>
					<ComponentPopupSchedule ref={this.child} isShowing={false} eventAdd={this.ShiftAdd}></ComponentPopupSchedule>
				</div>
			);
	}

	/**
	 * 
	 * @param event = un shift avec toutes les données pour être créé.
	 */
	public ShiftAdd = (event: EventForCalendar) => {
		console.log(event);
		this.listEvent.push({
			id: 1,
			text: event.start.toString("dd MMMM yyyy ", "fr-fr") + " " + event.start.toString("hh") + "h" + event.start.toString("mm") + "-" + event.end.toString("hh") + "h" + event.end.toString("mm") + " " + event.text,
			start: event.start,
			end: event.end,
			resource: event.resource,
			barColor: event.barColor,
		});
		this.setState({ events: this.listEvent });
	};

	private doColumns(): void{
		let listToReturn: ColumnsType[];
		listToReturn = [];
		/*for (let index = 0; index < this.list.length; index++) {
			listToReturn.push({
				name: this.list[index].firstName + " " + this.list[index].firstName,
				id: "0",
			});
		}*/
		for (let index = 0; index < 10; index++) {
			listToReturn.push({
				name: "bob"+ index ,
				id: index.toString(),
			});
		}
		this.setState({columns: listToReturn} );
	}

	onTimeRangeSelected = (args: any) => {
		this.child.current?.saveContent(args.start, args.end, args.resource);
		//let name = prompt("New event name:", "Event");
		DayPilot.Calendar.clearSelection;
	}

	public componentDidMount(): void {
		this.doColumns();
		this.setState({ListOfShifts: this.props.listFetchedFromApi});
		console.log("is:",this.state.ListOfShifts);

	}
	
	private loadGroups(): ScheduleGroups {
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
				/*{
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
				},*/
			],
		};
		return data;
	}
}
	/**
	 *
	 * @returns la liste des noms d'employé formattés pour columns de DayPilotCalendar qui existe déjà
	 *
	 */
	//private doColumns(): void /*Array<{ name: string; id: string }> */{
		/*let listToReturn: Array<{ name: string; id: string }>;
		listToReturn = [];
		for (let index = 0; index < this.list.length; index++) {
			listToReturn.push({
				name: this.list[index].firstName + " " + this.list[index].firstName,
				id: "0", /*this.list[index].id.toString()*/
			//});
		//}
		//return listToReturn;
	//}

	/**
	 * 
	 * charge tous les corps de travail qui existe
	 * @returns Liste de EventForCalendar qui est une liste de coprs de travail
	 */
	/*private doEvents(): EventForCalendar[] {
		this.listEvent.push({
			id: 1,
			text: "Il faut mettre le temps et le titre",
			start: DayPilot.Date.today(),
			end: DayPilot.Date.now(),
			resource: "1",
			barColor: "#0C2840",
		});
		return this.listEvent;
	}*/

	
	/**
	  *
	  * @param args est le nouvel horaire à ajouter avec tout les paramètres.
	  */
	/*eventAdd = (event: EventForCalendar) => {
		console.log(event);
		this.listEvent.push({
			id: 1,
			text: event.start.toString("dd MMMM yyyy ", "fr-fr") + " " + event.start.toString("hh") + "h" + event.start.toString("mm") + "-" + event.end.toString("hh") + "h" + event.end.toString("mm") + " " + event.text,
			start: event.start,
			end: event.end,
			resource: event.resource,
			barColor: event.barColor,
		});
		this.setState({ events: this.listEvent });
	};*/

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

	/**
	 *
	 * @param args c'est toutes les données de l'évènement
	 * @returns rien
	 */
	/*onTimeRangeSelected = (args: any) => {
		this.child.current?.saveContent(args.start, args.end, args.resource);
		//let name = prompt("New event name:", "Event");
		DayPilot.Calendar.clearSelection;
		//if (!name) return;
		/*this.listEvent.push({
			id: 1,
			text: args.start.toString("  dd MMMM yyyy ", "fr-fr") + " " + args.start.toString("hh") + "h" + args.start.toString("mm") + "-" + args.end.toString("hh") + "h" + args.end.toString("mm") + " " + name,
			start: args.start,
			end: args.end,
			resource: args.resource,
			barColor: args.barColor,
		})
		this.setState({ events: this.listEvent });*/
	//}
//}
