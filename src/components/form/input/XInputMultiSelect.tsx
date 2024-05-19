import CreatableSelect from 'react-select/creatable';
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { CSSProperties } from "react";
import { OptionData, XFormItem, XFormItemDropdown, XFormItemMultiDropdown } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputMultiSelectProps extends XFormItemMultiDropdown {
  unstyled?: boolean
}

export function XInputMultiSelect(props: XInputMultiSelectProps) {
  const list_option = props.options ?? [];

  function onChange(x: MultiValue<OptionData | undefined>, action: ActionMeta<OptionData | undefined>) {
    props.onChange && props.onChange(x.map(y => y?.value));
  }

  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      style={props.containerStyle}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <CreatableSelect 
        isClearable 
        isMulti
        options={list_option}
        placeholder={props.placeholder}
        formatCreateLabel={(s: string) => `Tambah "${s}"`}
        value={props.values ? props.values.map((value: number | string | boolean) => (props.options ?? []).find((o: OptionData) => o.value == value)) : null}
        onChange={onChange}
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
