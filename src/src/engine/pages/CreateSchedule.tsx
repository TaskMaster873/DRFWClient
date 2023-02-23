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
import {NotificationManager} from 'react-notifications';
import {errors} from "../messages/FormMessages";


enum FetchState {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

interface CreateScheduleState {
    currentDepartment: Department | null;
    departments: Department[];
    employees: Employee[];
    shifts: Shift[];
    fetchState: FetchState;
}

export class CreateSchedule extends React.Component<unknown, CreateScheduleState> {
    public state: CreateScheduleState = {
        currentDepartment: null,
        departments: [],
        employees: [],
        shifts: [],
        fetchState: FetchState.WAITING,
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
            NotificationManager.error(errors.GET_DEPARTMENTS, fetchedDepartments)
            this.setState({fetchState: FetchState.ERROR});
        }
        else {
            await this.#changeDepartment(fetchedDepartments[0], fetchedDepartments);
        }
    }

    /**
     * Change employees, shifts to a new current department and refresh state down the function chain (Start of function chain)
     * @param currentDepartment 
     * @param departments 
     */
    readonly #changeDepartment = async (currentDepartment: Department, departments?: Department[]): Promise<void> => {
        //Get all employees of this department
        let fetchedEmployees = await API.getEmployees(currentDepartment.name);
        if (typeof fetchedEmployees === "string") {
            NotificationManager.error(errors.GET_EMPLOYEES, fetchedEmployees)
            this.setState({fetchState: FetchState.ERROR});
        }
        else {
            this.#getShifts(currentDepartment, departments, fetchedEmployees);
        }
    };

    /**
     * Fetch shifts and refresh state with all data (End of function chain)
     * @param currentDepartment The department to fetch the shifts from
     * @param departments OPTIONAL. The departments to set in state
     * @param employees OPTIONAL. The employees to set in state
     */
    readonly #getShifts = async (currentDepartment: Department, departments?: Department[], employees?: Employee[]): Promise<void> => {
        //Get all daily shifts of this department
        let fetchedShifts = await API.getDailyScheduleForDepartment(DayPilot.Date.today(), currentDepartment);
        if (typeof fetchedShifts === "string") {
            NotificationManager.error(errors.GET_SHIFTS, fetchedShifts)
            this.setState({fetchState: FetchState.ERROR});
        }
        else {
            this.setState({
                currentDepartment: currentDepartment,
                departments: departments || this.state.departments,
                employees: employees || this.state.employees,
                shifts: fetchedShifts,
                fetchState: FetchState.OK,
            });
        }
    };

    
    /**
     * Adds a shift to the DB and refreshes the state (Halfway through the function chain)
     * @param shiftEvent The shift to add
     */
    readonly #addShift = async (shiftEvent: EventForShiftCreation): Promise<void> => {
        let currentDepartment = this.state.currentDepartment ? this.state.currentDepartment : {name: "", director: ""};
        //Create Shift
        let success = await API.createShift({
            employeeId: shiftEvent.employeeId,
            start: shiftEvent.start,
            end: shiftEvent.end,
            department: this.state.currentDepartment ? this.state.currentDepartment.name : "",
            projectName: ""
        });
        if (typeof success === "string") {
            NotificationManager.error(errors.CREATE_SHIFT, success)
            this.setState({fetchState: FetchState.ERROR});
        }
        //Refresh shifts
        else await this.#getShifts(currentDepartment, this.state.departments, this.state.employees);
    };

    /**
     * Converts the shift into events for the Daypilot calendar
     * @param shifts the Shift objects to convert
     * @returns the converted shifts
     */
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
            case FetchState.WAITING:
                return <ComponentLoading />;
            case FetchState.OK:
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
