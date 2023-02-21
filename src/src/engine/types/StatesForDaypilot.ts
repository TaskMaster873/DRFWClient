import {DayPilot} from "@daypilot/daypilot-lite-react";
/**
 * Ceci est pour "standardiser" les paramètres du calendrier.
 * Voici la doc : https://api.daypilot.org/daypilot-calendar-methods/ et https://api.daypilot.org/daypilot-calendar-properties/
 */

import { EventForCalendar, ShiftForEventCreation } from "./Shift";

export interface DayPilotCalendarSettings {
    /** montrer le gris pâle ou non */
    cellsMarkBusiness: boolean;
	/** travail possible la fin de semaine */
	businessWeekends: boolean;
	/** pour voir les jours de la semaine */
    headerDateFormat: string;
	/** change le type */
    viewType: string;
 	/** la barre à gauche de couleur */ 
    durationBarVisible: boolean;
	/** la sélection des heures en cliquant les cellules */
    timeRangeSelectedHandling: string;
	/** changer la grosseur de l'event */
    eventResizeHandling: string;
	/** pouvoir le bouger */
    eventMoveHandling: string;
	/** pouvoir le delete */
    eventDeleteHandling: string;

}

/**
 * Ceci c'est pour le state de création d'employé
 */

export interface CalendarAttributesForEmployeeShiftCreationComponent {
	/** La journée qui est affichée */
	startDate: string;
	/** name = au nom de la personne et id est son id */
	columns: ColumnsType[];
	/** ce sont les shifts, daypilot appelle ça en event et events = à leur event.list */
	events: EventForCalendar[];
	/** La hauteur */
	heightSpec?: HeightSpecType;
	/** a une valeur de 300px de base */
	height?: number;
	/** 30px de base  */
	cellHeight?: number;
	/** le temps que vaut une cellule 30 de base, la précision en bref du calendrier en minutes */
	cellDuration?: number
	/** En bref cela change la vue et ressource serait important pour les départements */
	viewType: ViewType;
	/** si on veut ou non pouvoir enlever les shifts ou non */
	eventDeleteHandling: EventDeleteHandlingType;
	/** Donnée pour afficher les shifts */
	ListOfShifts: ShiftForEventCreation[];
	/** Si il affiche le popup */
	isShowingModal: boolean;
	/** jour d'affichage */
	start: DayPilot.Date;
	/** fin d'affichage */
	end: DayPilot.Date;
	/** nom des colonnes */
	resourceName: string;
}

export class ColumnsClass {

}

/**
 * Ceci sert à faire afficher les colonnes pour le ViewType Resources
 */
export interface ColumnsType {
	name: string;
	id: string;
}
/**
 * Les choix qu'on a gratuitement pour la hauteur
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
	/** Afficher plusieurs personnes à la fois */
	Resources  = "Resources"
}

export enum EventDeleteHandlingType {
	/** peut delete et cela met à jour le calendrier */
	Update = "Update",
	/** Désactiver la suppression */
	Disabled = "Disabled",
	CallBack = "CallBack",
	PostBack = "PostBack",

}
