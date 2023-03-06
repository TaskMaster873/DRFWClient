import React from "react";
import {Container, Table} from "react-bootstrap";
import {NotificationManager} from "../api/NotificationManager";
import {errors} from "../messages/FormMessages";
import {Employee} from "../types/Employee";
import {unavailabilitiesTableHeads} from "../types/EmployeeAvailabilities";
import {CgCheckO, CgUnavailable} from "react-icons/cg";

type Props = {
    employees: Employee[];
    unavailabilities: any[];
    onChangeAcceptedValue: (unavailability: any) => PromiseLike<void> | Promise<void> | void;
};

export class AvailabilitiesList extends React.Component<Props> {
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

    /**
     * Creates the html elements of the employees name for the html table data
     * @param employeeId The employee's id
     * @param index the current table index
     * @returns {JSX.Element} the html elements for the employees name
     */
    private employeeNameFromId(employeeId: string, index: number): JSX.Element {
        const currentEmployee = this.props.employees.find((e) => e.id == employeeId);
        if (!currentEmployee) {
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, errors.GET_EMPLOYEES)
            return (
                <div>
                    <td key={"firstName " + index}/>
                    <td key={"lastName " + index}/>
                </div>
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
    private unavailabilitiesList(): JSX.Element[] {
        if (this.props.unavailabilities.length !== 0) {
            return this.props.unavailabilities.map((unavailability: any, index: number) => (
                <tr key={"secondCol" + index}>
                    <td key={"no" + index}>{index + 1}</td>
                    {this.employeeNameFromId(unavailability.employeeId, index)}
                    <td key={"start " + index}>
                        {unavailability.start}
                    </td>
                    <td key={"end " + index}>
                        {unavailability.end}
                    </td>
                    {this.renderActions(index, unavailability)}
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

    /**
     * Render the actions for the unavailability
     * @param index the current index
     * @param unavailability the unavailability
     * @private
     * @memberof AvailabilitiesList
     * @returns {JSX.Element | undefined} the html elements for the actions
     */
    private renderActions(index: number, unavailability: any): JSX.Element | undefined {
        let component: JSX.Element = <CgUnavailable/>;
        if (!unavailability.isAccepted) {
            component = <CgCheckO/>
        }
        return (
            <td key={`action ${index}`}>
                <a className="adminActions ms-1 mx-1"
                   onClick={() => this.props.onChangeAcceptedValue(unavailability)}>{component}</a>
            </td>
        );
    }
}
