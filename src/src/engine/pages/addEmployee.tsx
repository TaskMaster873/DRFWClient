import React from "react";
import {ComponentAddEmployee} from "../components/ComponentAddEmployee";
import {API} from "../api/APIManager";

/**
 * Ceci est la page pour ajouter un employé
 */
export class AddEmployee extends React.Component {

    public state = {
        departments: [],
        roles: [],
        titles: [],
    }
    public async componentDidMount() {
        let departments = await API.getDepartments();
        let roles = await API.getRoles();
        let titles = await API.getJobTitles();
        this.setState({departments: departments, roles: roles, titles: titles})
        document.title = "Ajouter un Employé - TaskMaster";
    }
    /**
     *
     * @returns ComponentAddEmployee avec la liste de titre et celle de role
     */
    public render(): JSX.Element {
        return (
            <ComponentAddEmployee
                departments={this.state.departments}
                roles={this.state.roles}
                jobTitles={this.state.titles}
            />
        );
    }
}
