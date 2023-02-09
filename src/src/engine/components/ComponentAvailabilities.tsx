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

type Props = { events: { id: number, text: string, start: DayPilot.Date, end: DayPilot.Date } }; // props quand on aura la bd

export class ComponentAvailabilities extends Component {
    calendarRef: React.RefObject<any>;
    datePickerRef: React.RefObject<any>;

    constructor(props) {
        super(props);
        this.calendarRef = React.createRef();
        this.datePickerRef = React.createRef();
        this.state = {
            //eventResizeHandling: "Disabled",
            //eventMoveHandling: "Disabled",
            /*businessBeginsHour: 0,
            businessEndsHour: 24,
            businessWeekends: true,
            durationBarVisible: false,
            showNonBusiness: true,*/
            //timeRangeSelectedHandling: "Disabled",
            // eventDeleteHandling: "Disabled",
           // onEventClick: this.onEventClick
        };
    }

    render() {
        return (
            <div style={styles.wrap}>
                <div style={styles.left}>
                    <DayPilotNavigator
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
                        cellsMarkBusiness= {false}
                        businessWeekends= {true}
                        headerDateFormat= {"dddd"}
                        viewType= {"Week"}
                        businessBeginsHour= {0}
                        businessEndsHour= {24}
                        onTimeRangeSelected= {this.onTimeRangeSelected}
                        eventDeleteHandling= {"Update"}
                        allowEventOverlap= {false}
                        durationBarVisible= {false}
                        ref={this.calendarRef}
                    />
                </div>
            </div>
        );
    }

    /**
     * 
     * @param args 
     * @returns si c'est mauvais
     */
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

    /**
     * 
     * @param colorInRGB = à une string en non rgb
     * @returns une string qui est la valeur rgb de la couleur choisie
     */
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
                start: "2023-03-07T10:30:00",
                end: "2023-03-07T13:00:00"
            },
            {
                id: 2,
                start: "2023-03-08T09:30:00",
                end: "2023-03-08T11:30:00",
                backColor: "#6aa84f"
            },
            {
                id: 3,
                start: "2023-03-08T12:00:00",
                end: "2023-03-08T15:00:00",
                backColor: "#f1c232"
            },
            {
                id: 4,
                start: "2023-03-06T11:30:00",
                end: "2023-03-06T14:30:00",
                backColor: "#cc4125"
            },
            {
                id: 5,
                start: "2023-03-11T11:30:00",
                end: "2023-03-12T14:30:00",
                backColor: "#eeaabb"
            },
        ];

        const startDate = "2023-03-07";

        this.calendar.update({ startDate, events });
        this.datePicker.update({ events: events });

    }

    onTimeRangeSelected = (args: any) => {
        let event = this.calendar.events.list;
        console.log("les events",event)
        const eventToAdd = 
            {
                start: args.start,
                end: args.end
            };

          event.push(eventToAdd);
          console.log("event après", event) ;
        //this.calendar.events.add(eventToAdd)
        this.datePicker.update({events: event});
        this.calendar.update();
        console.log("yo, tu es call");
        this.changeColorToGray(args);
    }

    changeColorToGray = (args: any) => {

    }
}

    
