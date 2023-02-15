import React from "react";
import {Container} from "react-bootstrap";
import {ComponentDepartmentList} from "../components/ComponentDepartmentList";

/**
 * Ceci est la page pour les employés
 */
export class Departments extends React.Component {
    public async componentDidMount() {
        document.title = "Employés - TaskMaster";
    }

    /**
     *
     * @returns La liste des employés
     */
    public render(): JSX.Element {
        return (
            <Container>
                <ComponentDepartmentList />
            </Container>
        );
    }
}
