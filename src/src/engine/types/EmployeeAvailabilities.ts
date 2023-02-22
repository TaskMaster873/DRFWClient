/** 
 * Enum for all days name 
*/
export enum DAYS {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
}

/**
 * The start time of the execption and end of the exception.
 * It is used when someone has a daybreak that is not normal or juste some hours not available
 */
interface EmployeeRecursiveException {
    startHour: number;
    endHour: number;
}

/**
 * The startDate when the availability is effective (Sunday) and the endDate is when the availibility end (Sunday)
 */
interface EmployeeAvailabilityException {
    startDate: Date;
    endDate: Date;
}

/**
 * Contains a list of {@link EmployeeRecursiveExceptionList} for everyDays
 */
interface RecursiveException {
    [DAYS.MONDAY]: EmployeeRecursiveExceptionList;
    [DAYS.TUESDAY]: EmployeeRecursiveExceptionList;
    [DAYS.WEDNESDAY]: EmployeeRecursiveExceptionList;
    [DAYS.THURSDAY]: EmployeeRecursiveExceptionList;
    [DAYS.FRIDAY]: EmployeeRecursiveExceptionList;
    [DAYS.SATURDAY]: EmployeeRecursiveExceptionList;
    [DAYS.SUNDAY]: EmployeeRecursiveExceptionList;
}

/**
 * Contains a list of {@link EmployeeRecursiveException}
 */
type EmployeeRecursiveExceptionList = EmployeeRecursiveException[];

/**
 * Contains a list of {@link EmployeeAvailabilityException}
 */
type EmployeeAvailabilityExceptionList = EmployeeAvailabilityException[];

/**
 * Should contains a {@link RecursiveException }, {@link EmployeeAvailabilityExceptionList} and a employeeId : string.
 * It is used to show the user his availabilities or to push his availabilities to his manager. 
 */
export interface EmployeeAvailabilities {
    /** When he can't but is an exeption  */
    recursiveExceptions: RecursiveException;
    /** When he can work */
    exception: EmployeeAvailabilityExceptionList;
    employeeId: string;
}