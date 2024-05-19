import { Text } from "@chakra-ui/react";
import { MonthArrow, MonthPickerContainer } from "./styled";

interface HeaderPickerProps {
  onNext?(): void
  onPrev?(): void
  value: string
}

export default function HeaderPicker(props: HeaderPickerProps) {
  return (
    <MonthPickerContainer>
      <MonthArrow 
        onClick={props.onPrev}
        src={'/icons/light/icon-arrow-left-grey.png'} />
      <Text color={'#222'}>
        { props.value }
      </Text>
      <MonthArrow 
        onClick={props.onNext}
        src={'/icons/light/icon-arrow-right-grey.png'} />
    </MonthPickerContainer>
  )
}