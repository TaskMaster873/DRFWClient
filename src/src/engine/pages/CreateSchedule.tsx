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
import {department} from "../../../Constants/testConstants";

enum ScheduleRecievedState {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

interface CreateScheduleState {
    departments: Department[];
    shifts: Shift[];
    fetchState: ScheduleRecievedState;
}

export class CreateSchedule extends React.Component<unknown, CreateScheduleState> {
    public state: CreateScheduleState = {
        departments: [],
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
            NotificationManager.error(errors.GET_DEPARTMENTS, fetchedDepartments);
            this.setState({
                fetchState: ScheduleRecievedState.ERROR
            });
            return;
        }
        else {
            this.setState({
                departments: fetchedDepartments,
            });
            this.#changeDepartment(fetchedDepartments[0])
        }
    }

    readonly #changeDepartment = async (department: Department) => {
        console.log("changing", department)
        let fetchedData = await API.getDailyScheduleForDepartment(DayPilot.Date.today(), department);
        if (typeof fetchedData === "string") {
            NotificationManager.error(errors.GET_SHIFTS, fetchedData);
            this.setState({
                fetchState: ScheduleRecievedState.ERROR
            });
        }
        else {
            this.setState({
                shifts: fetchedData as Shift[],
                fetchState: ScheduleRecievedState.OK,
            });
        }
    };


    public render(): JSX.Element {
        switch (this.state.fetchState) {
            case ScheduleRecievedState.WAITING:
                return <ComponentLoading />;
            case ScheduleRecievedState.OK:
                if(this.state.departments.length > 1){
                    return (
                        <Container>
                            <SelectDepartment departments={this.state.departments} changeDepartment={this.#changeDepartment} />
                            <ComponentScheduleCreate shifts={this.state.shifts} />
                        </Container>
                    );
                }else{
                    return <ComponentScheduleCreate shifts={this.state.shifts} />
                }
                
            default:
                return <ComponentScheduleCreate shifts={[]} />;
        }
    }
}
