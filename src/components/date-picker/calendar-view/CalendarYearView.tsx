import moment from "moment";
import { useState } from "react";
import HeaderPicker from "./HeaderPicker";
import { Calendar, CalendarContainer, TMonth, Triwulan, Year } from "./styled";

interface CalendarYearViewProps {
  selectedMonthYear: Date
  onMonthYearChange(date: Date, date2: Date): void
}

export default function CalendarYearView(props: CalendarYearViewProps) {
  const [tanggal_kalender, setTaggalKalender] = useState<moment.Moment>(moment(props.selectedMonthYear));

  function chunkArrayIntoGroups(arr: string[], size: number) {
    var _arr = [];
    for(var i = 0; i < arr.length; i += size) {
      _arr.push(arr.slice(i, i+size));
    }
    return _arr;
  }

  function getMonthNames(): string[][] {
    return chunkArrayIntoGroups(moment.monthsShort(), 3);
  }

  return (
    <CalendarContainer>
      <Calendar>
        <HeaderPicker
          onPrev={() => setTaggalKalender(moment(tanggal_kalender).subtract(1, 'years'))}
          onNext={() => setTaggalKalender(moment(tanggal_kalender).add(1, 'years'))}
          value={tanggal_kalender.format('YYYY')} />
        <Year>
          {
            getMonthNames().map((months: string[], i: number) => (
              <Triwulan key={i}>
                {
                  months.map((month: string, j: number) => (
                    <TMonth 
                      onClick={() => {
                        const first_day_in_month = moment(`${tanggal_kalender.format('YYYY')}-${3 * i + j + 1}-1`, 'YYYY-M-D').startOf('month').toDate();
                        const last_day_in_month = moment(first_day_in_month).endOf('month').toDate();
                        console.log(first_day_in_month, last_day_in_month);
                        props.onMonthYearChange(first_day_in_month, last_day_in_month);
                      }}
                      key={j}>
                      { month }
                    </TMonth>
                  ))
                }
              </Triwulan>
            ))
          }
        </Year>
      </Calendar>
    </CalendarContainer>
  );
}
