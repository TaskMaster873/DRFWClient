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
 * @property {string} employeeName - Employee name
 * @property {string} projectName - Project name
 * @property {string} department - Department name
 * @property {string} start - Start date
 * @property {string} end - End date
 * @property {string} employeeId - Employee id
 * @description This class is used to create a Shift that will be used in the calendar
 */
export class Shift {
    public employeeName?: string;
    public projectName: string = "";
    public department: string = "";
    public start: string = "";
    public end: string = "";
    public employeeId: string = "";

    constructor(shift: ShiftDTO) {
        this.employeeName = shift.employeeName;
        this.employeeId = shift.employeeId;
        this.department = shift.department;
        this.projectName = shift.projectName;
        this.start = shift.start;
        this.end = shift.end;
    }
}

export interface ShiftDTO {
    readonly employeeName?: string;
    readonly employeeId: string;
    readonly department: string;
    readonly start: string;
    readonly end: string;
    readonly projectName: string;
}

export interface EventForShiftCreation {
    employeeId: string;
    start: DayPilot.Date;
    end: DayPilot.Date;
    department?: string;
    projectName?: string;
}

/**
 * Event serait les shifts avec toutes les données pour l'afficher dans l'horaire
 *
 */
export interface EventForCalendar {
  /** id unique dans le tableau d'horaire*/
  readonly id: number;
  /** le nom de l'event  */
  text?: string;
  /** heure de début */
  start: DayPilot.date;
  /** heure de fin */
  end: DayPilot.date;
  /** l'id de la personne qui l'a */
  resource?: string;
  /** couleur de la barre */
  barColor?: string;
  /** couleur de base */
  backColor?: string;
  /** l'id de l'employé pour mieux afficher */
  employeeId?: string;
}

export interface EventForCalendarList {
    Event: Event[];
}
