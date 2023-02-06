import React from "react";
import {Availability, AvailabilityList} from "../types/Availability";
import {ComponentAvailabilities} from "../components/ComponentAvailabilities";

/**
 * Ceci est la page pour ajouter un employé
 */
export class Availabilities extends React.Component {
    private availabilities : Availability[] = [
        new Availability(
            {
                begin: new Date(Date.now()),
                end: new Date(Date.now())
            }
        )
    ];

    public componentDidMount() {
        document.title = "Disponibilitées - TaskMaster";
    }

    /**
     *
     * @returns ComponentAddEmployee avec la liste de titre et celle de role
     */
    public render(): JSX.Element {
        let listData: AvailabilityList = { list: this.availabilities };
        return (
            <ComponentAvailabilities {...{availabilities: listData}}/>
        );
    }
}
