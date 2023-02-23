import { DayPilot } from "@daypilot/daypilot-lite-react";;

class DateConverter {

    public convertTimestampToDayPilotDate(time: string): string {
        return DayPilot.Date.parse(time, "yyyy-MM-ddTHH:mm:ss").toString("H:mm");

    }
} 

export const Converter = new DateConverter();