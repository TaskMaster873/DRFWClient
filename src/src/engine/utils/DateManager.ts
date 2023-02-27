import {DayPilot} from "@daypilot/daypilot-lite-react"; import {Timestamp} from "firebase/firestore";
;

export class DateManager {

    public convertTimestampToDayPilotDate(time: string): string {
        return DayPilot.Date.parse(time, "yyyy-MM-ddTHH:mm:ss").toString("H:mm");

    }

    /**
     * Convert firebase timestamp to daypilot string
     * @param date the firebase timestamp to convert
     * @returns string daypilot Ex: (February 2, 2022 at 3:15 AM) = 2022-02-16T03:15:00
     */
    public getDayPilotDateString(date: Timestamp): string {
        //Take UTC timestamp, remove timezone offset, convert to ISO format
        let myDate = new Date((date.seconds - new Date().getTimezoneOffset() * 60) * 1000).toISOString();
        return myDate.slice(0, -5);
    }

    /**
     * Convert a date into a Timestamp
     * @param daypilotString string daypilot Ex: (2 février 2022 à 3h15 AM) = 2022-02-16T03:15:00
     * @returns Timestamp firebase
     */
    public getFirebaseTimestamp(daypilotString: string): Timestamp {
        return new Timestamp(Date.parse(daypilotString) / 1000, 0);
    }

    public addDaysToADate(numberOfDays: number, date: Date): Date {
        let numberOfMs = date.getTime();
        let msToAdd = 60 * 60 * 1000 * (24 * numberOfDays);
        return new Date(numberOfMs + msToAdd);
    }

    public addHoursAndMinutes(numberOfMinutes: number, date: Date): string {
        let numberOfMs = date.getTime();
        let msToAdd = 60 * 1000 * numberOfMinutes;
        //To get the good timezone and to get it good for a DayPilot.Date
        let newDate = new Date(numberOfMs + msToAdd);
        return this.changeDateToDayPilotFormat(newDate);
    }

    public changeDateToDayPilotFormat(date: Date) {
        return date.toISOString().slice(0, -5);
    }
}

export const ManagerDate = new DateManager();