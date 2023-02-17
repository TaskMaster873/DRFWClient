import {DayPilot} from "@daypilot/daypilot-lite-react";

export interface ShiftsList {
  shifts: Shift[];
}

export interface ShiftForCalendar {
  text: string,
  start: string;
  end: string;
}

export class Shift {
  employeeName?: string;
  projectName: string = "";
  department: string = "";
  start: string = "";
  end: string = "";
  employeeId: string = "";

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

/**
 * Ceci sont les données qu'on a besoin pour afficher à la bonne place le shift
 */
export interface ShiftForEventCreation {
   employeeId: string;
   start: string;
   end: string;
   departmentName: string;
}
/**
 * Event serait les shifts avec toutes les données pour l'afficher dans l'horaire
 *
 */
export interface EventForCalendar {
  readonly id: number; //id unique dans le tableau d'horaire
  text?: string; // le nom de l'event
  start: DayPilot.date;//heure de début
  end: DayPilot.date; //heure de fin
  resource?: string;//l'id de la personne qui l'a
  barColor?: string; // couleur de la barre
  backColor?: string
}

export interface EventForCalendarList {
  Event: Event[];
}