import styled from "styled-components";


// Calendar View
export const CalendarViewContainer = styled.div`
  height: 300px;
  display: flex;
  background: #FFF;
`;
export const SectionLeft = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 0px;
`;
export const ContainerLeftTop = styled.div``;
export const ItemCalendarType = styled.div`
  display: flex;
  font-size: .9em;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  cursor: pointer;
`;
export const IconRight = styled.img`
  height: 14px;
  width: 14px;
  object-fit: contain;
  margin-left: 9px;
`;



// Calendar Year View & Ten Years View
export const Year = styled.div`
  color: white;
  padding: 5px 15px;
  padding-bottom: 18px;
`;
export const Triwulan = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`;
export const TMonth = styled.div`
  width: 75px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  cursor: pointer;

  &:hover {
    background: #C4C4C422;
  }
`;


// Calendar Month View
export const Day = styled.div`
  width: 32px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  cursor: pointer;

  &:hover {
    background: #C4C4C422;
  }
`;

export const DayName = styled.div`
  width: 32px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

export const WeekNames = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Week = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 6px;
`;

export const Month = styled.div`
  color: white;
  padding: 10px 14px;
  padding-bottom: 18px;
`;

export const Calendar = styled.div`
  display: flex;
  flex-direction: column;
  border-left: solid 1px #303030;
`;



// Header Picker
export const MonthPickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 1px #303030;
  padding: 10px 8px;
`;

export const MonthArrow = styled.img`
  width: 17px;
  height: 17px;
  object-fit: contain;
  cursor: pointer;
`;

export const CalendarContainer = styled.div`
  display: flex;
  font-size: .9em;
`;
