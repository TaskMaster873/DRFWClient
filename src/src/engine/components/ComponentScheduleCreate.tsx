import React from "react";
import {Employee, EmployeeList} from "../types/Employee";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";
import {ResourceGroups} from "./ComponentFilterProjects";
import {ScheduleGroups} from "../types/Schedule";
import "./ComponentPopupSchedule";
import {EventForCalendar, ShiftForCalendar, ShiftForEventCreation, EventForShiftCreation} from "../types/Shift";
import {ComponentPopupSchedule} from "./ComponentPopupSchedule";
import { CalendarAttributesForEmployeeShiftCreationComponent, ColumnsType, EventDeleteHandlingType, HeightSpecType, ViewType } from "../types/StatesForDaypilot";
import { API } from "../api/APIManager";

/**
 * Ceci est le composant d'horaire
 */

type Props = {listFetchedFromApi:ShiftForEventCreation[], /* liste d'employé*/ }

export class ComponentScheduleCreate extends React.Component<Props, CalendarAttributesForEmployeeShiftCreationComponent > {

	private list: Employee[] = [];
	private listEvent: EventForCalendar[] = [];
	private calendarRef: React.RefObject<DayPilotCalendar> = React.createRef();

	public state:  CalendarAttributesForEmployeeShiftCreationComponent = {
		startDate: DayPilot.Date.today().toString(),
		columns: [],
		events: [],
		heightSpec: HeightSpecType.Full,
		viewType: ViewType.Resources,
		eventDeleteHandling: EventDeleteHandlingType.Update,
		ListOfShifts: [],
		isShowingModal: false,
		start: "2023-02-17T00:00:00",
		end: "2023-02-18T00:00:00",
		resourceName: ""
	}

	constructor(props: Props) {
		super(props);
		this.state.ListOfShifts = props.listFetchedFromApi;
	}

	/**
	 * 
	 * @param event = un shift avec toutes les données pour être créé.
	 */
	public ShiftAdd = async (event: EventForShiftCreation) => {
		console.log(event);
		this.listEvent.push({
			id: 1,
			text: event.start.toString("dd MMMM yyyy ", "fr-fr") + " " + event.start.toString("hh") + "h" + event.start.toString("mm") + "-" + event.end.toString("hh") + "h" + event.end.toString("mm"),
			start: event.start,
			end: event.end,
		});
		this.setState({
			isShowingModal: false,
		})
		console.log("You have reached CreateShift", event.start)
		await API.createShift({
			employeeId: event.employeeId, 
			start: event.start.toString("yyyy-MM-ddTHH:mm:ss"), 
			end: event.end.toString("yyyy-MM-ddTHH:mm:ss"), 
			department:"", //missing
			projectName:""//missing
		});
		this.setState({ events: this.listEvent });
	};
	private popup = ()=> { 
		return <ComponentPopupSchedule isShowing={this.state.isShowingModal} eventAdd={this.ShiftAdd} start={this.state.start} end={this.state.end} resource={this.state.resourceName}/>
	}

	private get calendar() {
		return this.calendarRef?.current.control;
	}
	
	public render(): JSX.Element  {
			return (
				
				
					//<ResourceGroups groups={this.loadGroups().groups} /*onChange={this.onChange}*/ onChange={undefined} /*onChange={this.onChange}*/ />
					<div>
					<DayPilotCalendar
						businessBeginsHour={8}
						businessEndsHour={20}
						height={2000}
						cellHeight={20}
						cellDuration={5}
						onTimeRangeSelected={this.onTimeRangeSelected}
						{...this.state}
						ref= {this.calendarRef}
					/>
					{this.popup()}
				</div>
				
			);
	}

	/**
	 *
	 * @returns la liste des noms d'employé formattés pour columns de DayPilotCalendar qui existe déjà
	 *
	 */

	private doColumns(): void{
		let listToReturn: ColumnsType[];
		listToReturn = [];
		if(this.state.ListOfShifts.length > 0)
		{
			for (let index = 0; index < this.state.ListOfShifts.length; index++) {
				listToReturn.push({
					name: this.state.ListOfShifts[index].employeeName,
					id: /*this.state.ListOfShifts[index].employeeId*/"1",
				});
			}
		}
		this.setState({columns: listToReturn} );
		//this.calendar.update({columns: listToReturn});
	}

	private loadShifts(): void {
		let listToUpdate: EventForCalendar[] = [];

		if(this.state.ListOfShifts.length > 0) {
			for (let index = 0; index < this.state.ListOfShifts.length; index++) {
				this.listEvent.push({
					id: 1,
					start: this.state.ListOfShifts[index].start,//heure de début
  					end: this.state.ListOfShifts[index].end, //heure de fin
					resource: /*this.state.ListOfShifts[index].employeeId*/"1",
					
				});
			}
		}
		
		this.setState({events: this.listEvent});
		//this.calendar.update({events: listToUpdate});
		console.log("les events:",this.state.events);
	}

	onTimeRangeSelected = (args: any) => {
		console.log("ontime:", args);
		this.setState({
			isShowingModal: true,
			start: args.start,
			end: args.end,
			resourceName: args.resource
		})
		//this.child.current?.saveContent(args.start, args.end, args.resource);
		//let name = prompt("New event name:", "Event");
		DayPilot.Calendar.clearSelection;
	}

	public componentDidMount(): void {
		this.setState({ListOfShifts: this.props.listFetchedFromApi});
		this.doColumns();
		this.loadShifts();
		console.log(this.state.events, this.state.columns);

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
}
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
