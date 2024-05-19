import { Input } from "@chakra-ui/react";
import moment from "moment";
import { XFormItem, XFormItemDate } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputDateProps extends XFormItemDate {}

export function XInputDate(props: XInputDateProps) {
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <Input 
        type={'date'}
        disabled={props.disabled}
        onKeyDown={props.onKeyDown}
        border={'solid 1.8px #C7C9D9'}
        p={'24px 12px'}
        fontSize={'.9em'}
        value={moment(props.value).format('YYYY-MM-DD')}
        onChange={e => props.onChange && props.onChange(moment(e.target.value, 'YYYY-MM-DD').toDate())}
        placeholder={props.placeholder} />
    </XFormLabel>
  );
}
