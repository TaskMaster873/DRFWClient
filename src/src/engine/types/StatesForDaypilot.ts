import {DayPilot} from "@daypilot/daypilot-lite-react";
/**
 * Ceci est pour "standardiser" les paramètres du calendrier.
 * Voici la doc : https://api.daypilot.org/daypilot-calendar-methods/ et https://api.daypilot.org/daypilot-calendar-properties/
 */

import { EventForCalendar } from "./Shift";

export interface DayPilotCalendarSettings {
	/** show the color for hours that are not business hours */
    cellsMarkBusiness: boolean;
	/** same as cellMarkBusiness but for the weekend  */
    businessWeekends: boolean;
	/** what we see in the header */
    headerDateFormat: string;
	/** how it show the shifts */
    viewType: "Week" | "Day" | "Days" | "WorkWeek" | "Resources" | undefined;
	/** show the bar of duration  */
    durationBarVisible: boolean;
	/** event daypilot when we click on cells */
    timeRangeSelectedHandling: "Disabled" | "CallBack" | "Enabled" | undefined;
	/** if we can resize events */
    eventResizeHandling: "Disabled" | "Update" | "CallBack" | "Notify" | undefined;
	/** if wwe can drag event or not */
    eventMoveHandling: "Disabled" | "Update" | "CallBack" | "Notify" | undefined;
	/** if we can delete the events */
    eventDeleteHandling: "Disabled" | "Update" | "CallBack" | undefined;
}


export enum EventManipulationType {
	CREATE = "Créer",
	EDIT = "Modifier"
}

export interface ColumnsType {
	name: string;
	id: string;
}
/**
 * The choices we have for free
 */
export enum HeightSpecType {
	BusinessHours = "BusinessHours" ,
	Full = "Full",
}

/**
 * The choices we have for free
 */
export enum ViewType {
	Day = "Day",
	Week  = "Week",
	WorkWeek  = "WorkWeek",
	Days = "Days",
	Resources = "Resources"
}

export enum EventDeleteHandlingType {
	/** We can delete */
	Update = "Update",
	/** We cannot delete */
	Disabled = "Disabled",
	CallBack = "CallBack",
	PostBack = "PostBack",

}
