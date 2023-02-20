/**
 * Contient tout les renseignements des disponibilités de l'application web
 */
export class Availability {
    begin: Date = new Date(Date.now());
    end: Date =  new Date(Date.now());

    constructor(availability: AvailabilityCreateDTO) {
        this.begin = availability.begin;
        this.end = availability.end;
    }
}
/**
 * Contient tout les renseignements pour créer une nouvelle disponibilité dans la bd
 */
export interface AvailabilityCreateDTO {
    readonly begin: Date;
    readonly end: Date;
}

