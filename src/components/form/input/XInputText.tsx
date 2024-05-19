import { Input } from "@chakra-ui/react";
import { XFormItem, XFormItemText } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputTextProps extends XFormItemText {}

export function XInputText(props: XInputTextProps) {
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      style={props.containerStyle}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <Input 
        disabled={props.disabled}
        border={'solid 1.8px #C7C9D9'}
        type={'text'}
        value={props.value}
        fontSize={'.8em'}
        p={'12px 18px'}
        _placeholder={{
          color: 'gray.400'
        }}
        onKeyDown={props.onKeyDown}
        onChange={e => props.onChange && props.onChange(e.target.value)}
        placeholder={props.placeholder}
        style={props.style} />
    </XFormLabel>
  );
}
