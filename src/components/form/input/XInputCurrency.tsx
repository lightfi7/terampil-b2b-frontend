import { Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { InputNumber } from "../../input-number";
import { XFormItem, XFormItemCurrency, XFormItemNumber } from "../interface";
import { XFormLabel } from "../XFormLabel";
import { transformFromCurrency, transformToCurrency } from "./input-transformer/currency.transformer";

interface XInputCurrencyProps extends XFormItemCurrency {}

export function XInputCurrency(props: XInputCurrencyProps) {
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
        value={transformToCurrency(props.value as any)}
        currency={props.currency}
        formatter={props.formatter}
        min={props.min}
        max={props.max}
        onChange={(value: any) => props.onChange && props.onChange(transformFromCurrency(value))}
        placeholder={props.placeholder}
        onKeyDown={props.onKeyDown} />
    </XFormLabel>
  );
}
