import { Input, Textarea } from "@chakra-ui/react";
import { XFormItem, XFormItemTextarea } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputTextareaProps extends XFormItemTextarea {}

export function XInputTextarea(props: XInputTextareaProps) {
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}
      style={props.containerStyle}>
      <Textarea 
        disabled={props.disabled}
        value={props.value}
        border={'solid 1.8px #C7C9D9'}
        fontSize={'.8em'}
        p={'12px 18px'}
        onKeyDown={props.onKeyDown}
        onChange={e => props.onChange && props.onChange(e.target.value)}
        placeholder={props.placeholder} />
    </XFormLabel>
  );
}
