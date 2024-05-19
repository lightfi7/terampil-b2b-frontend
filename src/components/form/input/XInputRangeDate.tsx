import { Box, Flex, Input } from "@chakra-ui/react";
import moment from "moment";
import { XFormItem, XFormItemDate, XFormItemRangeDate } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputRangeDateProps extends XFormItemRangeDate {}

export function XInputRangeDate(props: XInputRangeDateProps) {
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      style={props.containerStyle}
      labelWidth={props.labelWidth}>
      <Flex
        gap={'12px'}
        align={'center'}>
        <Input 
          type={'date'}
          disabled={props.disabled}
          onKeyDown={props.onKeyDown}
          border={'solid 1.8px #C7C9D9'}
          p={'12px 18px'}
          fontSize={'.9em'}
          value={moment(props.start).format('YYYY-MM-DD')}
          onChange={e => props.onRangeChange && props.onRangeChange(moment(e.target.value, 'YYYY-MM-DD').toDate(), props.end)}
          placeholder={props.placeholder} />
        <Box
          w={'50px'}
          h={'1px'}
          bg={'#C4C4C4'} />
        <Input 
          type={'date'}
          disabled={props.disabled}
          onKeyDown={props.onKeyDown}
          border={'solid 1.8px #C7C9D9'}
          p={'12px 18px'}
          fontSize={'.9em'}
          value={moment(props.end).format('YYYY-MM-DD')}
          onChange={e => props.onRangeChange && props.onRangeChange(props.start, moment(e.target.value, 'YYYY-MM-DD').toDate())}
          placeholder={props.placeholder2} />
      </Flex>
    </XFormLabel>
  );
}
