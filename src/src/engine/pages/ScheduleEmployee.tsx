import React from "react";
import {ComponentEmployeeScheduleView} from "../components/ComponentEmployeeScheduleView";
import {Shift} from "../types/Shift";
import {API} from "../api/APIManager";
import {ComponentLoading} from "../components/ComponentLoading";
import {NotificationManager} from "react-notifications";
import {errors} from "../messages/FormMessages";

interface ScheduleState {
    list: Shift[];
    fetchState: enumStateOfFetching;
}

enum enumStateOfFetching {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

/**
 * Page qui affiche l'horaire des employés
 */
export class ScheduleEmployee extends React.Component<unknown, ScheduleState> {
    public state: ScheduleState = {
        list: [],
        fetchState: enumStateOfFetching.WAITING,
    };

    public async componentDidMount(): Promise<void> {
        document.title = "Horaire - TaskMaster";

        let shifts = await this.#loadShiftsFromAPI();
        if (typeof shifts === "string") {

            this.setState({fetchState: enumStateOfFetching.ERROR});
            NotificationManager.error(errors.GET_SHIFTS, errors.ERROR_GENERIC_MESSAGE);
        } else {
            this.setState({list: shifts, fetchState: enumStateOfFetching.OK});
        }

    }

    // I did this function if we need to do something before the return (if there is some changes)
    async #loadShiftsFromAPI(): Promise<Shift[] | string> {
        return await API.getCurrentEmployeeSchedule();
    }

    public render(): JSX.Element {
        let listData: Shift[] = this.state.list;
        if (this.state.fetchState === enumStateOfFetching.WAITING) {
            return (
                <ComponentLoading />
            );
        } else if (this.state.fetchState === enumStateOfFetching.OK) {
            return (<ComponentEmployeeScheduleView listOfShifts={listData} />);

        } else {
            return (<ComponentEmployeeScheduleView listOfShifts={[]}/>);

        }

    }
}
