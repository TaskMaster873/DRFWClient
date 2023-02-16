import {Employee} from "./Employee";
import {Project} from "./Project";
import {DayPilot} from "@daypilot/daypilot-lite-react";

export interface ShiftsList {
  shifts: Shift[];
}

export interface ShiftForCalendar {
  start: string;
  end: string;
}

export class Shift {
  projectName: string = "";
  start: string = "";
  end: string = "";
  employeeId: string = "";
  
  constructor(shift: ShiftDTO) {
  this.employeeId= shift.employeeId;
  this.projectName = shift.projectName;
   this.start = shift.start;
  this.end = shift.end;
 }
}

export interface ShiftDTO {
  readonly employeeId: string;
  readonly start: string;
  readonly end: string;
  readonly projectName: string;

  
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