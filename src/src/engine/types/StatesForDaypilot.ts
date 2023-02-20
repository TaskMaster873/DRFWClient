import {DayPilot} from "@daypilot/daypilot-lite-react";
/**
 * Ceci est pour "standardiser" les paramètres du calendrier.
 * Voici la doc : https://api.daypilot.org/daypilot-calendar-methods/ et https://api.daypilot.org/daypilot-calendar-properties/
 */

import { EventForCalendar, ShiftForEventCreation } from "./Shift";

export interface DayPilotCalendarSettings {
    cellsMarkBusiness: boolean; //montrer le gris pâle ou non
    businessWeekends: boolean; // travail possible la fin de semaine,
    headerDateFormat: string; // pour voir les jours de la semaine,
    viewType: string; // 7 jours,
    durationBarVisible: boolean; // la barre à gauche
    timeRangeSelectedHandling: string; // la sélection des heures
    eventResizeHandling: string; //changer la grosseur de l'event
    eventMoveHandling: string; //pouvoir le bouger
    eventDeleteHandling: string; // pouvoir le delete
}

/**
 * Ceci c'est pour le state de création d'employé
 */

export interface CalendarAttributesForEmployeeShiftCreationComponent {
	startDate: string;
	columns: ColumnsType[]; //name = au nom de la personne et id est son id
	events: EventForCalendar[]; // shift
	heightSpec?: HeightSpecType;
	height?: number; //a une valeur de 300px de base
	cellHeight?: number; // 30px de base
	cellDuration?: number // le temps que vaut une cellule 30 de base
	viewType: ViewType; // En bref cela change la vue et ressource serait important pour les départements
	eventDeleteHandling: EventDeleteHandlingType;
	ListOfShifts: ShiftForEventCreation[];
	isShowingModal: boolean;
	start: DayPilot.Date;
	end: DayPilot.Date;
	resourceName: string;
}

export class ColumnsClass {
	
}

export interface ColumnsType {
	name:string;
	id:string;
}
/**
 * Les chois qu'on a gratuitement
 */
export enum HeightSpecType {
	BusinessHours = "BusinessHours" ,
	Full = "Full",
}

/**
 * La façon que le calendrier s'afficher
 */
export enum ViewType {
	Day = "Day",
	Week  = "Week",
	WorkWeek  = "WorkWeek",
	Days = "Days",
	Resources  = "Resources"
}

export enum EventDeleteHandlingType {
	Update = "Update", //peut delete
	Disabled = "Disabled", // désactivé
	CallBack = "CallBack",
	PostBack = "PostBack",

}
