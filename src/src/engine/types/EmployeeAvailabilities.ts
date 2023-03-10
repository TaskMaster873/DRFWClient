import {DayPilot} from "@daypilot/daypilot-lite-react";

/**
 * Enum for all days name
 */
export enum DAYS {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}

/**
 * The startTime is when the employee starts being unavailable and the endTime is when the employee ends being unavailable
 */
export interface EmployeeAvailabilityException {
    startTime: DayPilot.Date;
    endTime: DayPilot.Date;
}

/**
 * Contains a list of {@link EmployeeAvailabilityExceptionList} for everyDays that will be recursive every weeks
 */
export interface RecursiveAvailabilities {
    startDate: DayPilot.Date;
    endDate: DayPilot.Date;
    [DAYS.SUNDAY]: EmployeeAvailabilityExceptionList;
    [DAYS.MONDAY]: EmployeeAvailabilityExceptionList;
    [DAYS.TUESDAY]: EmployeeAvailabilityExceptionList;
    [DAYS.WEDNESDAY]: EmployeeAvailabilityExceptionList;
    [DAYS.THURSDAY]: EmployeeAvailabilityExceptionList;
    [DAYS.FRIDAY]: EmployeeAvailabilityExceptionList;
    [DAYS.SATURDAY]: EmployeeAvailabilityExceptionList;
}

/**
 * Contains a list of {@link EmployeeAvailabilityException}
 */
export type EmployeeAvailabilityExceptionList = EmployeeAvailabilityException[];

/**
 * Should contains a {@link RecursiveAvailabilities } that contains the unavailabilities, {@link EmployeeAvailabilityExceptionList} and a employeeId : string.
 * It is used to show the user his availabilities or to push his availabilities to his manager.
 */
export interface EmployeeAvailabilities {
    recursiveExceptions: RecursiveAvailabilitiesList;
    employeeId: string;
}

/**
 * contains a list of {RecursiveAvailabilities}
 */
export type RecursiveAvailabilitiesList = RecursiveAvailabilities[];

export interface EventsForUnavailability {
    start: string;
    end: string;
    text: string;
}

export type EventsForUnavailabilityList = EventsForUnavailability[];

/**
 * Used for the creation of availabilities
 */
export interface EmployeeAvailabilitiesForCreate {
    recursiveExceptions: RecursiveAvailabilities;
    employeeId?: string;
}

/**
 * The start and end date of unavailability
 */
export interface DateOfUnavailability {
    start: Date,
    end: Date
}

/**
 * List of date to convert
 */
export type DateOfUnavailabilityList = DateOfUnavailability[];

export const unavailabilitiesTableHeads: string[] = ["#", "Pr??nom", "Nom", "D??but", "Fin", "Actions"];

/**
 * Availabilities stored in DB.
 */
export interface ViewableAvailabilities {
    id: string;
    recursiveExceptions: RecursiveAvailabilities;
    isAccepted: boolean;
    department: string;
    employeeId: string;
}
