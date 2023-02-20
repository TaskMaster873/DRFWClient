import React from "react";
import { ComponentLoading } from "../components/ComponentLoading";
import { ComponentScheduleCreate } from "../components/ComponentScheduleCreate";
import { API } from "../api/APIManager";
import { Shift } from "../types/Shift";

interface CreateScheduleState {
    list: Shift[];
}

export class CreateSchedule extends React.Component<unknown, CreateScheduleState> {
    public state: CreateScheduleState = {
        list: [],
    }

    /**
     * Called when the page is loaded
     * @description This function is called when the page is loaded. It will set the title of the page and call the API to get the list of shifts.
     * @returns {Promise<void>}
     * @memberof CreateSchedule
     * @public
     * @override
     * @async
     */
    public async componentDidMount() : Promise<void> {
        document.title = "Création d'horaire - TaskMaster";

        let shifts: Shift[] = await API.getDailyScheduleForDepartment("2023-02-17T00:00:00", "2023-02-18T00:00:00","bob3");
        console.log(shifts);

        this.setState({
            list: shifts
        });
    }

    public render(): JSX.Element {
        let listData = this.state.list;

        if (Array.isArray(listData)) {
            let length = listData.length;

            switch (length) {
                case 0: //quand la liste charge
                    return (
                        <ComponentLoading />
                    );
                default:
                    return (<ComponentScheduleCreate listOfShifts={listData} />);
            }
        } else {
            return (<div></div>);
        }

    }
}
