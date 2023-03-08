import React from "react";
import {Container, Table} from "react-bootstrap";
import {NotificationManager} from "../api/NotificationManager";
import {errors} from "../messages/FormMessages";
import {Employee} from "../types/Employee";
import {unavailabilitiesTableHeads, ViewableAvailabilities} from "../types/EmployeeAvailabilities";
import {CgCheckO, CgUnavailable} from "react-icons/cg";
import {IconContext} from "react-icons/lib";

type Props = {
    employees: Employee[];
    unavailabilities: ViewableAvailabilities[];
    acceptUnavailability: (unavailability: ViewableAvailabilities) => PromiseLike<void> | Promise<void> | void;
    refuseUnavailability: (unavailability: ViewableAvailabilities) => PromiseLike<void> | Promise<void> | void;
};

export class AvailabilitiesList extends React.Component<Props> {
    public render(): JSX.Element {
        return (
            <Container data-bs-theme={"dark"} className="mt-5">
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
            NotificationManager.error(errors.ERROR_GENERIC_MESSAGE, errors.GET_EMPLOYEES);
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
            return this.props.unavailabilities.map((unavailability: ViewableAvailabilities, index: number) => (
                <tr key={"secondCol" + index}>
                    <td key={"no" + index}>{index + 1}</td>
                    {this.employeeNameFromId(unavailability.employeeId, index)}
                    <td key={"start " + index}>
                        {unavailability.recursiveExceptions.startDate.toString()}
                    </td>
                    <td key={"end " + index}>
                        {unavailability.recursiveExceptions.endDate.toString()}
                    </td>
                    <td key={`action ${index}`}>
                        <a className="adminActions ms-1 mx-1"
                           onClick={() => this.props.acceptUnavailability(unavailability)}>
                            <IconContext.Provider value={{color: "white"}}>
                                <CgCheckO/>
                            </IconContext.Provider>
                        </a>
                        <a className="adminActions ms-1 mx-1"
                           onClick={() => this.props.refuseUnavailability(unavailability)}>
                            <IconContext.Provider value={{color: "white"}}>
                                <CgUnavailable/>
                            </IconContext.Provider>
                        </a>
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
}
