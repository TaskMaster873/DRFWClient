import {DayPilot} from "@daypilot/daypilot-lite-react";

/** 
 * Enum for all days name 
*/
export enum DAYS {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,

}

/**
 * The start time of the exception and end of the exception.
 * It is used when someone has a daybreak that is normal or juste some hours not available
 */
interface EmployeeRecursiveException {
    //should 
    startHour: number;
    endHour: number;
}

/**
 * The startDate when the availability is effective (Sunday) and the endDate is when the availibility end (Sunday)
 */
interface EmployeeAvailabilityException {
    startDate: DayPilot.Date;
    endDate: DayPilot.Date;
}

/**
 * Contains a list of {@link EmployeeRecursiveExceptionList} for everyDays that will be recursive every weeks
 */
interface RecursiveAvailabilities {
    startDate?: string;
    endDate?: string;
    [DAYS.SUNDAY]: EmployeeRecursiveExceptionList;
    [DAYS.MONDAY]: EmployeeRecursiveExceptionList;
    [DAYS.TUESDAY]: EmployeeRecursiveExceptionList;
    [DAYS.WEDNESDAY]: EmployeeRecursiveExceptionList;
    [DAYS.THURSDAY]: EmployeeRecursiveExceptionList;
    [DAYS.FRIDAY]: EmployeeRecursiveExceptionList;
    [DAYS.SATURDAY]: EmployeeRecursiveExceptionList;
}

/**
 * Contains a list of {@link EmployeeRecursiveException}
 */
export type EmployeeRecursiveExceptionList = EmployeeRecursiveException[];

/**
 * Contains a list of {@link EmployeeAvailabilityException}
 */
export type EmployeeAvailabilityExceptionList = EmployeeAvailabilityException[];

/**
 * Should contains a {@link RecursiveAvailabilities }, {@link EmployeeAvailabilityExceptionList} and a employeeId : string.
 * It is used to show the user his availabilities or to push his availabilities to his manager. 
 */
export interface EmployeeAvailabilities {
    /** When he can work */
    recursiveExceptions: RecursiveAvailabilitiesList;
    /** When he can work */
    //exception: EmployeeAvailabilityExceptionList;
    employeeId: string;
}

export type RecursiveAvailabilitiesList = RecursiveAvailabilities[];
