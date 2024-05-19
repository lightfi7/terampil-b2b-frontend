import { colors } from "@/pages/_app";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CalendarMonthView, { RangeDate } from "./CalendarMonthView";
import CalendarTenYearsView from "./CalendarTenYearsView";
import CalendarYearView from "./CalendarYearView";
import { CalendarViewContainer, ContainerLeftTop, IconRight, ItemCalendarType, SectionLeft } from "./styled";

export enum CalendarType {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  CUSTOM = 'CUSTOM'
}

interface CalendarViewProps {
  date: Date
  date2?: Date
  type: CalendarType
  setType(type: CalendarType): void
  onDateChange(date: Date | null | undefined, date2?: Date | null | undefined): void
}

export default function CalendarView(props: CalendarViewProps) {
  const [blink, setBlink] = useState<boolean>(true);

  function getCalendar(type: CalendarType) {
    switch (type) {
      case CalendarType.DAY:
        return <CalendarMonthView 
          selectedDate={props.date}
          onChangeDate={props.onDateChange} />
      case CalendarType.WEEK:
        return <CalendarMonthView 
          selectedRange={{ start: props.date, end: props.date2 }}
          onChangeRange={(range: RangeDate) => props.onDateChange(range.start, range.end)}
          weekPickerMode />
      case CalendarType.MONTH:
        return <CalendarYearView
          selectedMonthYear={props.date}
          onMonthYearChange={props.onDateChange} />
      case CalendarType.YEAR:
        return <CalendarTenYearsView
          selectedYear={props.date}
          onYearChange={props.onDateChange} />
      default:
        return <CalendarMonthView 
          selectedRange={{ start: props.date, end: props.date2 }}
          onChangeRange={(range: RangeDate) => props.onDateChange(range.start, range.end)}
          rangeMode />
    }
  }

  useEffect(() => {
    setBlink(true);
  }, [props.type]);

  return (
    <CalendarViewContainer>
      <SectionLeft>
        <ContainerLeftTop>
          <ItemCalendarType onClick={() => {
            if (props.type === CalendarType.DAY) return;
            setBlink(false);
            props.setType(CalendarType.DAY);
          }}>
            <Text
              style={{ color: props.type === CalendarType.DAY ? colors.brand : '', whiteSpace: 'nowrap' }}>
              Per Hari
            </Text>
            <IconRight src={'/icons/light/icon-arrow-right-grey.png'} />
          </ItemCalendarType>
          <ItemCalendarType onClick={() => {
            if (props.type === CalendarType.WEEK) return;
            setBlink(false);
            props.setType(CalendarType.WEEK);
          }}>
            <Text 
              style={{ color: props.type === CalendarType.WEEK ? colors.brand : '', whiteSpace: 'nowrap' }}>
              Per Minggu
            </Text>
            <IconRight src={'/icons/light/icon-arrow-right-grey.png'} />
          </ItemCalendarType>
          <ItemCalendarType onClick={() => {
            if (props.type === CalendarType.MONTH) return;
            setBlink(false);
            props.setType(CalendarType.MONTH);
          }}>
            <Text 
              style={{ color: props.type === CalendarType.MONTH ? colors.brand : '', whiteSpace: 'nowrap' }}>
              Per Bulan
            </Text>
            <IconRight src={'/icons/light/icon-arrow-right-grey.png'} />
          </ItemCalendarType>
          <ItemCalendarType onClick={() => {
            if (props.type === CalendarType.YEAR) return;
            setBlink(false);
            props.setType(CalendarType.YEAR);
          }}>
            <Text 
              style={{ color: props.type === CalendarType.YEAR ? colors.brand : '', whiteSpace: 'nowrap' }}>
              Per Tahun
            </Text>
            <IconRight src={'/icons/light/icon-arrow-right-grey.png'} />
          </ItemCalendarType>
        </ContainerLeftTop>
        <ItemCalendarType onClick={() => {
          if (props.type === CalendarType.CUSTOM) return;
          setBlink(false);
          props.setType(CalendarType.CUSTOM);
        }}>
          <Text 
            style={{ color: props.type === CalendarType.CUSTOM ? colors.brand : '', whiteSpace: 'nowrap' }}>
            Custom
          </Text>
          <IconRight src={'/icons/light/icon-arrow-right-grey.png'} />
        </ItemCalendarType>
      </SectionLeft>
      { blink && getCalendar(props.type) }
    </CalendarViewContainer>
  );
}
