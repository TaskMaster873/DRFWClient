import {DayPilot} from "@daypilot/daypilot-lite-react"; 
import {Timestamp} from "firebase/firestore";
import {DateOfUnavailabilityList, DAYS, EmployeeRecursiveExceptionList} from "../types/EmployeeAvailabilities";

export class InternalDateManager {
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

    /**
     * 
     * @param days of the week
     * @param listOfDates of all unavailabilities
     * @returns {EmployeeRecursiveExceptionList} that has the good day ofthe week
     */
    public getCertainDayOfWeekUnavailabilities(days: DAYS, listOfDates: DateOfUnavailabilityList): EmployeeRecursiveExceptionList {
        let listToReturn: EmployeeRecursiveExceptionList = [];

        for (let unavailabilities of listOfDates) {
            if (unavailabilities.start.getDay() === days) {
                listToReturn.push({startTime: this.getMinutes(unavailabilities.start), endTime: this.getMinutes(unavailabilities.end)});
            }
        }
        return listToReturn;
    }

    /**
     * 
     * @param date 
     * @returns the number of minutes from the start of the day given in param
     */
    public getMinutes(date: Date): number {
        return date.getHours() * 60 + date.getMinutes();
    }
}

export const DateManager = new InternalDateManager();
