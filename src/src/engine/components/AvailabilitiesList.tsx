import React from "react";
import {Container, Table} from "react-bootstrap";
import {Employee} from "../types/Employee";
import {unavailabilitiesTableHeads} from "../types/EmployeeAvailabilities";


type Props = {
    employees: Employee[];
    unavailabilities: any[];
};

export class AvailabilitiesList extends React.Component<Props> {

    private renderEmployeeNameFromId(employeeId: string, index: number) {
        const currentEmployee = this.props.employees.find((e) => e.id == employeeId);
        if (!currentEmployee) {
            return (
                <>
                    <td key={"firstName " + index}>
                        N/a
                    </td>
                    <td key={"lastName " + index}>
                        N/a
                    </td>
                </>
            );
        }
        return (
            <>
                <td key={"firstName " + index}>
                    {currentEmployee.firstName}
                </td>
                <td key={"lastName " + index}>
                    {currentEmployee.lastName}
                </td>
            </>
        );
    }
    /**
     * Return the list of availability requests with their firstName, lastName, start and end
     * @returns {JSX.Element[]} The html table data for availabilities
     * @private
     * @memberof AvailabilitiesList
     */
    private unavailabilitiesList() {
        if (this.props.unavailabilities.length !== 0) {
            return this.props.unavailabilities.map((unavailability: any, index: number) => (
                <tr key={"secondCol" + index}>
                    <td key={"no" + index}>{index + 1}</td>
                    {this.renderEmployeeNameFromId(unavailability.employeeId, index)}
                    <td key={"start " + index}>
                        {unavailability.start}
                    </td>
                    <td key={"end " + index}>
                        {unavailability.end}
                    </td>
                </tr>
            ));
        } else {
            return [
                <tr key={"firstCol"}>
                    <td colSpan={10}>
                        <h6>Aucunes demandes de changement de disponibilités en cours.</h6>
                    </td>
                </tr>
            ];
        }
    }

    public render(): JSX.Element {
        return (
            <Container className="mt-5">
                <h3>Liste des demandes de changement de disponibilités</h3>
                <Table responsive bordered hover className="text-center">
                    <thead>
                        <tr key={"firstCol"}>
                            {unavailabilitiesTableHeads.map((th) => (<th key={th}>{th}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.unavailabilitiesList()}
                    </tbody>
                </Table>
            </Container>
        );
    }
}
