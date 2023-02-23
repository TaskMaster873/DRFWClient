import React from "react";
import {ComponentLoading} from "../components/ComponentLoading";
import {ComponentScheduleCreate} from "../components/ComponentScheduleCreate";
import {API} from "../api/APIManager";
import {EventForCalendar, EventForShiftCreation, Shift} from "../types/Shift";
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {Department} from "../types/Department";
import {SelectDepartment} from "../components/SelectDepartment";
import {Container} from "react-bootstrap";
import {Employee} from "../types/Employee";

enum ScheduleRecievedState {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

interface CreateScheduleState {
    currentDepartment: Department | null;
    departments: Department[];
    employees: Employee[];
    shifts: Shift[];
    fetchState: ScheduleRecievedState;
}

export class CreateSchedule extends React.Component<unknown, CreateScheduleState> {
    public state: CreateScheduleState = {
        currentDepartment: null,
        departments: [],
        employees: [],
        shifts: [],
        fetchState: ScheduleRecievedState.WAITING,
    };

    /**
     * Called when the page is loaded
     * @description This function is called when the page is loaded. It will set the title of the page and call the API to get the list of shifts.
     * @returns {Promise<void>}
     * @memberof CreateSchedule
     * @public
     * @override
     * @async
     */
    public async componentDidMount(): Promise<void> {
        document.title = "Création d'horaire - TaskMaster";

        let fetchedDepartments = await API.getDepartments();
        if (typeof fetchedDepartments === "string") {
            this.setState({
                fetchState: ScheduleRecievedState.ERROR
            });
            return;
        }
        else {
            await this.#changeDepartment(fetchedDepartments[0], fetchedDepartments);
        }
    }

    readonly #changeDepartment = async (currentDepartment: Department, departments?: Department[]): Promise<void> => {
        //Get all employees of this department
        let fetchedEmployees = await API.getEmployees(currentDepartment.name);
        if (typeof fetchedEmployees === "string") {
            this.setState({fetchState: ScheduleRecievedState.ERROR});
        }
        else {
            this.#getShifts(currentDepartment, departments, fetchedEmployees);
        }
    };

    readonly #getShifts = async (currentDepartment: Department, departments?: Department[], employees?: Employee[]) => {
        //Get all daily shifts of this department
        let fetchedShifts = await API.getDailyScheduleForDepartment(DayPilot.Date.today(), currentDepartment);
        if (typeof fetchedShifts === "string") {
            this.setState({fetchState: ScheduleRecievedState.ERROR});
        }
        else {
            this.setState({
                currentDepartment: currentDepartment,
                departments: departments || this.state.departments,
                employees: employees || this.state.employees,
                shifts: fetchedShifts,
                fetchState: ScheduleRecievedState.OK,
            });
        }
    };

    readonly #addShift = async (shiftEvent: EventForShiftCreation) => {
        let currentDepartment = this.state.currentDepartment ? this.state.currentDepartment : {name: "", director: ""};
        let success = await API.createShift({
            employeeId: shiftEvent.employeeId,
            start: shiftEvent.start,
            end: shiftEvent.end,
            department: this.state.currentDepartment ? this.state.currentDepartment.name : "",
            projectName: ""
        });
        if (typeof success === "string") this.setState({fetchState: ScheduleRecievedState.ERROR});
        //Refresh shifts
        else await this.#getShifts(currentDepartment, this.state.departments, this.state.employees);
    };

    private getEventsForCalendarFromShifts(shifts: Shift[]): EventForCalendar[] {
        let events: EventForCalendar[] = [];
        for (let shift of shifts) {
            events.push({
                id: "",
                start: shift.start,
                end: shift.end,
                resource: shift.employeeId
            });
        }
        return events;
    }


    public render(): JSX.Element {
        switch (this.state.fetchState) {
            case ScheduleRecievedState.WAITING:
                return <ComponentLoading />;
            case ScheduleRecievedState.OK:
                if (this.state.departments.length > 1) {
                    return (
                        <Container>
                            <SelectDepartment departments={this.state.departments} changeDepartment={this.#changeDepartment} />
                            <ComponentScheduleCreate events={this.getEventsForCalendarFromShifts(this.state.shifts)} employees={this.state.employees} addShift={this.#addShift} />
                        </Container>
                    );
                } else {
                    return <ComponentScheduleCreate events={this.getEventsForCalendarFromShifts(this.state.shifts)} employees={this.state.employees} addShift={this.#addShift} />;
                }
            default:
                return <ComponentScheduleCreate events={[]} employees={[]} addShift={this.#addShift} />;
        }
    }
}
