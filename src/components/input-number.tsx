import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { CSSProperties } from "react";

interface InputNumberProps {
  value?: number | string
  onChange?(_: number | string): void
  onKeyDown?(e: any): void
  currency?: boolean
  disabled?: boolean
  placeholder?: string
  max?: number
  min?: number
  w?: string | number
  h?: string | number
  flex?: number
  style?: CSSProperties
  formatter?: Intl.NumberFormat
}

export const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
});

export const numberFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 2
});

export const numberFormatter0 = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0
});

export function InputNumber(props: InputNumberProps) {
  return (
    <NumberInput
      w={props.w}
      h={props.h}
      flex={props.flex}
      value={props.value ?? ''}
      max={props.max}
      min={props.min}
      onChange={value => props.onChange && props.onChange(value)}
      style={props.style}
    >
      <NumberInputField 
        onKeyDown={props.onKeyDown}
        fontSize={'.85em !important'}
        disabled={props.disabled} 
        max={props.max}
        min={props.min}
        placeholder={props.placeholder} />
      { !props.disabled && <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper> }
    </NumberInput>
  );
}