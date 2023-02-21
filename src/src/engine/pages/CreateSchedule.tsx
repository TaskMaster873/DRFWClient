import React from "react";
import {ComponentLoading} from "../components/ComponentLoading";
import {ComponentScheduleCreate} from "../components/ComponentScheduleCreate";
import {API} from "../api/APIManager";
import {Shift} from "../types/Shift";
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {NotificationManager} from "react-notifications";
import {errors} from "../messages/FormMessages";
import {RoutesPath} from "../RoutesPath";
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
    departments: Department[];
    employees: Employee[];
    shifts: Shift[];
    fetchState: ScheduleRecievedState;
}

export class CreateSchedule extends React.Component<unknown, CreateScheduleState> {
    public state: CreateScheduleState = {
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
            })
            return;
        }
        else {
            await this.#changeDepartment(fetchedDepartments[0], fetchedDepartments);
        }
    }

    readonly #changeDepartment = async (currentDepartment: Department, departments?: Department[]) => {
        console.trace("changing", currentDepartment);
        let fetchType = ScheduleRecievedState.WAITING
        //Get all employees of this department
        let fetchedEmployees = await API.getEmployees(currentDepartment.name);
        if (typeof fetchedEmployees === "string") {
            fetchType = ScheduleRecievedState.ERROR;
            return;
        }

        //Get all daily shifts of this department
        let fetchedShifts = await API.getDailyScheduleForDepartment(DayPilot.Date.today(), currentDepartment);
        if (typeof fetchedShifts === "string") fetchType = ScheduleRecievedState.ERROR;
        else {
            console.log("employees there", fetchedEmployees)
            this.setState({
                departments: departments || this.state.departments,
                employees: fetchedEmployees,
                shifts: fetchedShifts,
                fetchState: ScheduleRecievedState.OK,
            });
        }
    };


    public render(): JSX.Element {
        console.log("fetchstatus", this.state)
        switch (this.state.fetchState) {
            case ScheduleRecievedState.WAITING:
                return <ComponentLoading />;
            case ScheduleRecievedState.OK:
                if (this.state.departments.length > 1) {
                    return (
                        <Container>
                            <SelectDepartment departments={this.state.departments} changeDepartment={this.#changeDepartment} />
                            <ComponentScheduleCreate shifts={this.state.shifts} employees={this.state.employees} />
                        </Container>
                    );
                } else {
                    return <ComponentScheduleCreate shifts={this.state.shifts} employees={this.state.employees} />;
                }
            default:
                return <ComponentScheduleCreate shifts={[]} employees={[]} />;
        }
    }
}
