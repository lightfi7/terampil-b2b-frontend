import moment from "moment";
import { useState } from "react";
import HeaderPicker from "./HeaderPicker";
import { Calendar, CalendarContainer, TMonth, Triwulan, Year } from "./styled";

interface CalendarTenYearsViewProps {
  selectedYear: Date
  onYearChange(date: Date, date2: Date): void
  noBorderLeft?: boolean
}

export default function CalendarTenYearsView(props: CalendarTenYearsViewProps) {
  const [tanggal_kalender, setTanggalKalender] = useState<moment.Moment>(moment(props.selectedYear));
  const tahun_sekarang = parseInt(tanggal_kalender.format('YYYY'));
  const tahun_sekarang_absolute = parseInt(moment().format('YYYY'));
  const start_tahun_per_sepuluh = tahun_sekarang - tahun_sekarang % 10;

  return (
    <CalendarContainer>
      <Calendar style={{ borderLeft: props.noBorderLeft ? 'none' : undefined }}>
        <HeaderPicker
          onPrev={() => setTanggalKalender(moment(tanggal_kalender).subtract(10, 'years'))}
          onNext={() => setTanggalKalender(moment(tanggal_kalender).add(10, 'years'))}
          value={`${start_tahun_per_sepuluh} - ${start_tahun_per_sepuluh + 10}`} />
        <Year>
          {
            [
              [start_tahun_per_sepuluh, start_tahun_per_sepuluh + 1, start_tahun_per_sepuluh + 2], 
              [start_tahun_per_sepuluh + 3, start_tahun_per_sepuluh + 4, start_tahun_per_sepuluh + 5], 
              [start_tahun_per_sepuluh + 6, start_tahun_per_sepuluh + 7, start_tahun_per_sepuluh + 8],
              [start_tahun_per_sepuluh + 9, start_tahun_per_sepuluh + 10, start_tahun_per_sepuluh + 11]
            ].map((years: number[], i: number) => (
              <Triwulan key={i}>
                {
                  years.map((year: number, j: number) => (
                    <TMonth 
                      style={{
                        opacity: tahun_sekarang_absolute < year ? 0 : 1,
                        cursor: tahun_sekarang_absolute < year ? 'default' : '',
                      }}
                      onClick={() => {
                        if (tahun_sekarang_absolute < year) {
                          return;
                        }
                        const first_day_in_year = moment(`${year}-1-1`, 'YYYY-M-D').startOf('month').toDate();
                        const last_day_in_year = moment(first_day_in_year).endOf('year').toDate();
                        props.onYearChange(first_day_in_year, last_day_in_year);
                      }}
                      key={j}>
                      { year }
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
