import { DayPilot } from "@daypilot/daypilot-lite-react";;

class DateConverter {

    public convertTimestampToDayPilotDate(time: string): string {
        return DayPilot.Date.parse(time, "yyyy-MM-ddTHH:mm:ss").toString("H:mm");

    }
    /**
     * Convert firebase timestamp to daypilot string
     * @param date the firebase timestamp to convert
     * @returns string daypilot Ex: (February 2, 2022 at 3:15 AM) = 2022-02-16T03:15:00
     */
    /*public getDayPilotDateString(date: Timestamp): string {
        //Take UTC timestamp, remove timezone offset, convert to ISO format
        let myDate = new Date((date.seconds - new Date().getTimezoneOffset() * 60) * 1000).toISOString();
        return myDate.slice(0, -5);
    }*/
    /**
     * Converti une date de daypilot en timestamp firebase
     * @param daypilotString string daypilot Ex: (2 février 2022 à 3h15 AM) = 2022-02-16T03:15:00
     * @returns Timestamp firebase
     */
    /*private getFirebaseTimestamp(daypilotString: string): Timestamp {
        return new Timestamp(Date.parse(daypilotString) / 1000, 0);
    }*/
} 

export const Converter = new DateConverter();