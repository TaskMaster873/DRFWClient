import React from "react";
import {ComponentAddEmployee} from "../components/ComponentAddEmployee";
import {RolesList} from "../types/Role";
import {Availability} from "../types/Availability";

/**
 * Ceci est la page pour ajouter un employé
 */
export class Availabilities extends React.Component {
    private availabilities : Availability[] = [];

    public componentDidMount() {
        document.title = "Disponibilitées - TaskMaster";
    }

    /**
     *
     * @returns ComponentAddEmployee avec la liste de titre et celle de role
     */
    public render(): JSX.Element {
        return (
            <ComponentAddEmployee {...{availabilities: this.availabilities}}/>
        );
    }
}
