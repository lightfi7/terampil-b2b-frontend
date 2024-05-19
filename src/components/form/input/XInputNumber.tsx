import { Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { InputNumber } from "../../input-number";
import { XFormItem, XFormItemNumber } from "../interface";
import { XFormLabel } from "../XFormLabel";
import { transformFromNumber, transformToNumber } from "./input-transformer/number.transformer";

interface XInputNumberProps extends XFormItemNumber {}

export function XInputNumber(props: XInputNumberProps) {
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      style={props.containerStyle}
      labelWidth={props.labelWidth}>
      <InputNumber 
        disabled={props.disabled}
        value={transformToNumber(props.value as any)}
        currency={props.currency}
        formatter={props.formatter}
        min={props.min}
        max={props.max}
        onChange={(value: any) => props.onChange && props.onChange(transformFromNumber(value))}
        placeholder={props.placeholder}
        onKeyDown={props.onKeyDown} />
    </XFormLabel>
  );
}
