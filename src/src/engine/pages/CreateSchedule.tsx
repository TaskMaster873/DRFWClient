import React from "react";
import {ComponentLoading} from "../components/ComponentLoading";
import {ComponentScheduleCreate} from "../components/ComponentScheduleCreate";
import {API} from "../api/APIManager";
import {Shift} from "../types/Shift";
import {DayPilot} from "@daypilot/daypilot-lite-react";
import {NotificationManager} from "react-notifications";
import {errors} from "../messages/FormMessages";
import {RoutePaths} from "../api/routes/RoutePaths";

enum ScheduleRecievedState {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

interface CreateScheduleState {
    shifts: Shift[];
    fetchState: ScheduleRecievedState;
}

export class CreateSchedule extends React.Component<unknown, CreateScheduleState> {
    public state: CreateScheduleState = {
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
        let fetchedData = await API.getDailyScheduleForDepartment(DayPilot.Date.today(), {name:"bob3", director:"person"});
        if (typeof fetchedData === "string") {
            NotificationManager.error(errors.GET_SHIFTS, fetchedData);
            this.setState({
                fetchState: ScheduleRecievedState.ERROR
            })
        }
        else {
            this.setState({
                shifts: fetchedData as Shift[],
                fetchState: ScheduleRecievedState.OK,
            });
        }
    }

    public render(): JSX.Element {
        switch (this.state.fetchState) {
            case ScheduleRecievedState.WAITING:
                return <ComponentLoading />;
            case ScheduleRecievedState.OK:
                return <ComponentScheduleCreate shifts={this.state.shifts} />;
            default:
                return <ComponentScheduleCreate shifts={[]} />;
        }
    }
}
