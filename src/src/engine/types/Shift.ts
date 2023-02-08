import {Employee} from "./Employee";
import {Project} from "./Project";
import {DayPilot} from "@daypilot/daypilot-lite-react";

export interface ShiftsList {
  shifts: Shift[];
}

export interface Shift {
  project: Project;
  text: string;
  resource: string;
  start: string;
  end: number;
  employe: Employee;
  readonly id: string;
}

export interface ShiftDTO {
  readonly text: string;
  readonly resource: string;
  readonly start: string;
  readonly end: number;
  readonly id: string;
  readonly project: Project;
  readonly employe: Employee;
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