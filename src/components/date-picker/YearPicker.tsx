import { Flex, Image, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import moment from "moment";
import { CSSProperties, useEffect, useRef, useState } from "react";
import CalendarMonthView from "./calendar-view/CalendarMonthView";
import CalendarTenYearsView from "./calendar-view/CalendarTenYearsView";
import CalendarYearView from "./calendar-view/CalendarYearView";

interface PickerFloatingWrapperProps {
  value: Date
  setValue(value: Date): void
  useTop: boolean
}

function PickerFloatingWrapper(props: PickerFloatingWrapperProps) {
  return (
    <Flex style={{
      top: !props.useTop ? '110%' : '',
      bottom: props.useTop ? '100%' : '',
      backgroundColor: '#FFF',
      position: 'absolute',
      left: '0px',
      zIndex: '999',
      boxSizing: 'border-box',
      borderRadius: '4px',
      overflow: 'auto',
      boxShadow: '0px 1px 18px rgba(0, 0, 0, .2)'
    }}>
      <CalendarTenYearsView
        selectedYear={props.value}
        onYearChange={props.setValue}
        noBorderLeft />
    </Flex>
  );
}

interface YearPickerProps {
  placeholder?: string
  containerStyle?: CSSProperties
  style?: CSSProperties
  value?: Date
  setValue(value: Date): void
}

export default function YearPicker(props: YearPickerProps) {
  const [active, setActive] = useState<{ show: boolean, use_top: boolean }>({ show: false, use_top: false });
  const root_ref = useRef(null);

  function openOptions() {
    const x = (root_ref.current as any)?.getBoundingClientRect();
    setActive({
      show: !active.show,
      use_top: x.top > window.innerHeight / 2
    });
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
          readOnly
          fontWeight={700}
          fontSize={'.8em'}
          value={props.value ? `Tahun ${moment(props.value).format('YYYY')}` : moment().format('YYYY').split(' ')[1]}
          onClick={openOptions}
          style={props.style} /> 
      </InputGroup>
      { active.show && <PickerFloatingWrapper 
        useTop={active.use_top}
        value={props.value ?? new Date()}
        setValue={(date: Date) => {
          setActive({ ...active, show: false });
          props.setValue(date);
        }} /> }
    </div>
  );
}
