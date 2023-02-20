import React from "react";
import { Availability } from "../types/Availability";
import { ComponentAvailabilities } from "../components/ComponentAvailabilities";
import { DayPilot } from "@daypilot/daypilot-lite-react";

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
        let events = {
            id: 0,
            text: 'a',
            start: DayPilot.Date,
            end: DayPilot.Date
        };

        return (
            <ComponentAvailabilities {...{events: events}} />
        );
    }
}
