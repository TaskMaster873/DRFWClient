import {DayPilot} from "@daypilot/daypilot-lite-react";

export interface ShiftForCalendar {
    text: string,
    start: string;
    end: string;
}

/**
 * Shift class
 * @class Shift
 * @classdesc Shift class
 * @property {string} projectName - Project name
 * @property {string} department - Department name
 * @property {string} start - Start date
 * @property {string} end - End date
 * @property {string} employeeId - Employee id
 * @description This class is used to create a Shift that will be used in the calendar
 */
export class Shift {
    public id: string = "";
    public department: string = "";
    public start: string = "";
    public end: string = "";
    public employeeId: string = "";

    constructor(shift: ShiftDTO) {
        this.id = shift.id;
        this.employeeId = shift.employeeId;
        this.department = shift.department;
        this.start = shift.start;
        this.end = shift.end;
    }
}

export interface ShiftCreateDTO {
    readonly employeeId: string;
    readonly department: string;
    readonly start: string;
    readonly end: string;
}

export interface ShiftDTO {
    readonly id: string;
    readonly employeeId: string;
    readonly department: string;
    readonly start: string;
    readonly end: string;
}

export interface EventForShiftCreation {
    employeeId: string;
    start: DayPilot.Date;
    end: DayPilot.Date;
}

export interface EventForShiftEdit {
    id: string;
    employeeId: string;
    start: DayPilot.Date;
    end: DayPilot.Date;
}

/**
 * Event would be the shifts with all the data to display it in the schedule
 *
 */
export interface EventForCalendar {
    /** unique id in schedule board */
    readonly id: string;
    /** what is written in the calendar */
    text?: string;
    /** time where it start */
    start: DayPilot.date;
    /** end of the event */
    end: DayPilot.date;
    /** the column where it will be */
    resource?: string;
    /** color of de bar */
    barColor?: string;
    /** color of what's remaining */
    backColor?: string;
    /** id of the employee that has the shift */
    employeeId?: string;
}

export interface EventForCalendarList {
    Event: Event[];
}
