import { colors } from "@/pages/_app";
import moment from "moment";
import { useEffect, useState } from "react";
import HeaderPicker from "./HeaderPicker";
import { Day, Month, Week, WeekNames, DayName, Calendar, MonthPickerContainer, MonthArrow, CalendarContainer } from "./styled";

const WEEKS: string[] = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

interface DayRenderItem {
  date: Date
  is_active_month: boolean
}

export interface RangeDate {
  start: Date | null | undefined
  end: Date | null | undefined
}

interface CalendarMonthViewProps {
  selectedDate?: Date
  selectedRange?: RangeDate
  onChangeDate?(date: Date): void
  onChangeRange?(range: RangeDate): void
  rangeMode?: boolean
  weekPickerMode?: boolean
  noBorderLeft?: boolean
}

export default function CalendarMonthView(props: CalendarMonthViewProps) {
  const [tanggal_kalender, setTaggalKalender] = useState<moment.Moment>(moment(props.selectedDate ?? (props.selectedRange ? props.selectedRange.start : new Date())));
  const [range, setRange] = useState<RangeDate>(props.selectedRange ?? { start: null, end: null });
  const [hover_date, setHoverDate] = useState<RangeDate | null>(null);

  function chunkArrayIntoGroups(arr: DayRenderItem[], size: number) {
    var _arr = [];
    for(var i = 0; i < arr.length; i += size) {
      _arr.push(arr.slice(i, i+size));
    }
    return _arr;
  }

  function iterasiTanggalKalenderBulanAktif(tahun: number, bulan: number): DayRenderItem[][] {
    const format_tanggal = 'YYYY-M-DD';
    const tanggal_satu = `${tahun}-${bulan}-01`;
    const hari_ini = moment(tanggal_satu, format_tanggal);
    const bulan_lalu = moment(tanggal_satu, format_tanggal).subtract(1, 'month');
    const bulan_berikutnya = moment(tanggal_satu, format_tanggal).add(1, 'month');

    const start_day_of_the_month_index = hari_ini.startOf('month').day(); // 0 = minggu, 1, 2, 3, 4, 5, 6 = sabtu
    const total_hari_bulan_ini = hari_ini.daysInMonth(); // 28, 29, 30, 31
    const total_hari_bulan_lalu = bulan_lalu.daysInMonth(); // 28, 29, 30, 31

    const tahun_bulan_lalu = parseInt(bulan_lalu.format('YYYY'));
    const bulan_bulan_lalu = parseInt(bulan_lalu.format('M'));

    const tahun_bulan_berikutnya = parseInt(bulan_berikutnya.format('YYYY'));
    const bulan_bulan_berikutnya = parseInt(bulan_berikutnya.format('M'));

    let daftar_hari: DayRenderItem[] = [];

    for (let i = start_day_of_the_month_index; i > 0 ; i--) {
      daftar_hari.push({
        date: new Date(tahun_bulan_lalu, bulan_bulan_lalu - 1, total_hari_bulan_lalu - i + 1),
        is_active_month: false
      });
    }

    for (let i = 0; i < total_hari_bulan_ini; i++) {
      daftar_hari.push({
        date: new Date(tahun, bulan - 1, i + 1),
        is_active_month: true
      });
    }

    const sisa_hari = (daftar_hari.length % 7 !== 0 ? (7 - (daftar_hari.length % 7)) : 0) + 7 * (7 - Math.ceil(daftar_hari.length / 7) - 1);
    for (let i = 0; i < sisa_hari; i++) {
      daftar_hari.push({
        date: new Date(tahun_bulan_berikutnya, bulan_bulan_berikutnya - 1, i + 1),
        is_active_month: false
      });
    }

    return chunkArrayIntoGroups(daftar_hari, 7);
  }

  function onDateSingleClick(date: Date) {
    (props.onChangeDate ?? (() => {}))(date);
    return;
  }

  function onDateRangeClick(date: Date) {
    if (hover_date === null) {
      setHoverDate({
        start: date,
        end: date
      });
    } else {
      const selected_range: RangeDate = {
        start: hover_date.start,
        end: date
      };
      (props.onChangeRange ?? (() => {}))(selected_range);
      setRange(selected_range);
      setHoverDate(null);
    }
  }

  function onDateClick(date: Date) {
    if (props.rangeMode) {
      onDateRangeClick(date);
      return;
    }

    onDateSingleClick(date);
  }

  function onWeekClick(dates: Date[]) {
    if (!props.weekPickerMode) {
      return;
    }
    
    (props.onChangeRange ?? (() => {}))({
      start: dates[0],
      end: dates[dates.length - 1]
    });
    setRange({
      start: dates[0],
      end: dates[dates.length - 1]
    });
    setHoverDate(null);
  }

  function onHoverDate(date: Date) {
    if (!props.rangeMode || props.weekPickerMode) {
      return;
    }

    if (hover_date === null) {
      return;
    }

    setHoverDate({ ...hover_date, end: date});
  }

  function onHoverWeek(dates: Date[]) {
    if (!props.weekPickerMode) {
      return;
    }

    setHoverDate({
      start: dates[0],
      end: dates[dates.length - 1]
    });
  }

  const range_start_or_hover = hover_date !== null ? hover_date.start : range.start;
  const range_end_or_hover = hover_date !== null ? hover_date.end : range.end;
  const min_date = (range_start_or_hover && range_end_or_hover && (range_start_or_hover.getTime() > range_end_or_hover.getTime())) ? range_end_or_hover : range_start_or_hover;
  const max_date = (range_start_or_hover && range_end_or_hover && (range_start_or_hover.getTime() < range_end_or_hover.getTime())) ? range_end_or_hover : range_start_or_hover;

  return (
    <CalendarContainer>
      <Calendar>
        <HeaderPicker
          onPrev={() => setTaggalKalender(moment(tanggal_kalender).subtract(1, 'months'))}
          onNext={() => setTaggalKalender(moment(tanggal_kalender).add(1, 'months'))}
          value={`${tanggal_kalender.format('MMM')} ${tanggal_kalender.format('YYYY')}`} />
        <Month>
          <WeekNames>
            {
              WEEKS.map((label: string, i: number) => (
                <DayName key={i}>
                  { label }
                </DayName>
              ))
            }
          </WeekNames>
          {
            iterasiTanggalKalenderBulanAktif(parseInt(tanggal_kalender.format('YYYY')), parseInt(tanggal_kalender.format('M'))).map((week_days: DayRenderItem[], i: number) => (
              <Week 
                onMouseEnter={() => onHoverWeek(week_days.map(dr => dr.date))}
                onClick={() => onWeekClick(week_days.map(dr => dr.date))}
                key={i}>
                {
                  week_days.map((day: DayRenderItem, j: number) => {
                    const is_in_range = range_start_or_hover && range_end_or_hover && moment(day.date).isBetween(min_date, max_date, 'days', '[]');
                    const is_selected = props.selectedDate && moment(props.selectedDate).isSame(day.date, 'date');

                    const in_range_or_selected = is_in_range || is_selected;
                    return (
                      <Day 
                        onMouseEnter={() => onHoverDate(day.date)}
                        onClick={() => onDateClick(day.date)}
                        style={{
                          color: !day.is_active_month 
                            ?  '#888'
                            : (in_range_or_selected ? colors.brand : ''),
                          backgroundColor: in_range_or_selected ? `${colors.brand}22` : ''
                        }} 
                        key={j}>
                        { day.date.getDate() }
                      </Day>
                    )
                  })
                }
              </Week>
            ))
          }
        </Month>
      </Calendar>
    </CalendarContainer>
  );
}
