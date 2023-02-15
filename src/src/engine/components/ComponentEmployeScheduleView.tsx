import React from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { Shift, ShiftForCalendar } from '../types/Shift';

type Props = { listOfShifts: Shift[] }

export class ComponentEmployeScheduleView extends React.Component<Props> {
  calendarRef: React.RefObject<any>;
  datePickerRef: React.RefObject<any>;
  listOfShifts: Shift[] = [];
  constructor(props: Props) {
    super(props);
    this.listOfShifts = this.props.listOfShifts;
    this.datePickerRef = React.createRef();
    this.calendarRef = React.createRef();
    this.state = {
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled", 
      eventResizeHandling: "Disabled", //changer la grosseur de l'event
      eventMoveHandling: "Disabled", //pouvoir le bouger
      eventDeleteHandling: "Disabled", // pouvoir le delete
    };
  }

  get calendar() {
    return this.calendarRef.current.control;
  }

  get datePicker() {
    return this.datePickerRef.current.control;
  }


  componentDidMount(): void {
    let events: ShiftForCalendar[] = [];
    let startDate = DayPilot.Date.today();

    for (let index = 0; index < this.props.listOfShifts.length; index++) {
      events.push({
        start: this.props.listOfShifts[index].start,
        end: this.props.listOfShifts[index].end,
      });
    }  
    this.calendar.update({ events, startDate});

    this.datePicker.update({ events, startDate});
  }

  render() {
    return (
      <div className='flex_Hundred'>
        <div className='left'>
          <DayPilotNavigator
            selectMode={"week"}
            showMonths={3} // le nombre de calendrier
            skipMonths={3} // change 3 mois plus tard quand cliqué
            startDate={"2023-03-07"} // date de base
            selectionDay={"2023-03-07"} // date de base
            onTimeRangeSelected={args => {
              this.calendar.update({
                startDate: args.day
              });
            }}
            ref={this.datePickerRef}
          />
        </div>
        <div className='main'>
          <DayPilotCalendar
            {...this.state}
            cellsMarkBusiness={false}
            businessWeekends={true} // travail possible la fin de semaine
            headerDateFormat={"dddd"} // pour voir les jours de la semaine
            viewType={"Week"} // 7 jours
            durationBarVisible={false} // la barre à gauche 
            timeRangeSelectedHandling={"Disabled"} // la sélection des heures 
            ref={this.calendarRef}
          />
        </div>
      </div>
    );
  }
}
