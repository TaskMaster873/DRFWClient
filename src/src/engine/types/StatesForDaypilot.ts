/**
 * Ceci est pour "standardiser" les paramètres du calendrier.
 * Voici la doc : https://api.daypilot.org/daypilot-calendar-methods/
 */

export interface CalendarAttributesForEmployeeSchedule {
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
