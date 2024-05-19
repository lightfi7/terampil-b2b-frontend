import CreatableSelect from 'react-select/creatable';
import Select, { SingleValue } from 'react-select';
import { CSSProperties } from "react";
import { OptionData, XFormItem, XFormItemDropdown } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputSelectProps extends XFormItemDropdown {
  unstyled?: boolean
}

export function XInputSelect(props: XInputSelectProps) {
  const list_option = props.options ?? [];
  const SelectDOM = props.createable ? CreatableSelect : Select;
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      style={props.containerStyle}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <SelectDOM 
        isClearable 
        options={list_option}
        placeholder={props.placeholder}
        formatCreateLabel={(s: string) => `Tambah "${s}"`}
        value={props.value !== null ? (props.options ?? []).find((option: OptionData) => option.value == props.value) : null}
        onChange={(x: SingleValue<OptionData>) => props.onChange && props.onChange(x?.value)}
        styles={{
          control: (provided, state) => ({
            ...provided,
            fontSize: '.85em',
            paddingLeft: '8px',
            border: 'solid 1.8px #C7C9D966'
          }),
          option: (provided, state) => ({
            ...provided,
            fontSize: '.85em'
          }),
          placeholder: (provided, state) => ({
            ...provided,
            color: '#718096CC'
          })
        }} />
      {/* <Select
        name="colors"
        options={list_option}
        useBasicStyles
        variant={props.unstyled ? 'unstyled' : undefined}
      /> */}
    </XFormLabel>
  );
}
