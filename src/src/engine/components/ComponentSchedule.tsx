import React from "react";
import { EmployeeList, Employee } from "../types/Employee";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { ResourceGroups } from "./ComponentFilterProjects";
import { ScheduleGroups, ScheduleResource } from "../types/Schedule";

/**
 * Ceci est le composant d'horaire
 */
export class ComponentSchedule extends React.Component {
  private list: Employee[] = [];
  private datePicker: DayPilot.DatePicker;
  private dateRef: React.RefObject<unknown> /*= React.createRef()*/;
  constructor(props: EmployeeList) {
    super(props);
    this.list = props.list;
    this.dateRef = React.createRef(); //DayPilot.Date.today();
    this.state = {
      businessBeginsHour: 8, //ce serait une state qu'il faudrait mettre
      businessEndsHour: 20,
      heightSpec: "Full",
      height: 2000,
      cellHeight: 20,
      cellDuration: 5,
      viewType: "Resources",
      showNonBusiness: false,
      startDate: DayPilot.Date.today(),
      columns: this.doColumns() /*[
                { name: "Room 1", id: "R1" },
                { name: "Room 2", id: "R2" },
                { name: "Room 3", id: "R3" },
                { name: "Room 4", id: "R4" },
                { name: "Room 5", id: "R5" },
                { name: "Room 6", id: "R6" },
                { name: "Room 7", id: "R7" },
            ],*/,
      events: this.doEvents(),
      onHeaderClick: async (args: {
        column: { name: any; data: { name: any } };
      }) => {
        const modal = await DayPilot.Modal.prompt(
          "Resource name:",
          args.column.name
        );
        if (!modal.result) {
          return;
        }
        args.column.data.name = modal.result;
        /* this.calendar.update(); */
      },
    };
  }

  /*   get calendar() {
    return this.calendarRef.current.control;
  } */

  private loadCalendarData() {}

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
    //this.setState({ columns: listToReturn })
    return listToReturn;
  }

  private doEvents() {
    let listToReturn: Array<{
      id: number;
      text: string;
      start: string;
      end: string;
      resource: string;
      barColor: string;
    }>;
    listToReturn = [];
    listToReturn.push({
      id: 1,
      text: "Il faut mettre le temps et le titre",
      start: DayPilot.Date.today(),
      end: DayPilot.Date.now(),
      resource: "1",
      barColor: "#0C2840",
    });
    //this.setState({ events: listToReturn })
    return listToReturn;
  }

  componentDidMount() {
    this.datePicker = new DayPilot.DatePicker({
      target: this.dateRef.current,
      pattern: "MMMM dd, yyyy",
      date: "2022-09-07",
      onTimeRangeSelected: (args: { start: any }) => {
        this.setState({
          startDate: args.start,
        });
      },
    });
  }

  private changeDate() {
    this.datePicker.show();
  }

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

  private groupChanged(group: { resources: ResourceGroups }) {
    const columns = group.resources;

    const events = [
      {
        id: 1,
        text: "Event 1",
        start: "2022-11-07T10:30:00",
        end: "2022-11-07T13:00:00",
        barColor: "#fcb711",
        resource: "R1",
      },
      // ...
    ];
    this.setState({ columns: columns, events: events });
    /* this.calendar.update({ columns, events }); */
  }

  public render(): JSX.Element {
    if (this.list === undefined || this.list.length == 0) {
      return <div> Il n'y a pas d'horaire à voir</div>;
    } else
      return (
        // <div>
        //    <div className="toolbar">
        //       <span ref={this.dateRef}></span> <button onClick={ev => this.changeDate()}>Change date</button>
        //   </div>
        <div>
          <ResourceGroups
            {...{
              onChange: (args: { selected: { resources: ResourceGroups } }) =>
                this.groupChanged(args.selected),
              groups: this.loadGroups().groups,
            }}
          ></ResourceGroups>
          <DayPilotCalendar {...this.state} /* ref={this.calendarRef} */ />
        </div>

        // </div>
      );
  }
}
