import { Flex, Image, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import moment from "moment";
import { CSSProperties, useEffect, useRef, useState } from "react";
import CalendarView, { CalendarType } from "./calendar-view/CalendarView";

export interface ComplexDateType {
  type: CalendarType
  date: Date
  date2?: Date
}

interface PickerFloatingWrapperProps {
  value: ComplexDateType
  setValue(value: ComplexDateType): void
  useTop: boolean
}

function PickerFloatingWrapper(props: PickerFloatingWrapperProps) {
  const [type, setType] = useState<CalendarType>(props.value.type);

  function onDateChange(date: Date, date2: Date) {
    props.setValue({
      type,
      date,
      date2
    });
  }
  
  return (
    <Flex style={{
      top: !props.useTop ? '100%' : '',
      bottom: props.useTop ? '100%' : '',
      border: '1px solid #626262',
      position: 'absolute',
      left: '0px',
      zIndex: '999',
      boxSizing: 'border-box',
      borderRadius: '4px',
      overflow: 'auto',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, .5)'
    }}>
      <CalendarView
        type={type}
        date={props.value.date}
        date2={props.value.date2}
        setType={setType}
        onDateChange={onDateChange} />
    </Flex>
  );
}

interface ComplexDatePickerProps {
  placeholder?: string
  containerStyle?: CSSProperties
  value: ComplexDateType
  setValue(value: ComplexDateType): void
}

export default function ComplexDatePicker(props: ComplexDatePickerProps) {
  const [active, setActive] = useState<{ show: boolean, use_top: boolean }>({ show: false, use_top: false });
  const root_ref = useRef(null);

  function openOptions(e: any) {
    e.stopPropagation();
    const x = (root_ref.current as any)?.getBoundingClientRect();
    setActive({
      show: !active.show,
      use_top: x.top > window.innerHeight / 2
    });
  }

  function getStringValue(): string {
    let prefix: string;
    switch (props.value.type) {
      case CalendarType.DAY:
        return `Per Hari: ${moment(props.value.date).format('D MMMM YYYY')}`;
      case CalendarType.WEEK:
        prefix = 'Per Minggu: ';
        break;
      case CalendarType.MONTH:
        prefix = 'Per Bulan: ';
        break;
      case CalendarType.YEAR:
        prefix = 'Per Tahun: ';
        break;
      case CalendarType.CUSTOM:
        prefix = 'Custom: ';
        break;
    }

    return `${prefix}${moment(props.value.date).format('D MMM YYYY')} - ${moment(props.value.date2).format('D MMM YYYY')}`;
  }

  function handleActive() {
    setActive({
      ...active,
      show: false
    });
  }

  useEffect(() => {
    window.addEventListener('click', handleActive);
    return () => {
      window.removeEventListener('click', handleActive);
    };
  }, [active]);

  return (
    <div 
      style={{ position: 'relative', display: 'flex', flex: 1 }}
      ref={root_ref}
      onClick={e => e.stopPropagation()}>
      <InputGroup>
        <InputLeftElement
          pointerEvents='none'
          children={<Image 
            src={'/icons/light/icon-calendar.png'}
            w={'15px'}
            h={'15px'}
            objectFit={'contain'} />
          }
        />
        <Input 
          placeholder={props.placeholder} 
          fontSize={'.8em'}
          style={props.containerStyle} 
          readOnly
          value={getStringValue()}
          onClick={openOptions} /> 
      </InputGroup>
      { active.show && <PickerFloatingWrapper 
        useTop={active.use_top}
        value={props.value}
        setValue={(date: ComplexDateType) => {
          setActive({ ...active, show: false });
          props.setValue(date);
        }} /> }
    </div>
  );
}
