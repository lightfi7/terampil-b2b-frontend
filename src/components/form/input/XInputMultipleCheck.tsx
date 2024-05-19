import { Checkbox, Flex, Input } from "@chakra-ui/react";
import { OptionData, XFormItem, XFormItemMultipleCheck } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputMultipleCheckProps extends XFormItemMultipleCheck {}

export function XInputMultipleCheck(props: XInputMultipleCheckProps) {
  const _options = props.options ?? [];
  const _values = props.values ?? [];
  const mid = Math.ceil(_options.length/2);
  const left = _options.slice(0, mid);
  const right = _options.slice(mid);

  function check(value: any) {
    if (!props.onChange) {
      return;
    }
    props.onChange([
      ..._values.filter((o_value: any) => o_value !== value),
      value
    ]);
  }

  function uncheck(value: any) {
    if (!props.onChange) {
      return;
    }
    props.onChange(_values.filter((o_value: any) => o_value !== value));
  }

  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <Flex>
        <Flex 
          flex={1}
          direction={'column'}>
          {
            left.map((o: OptionData, i: number) => {
              const is_checked = _values.includes(o.value);
              return (
                <Checkbox 
                  isChecked={is_checked}
                  onChange={e => is_checked ? uncheck(o.value) : check(o.value)}
                  key={i}>
                  { o.label }
                </Checkbox>
              )
            })
          }
        </Flex>
        <Flex 
          flex={1}
          direction={'column'}>
          {
            right.map((o: OptionData, i: number) => {
              const is_checked = _values.includes(o.value);
              return (
                <Checkbox 
                  isChecked={is_checked}
                  onChange={e => is_checked ? uncheck(o.value) : check(o.value)}
                  key={i}>
                  { o.label }
                </Checkbox>
              )
            })
          }
        </Flex>
      </Flex>
    </XFormLabel>
  );
}
