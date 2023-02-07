
/**
 * Ceci est du code qui a été cherché en partie sur https://code.daypilot.org/42221/react-weekly-calendar-tutorial,  la documentation de la librairie daypilot
 */
import React, { Component } from 'react';
import { colorRGB } from '../messages/ColorForAvailability'
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "../../deps/css/navigator_default.css";

const styles = {
    wrap: {
        display: "flex"
    },
    left: {
        marginRight: "10px"
    },
    main: {
        flexGrow: "1"
    },
};

export class ComponentAvailabilities extends Component {
    calendarRef: React.RefObject<any>;
    datePickerRef: React.RefObject<any>;

    constructor(props) {
        super(props);
        this.calendarRef = React.createRef();
        this.datePickerRef = React.createRef();
        this.state = {
            headerDateFormat: "dddd",
            viewType: "Week",
            eventResizeHandling: "Disabled",
            eventMoveHandling: "Disabled",
            durationBarVisible: false,
            timeRangeSelectedHandling: "Disabled",
            eventDeleteHandling: "Disabled",
            onEventClick: this.onEventClick
        };
    }

    render() {
        return (
            <div style={styles.wrap}>
                <div style={styles.left}>
                    <DayPilotNavigator
                       // theme={"navigator_default.css"}
                        selectMode={"week"}
                        showMonths={3}
                        skipMonths={3}
                        startDate={"2023-03-07"}
                        selectionDay={"2023-03-07"}
                        onTimeRangeSelected={args => {
                            this.calendar.update({
                                startDate: args.day,
                            });
                        }}
                        ref={this.datePickerRef}
                    />
                </div>
                <div style={styles.main}>
                    <DayPilotCalendar
                        {...this.state}
                        ref={this.calendarRef}
                    />
                </div>
            </div>
        );
    }

    onEventClick = async (args: any) => { // TODO changer ce que la méthode fait
        const dp = this.calendar;
        const form = [
            {
                type: 'searchable',
                id: 'searchable1',
                name: 'Searchable 1',
                options: [
                    {
                        name: 'Rouge',
                        id: 'rouge',
                    },
                    {
                        name: 'Vert',
                        id: 'vert',
                    },
                    {
                        name: 'Bleu',
                        id: 'bleu',
                    },
                    {
                        name: 'Mauve',
                        id: 'mauve',
                    },
                    {
                        name: 'Jaune',
                        id: 'jaune',
                    },
                    {
                        name: 'Orange',
                        id: 'orange',
                    },
                ],
            },
        ];
        const data = {};

        const modal = await DayPilot.Modal.form(form, data);
        console.log(modal.result.searchable1);

        //const modal = await DayPilot.Modal.prompt("Update event text:", args.e.text());
        if (!modal.result) { return; }
        let rgb = this.colorRGBHandling(modal.result.searchable1);
        const e = args.e;
        e.data.backColor = rgb;
        dp.events.update(e);
    };

    private colorRGBHandling(colorInRGB: string): string {
        if (colorInRGB.startsWith("r")) {
            console.log("okokdfok")
            return colorRGB.redRGB;
        }
        return "";
    }
    get calendar() {
        return this.calendarRef.current.control;
    }

    get datePicker() {
        return this.datePickerRef.current.control;
    }

    componentDidMount() {

        const events = [
            {
                id: 1,
                text: "Event 1",
                start: "2023-03-07T10:30:00",
                end: "2023-03-07T13:00:00"
            },
            {
                id: 2,
                text: "Event 2",
                start: "2023-03-08T09:30:00",
                end: "2023-03-08T11:30:00",
                backColor: "#6aa84f"
            },
            {
                id: 3,
                text: "Event 3",
                start: "2023-03-08T12:00:00",
                end: "2023-03-08T15:00:00",
                backColor: "#f1c232"
            },
            {
                id: 4,
                text: "Event 4",
                start: "2023-03-06T11:30:00",
                end: "2023-03-06T14:30:00",
                backColor: "#cc4125"
            },
            {
                id: 5,
                text: "Event 5",
                start: "2023-03-11T11:30:00",
                end: "2023-03-12T14:30:00",
                backColor: "#eeaabb"
            },
        ];

        const startDate = "2023-03-07";

        this.calendar.update({ startDate, events });
        this.datePicker.update({ events: events });

    }
}