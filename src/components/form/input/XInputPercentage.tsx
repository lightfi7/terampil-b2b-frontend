import { Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { InputNumber } from "../../input-number";
import { XFormItem, XFormItemCurrency, XFormItemNumber, XFormItemPercentage } from "../interface";
import { XFormLabel } from "../XFormLabel";
import { transformFromCurrency, transformToCurrency } from "./input-transformer/currency.transformer";
import { transformFromPercentage, transformToPercentage } from "./input-transformer/percentage.transformer";

interface XInputPercentageProps extends XFormItemPercentage {}

export function XInputPercentage(props: XInputPercentageProps) {
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      style={props.containerStyle}
      labelWidth={props.labelWidth}>
      <Input 
        disabled={props.disabled}
        value={transformToPercentage(props.value as any)}
        min={props.min}
        max={props.max}
        onChange={(value: any) => props.onChange && props.onChange(transformFromPercentage(value))}
        placeholder={props.placeholder}
        onKeyDown={props.onKeyDown} />
    </XFormLabel>
  );
}
