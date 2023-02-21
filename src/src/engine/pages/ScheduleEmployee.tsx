import React from "react";
import { ComponentEmployeeScheduleView } from "../components/ComponentEmployeeScheduleView";
import { Shift } from "../types/Shift";
import { API } from "../api/APIManager";
import { ComponentLoading } from "../components/ComponentLoading";

interface ScheduleState {
    list: Shift[];
}

/**
 * Page qui affiche l'horaire des employés
 */
export class ScheduleEmployee extends React.Component<unknown, ScheduleState> {
    public state: ScheduleState = {
        list: [],
    }

    public async componentDidMount() : Promise<void> {
        document.title = "Horaire - TaskMaster";

        // TODO - Pass an employee id?
        let shifts = await API.getCurrentEmployeeSchedule();

        // TODO - Check for possible errors?
        this.setState({ list: shifts });
    }

    public render(): JSX.Element {
        let listData: Shift[] = this.state.list;
        if (Array.isArray(listData)) {

            // TODO - REFACTOR THIS
            let length = listData.length;
            switch (length) {
                case 0: //quand la liste charge
                    return (
                        <ComponentLoading />
                    );
                default:
                    return (<ComponentEmployeeScheduleView listOfShifts={listData} />);
            }
        } else {
            return (<div></div>);
        }
    }
}
