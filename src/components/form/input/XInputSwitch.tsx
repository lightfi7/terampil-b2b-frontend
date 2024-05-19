import { Flex, Input, Switch } from "@chakra-ui/react";
import { XFormItem, XFormItemSwitch } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputSwitchProps extends XFormItemSwitch {}

export function XInputSwitch(props: XInputSwitchProps) {
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <Flex>
        <Switch 
          size={'md'}
          isChecked={props.value}
          onChange={(e) => props.onChange && props.onChange(e.target.checked)}
          disabled={props.disabled} />
      </Flex>
    </XFormLabel>
  );
}
