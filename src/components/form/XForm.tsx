import { Box, Flex, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";
import { XInputDate } from "./input/XInputDate";
import { XInputFile } from "./input/XInputFile";
import { XInputMultipleCheck } from "./input/XInputMultipleCheck";
import { XInputMultiSelect } from "./input/XInputMultiSelect";
import { XInputMultiValue } from "./input/XInputMultiValue";
import { XInputNumber } from "./input/XInputNumber";
import { XInputPassword } from "./input/XInputPassword";
import { XInputProficiencyKeyBehavior } from "./input/XInputProficiencyKeyBehavior";
import { XInputRadioTick } from "./input/XInputRadioTick";
import { XInputRangeDate } from "./input/XInputRangeDate";
import { XInputSelect } from "./input/XInputSelect";
import { XInputSelectTree } from "./input/XInputSelectTree";
import { XInputSwitch } from "./input/XInputSwitch";
import { XInputText } from "./input/XInputText";
import { XInputTextarea } from "./input/XInputTextarea";
import { XFormItem } from "./interface";
import { XInputCurrency } from "./input/XInputCurrency";
import { XInputPercentage } from "./input/XInputPercentage";

interface XFormProps {
  forms: XFormItem[]
  gap?: string | number
  columnMode?: boolean
  labelWidth?: string | number
  labelStyle?: CSSProperties
}

export function XForm(props: XFormProps) {
  return (
    <Flex 
      w={'100%'}
      direction={'column'}
      gap={props.gap ?? '24px'}>
      {
        props.forms.filter((form: XFormItem) => !form.hide).map((form: XFormItem, i: number) => {
          return (
            <Flex 
              w={'100%'} 
              key={i}>
              <Box flex={1}>
                {
                  (() => {
                    switch (form.type) {
                      case 'text': return (
                        <XInputText 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'number': return (
                        <XInputNumber 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'currency': return (
                        <XInputCurrency 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'percentage': return (
                        <XInputPercentage 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'password': return (
                        <XInputPassword 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'dropdown': return (
                        <XInputSelect 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'switch': return (
                        <XInputSwitch 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'multiple-check': return (
                        <XInputMultipleCheck 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'textarea': return (
                        <XInputTextarea 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'multivalue': return (
                        <XInputMultiValue 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'date': return (
                        <XInputDate 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'range-date': return (
                        <XInputRangeDate 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'radio-tick': return (
                        <XInputRadioTick 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'file': return (
                        <XInputFile 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'proficiency-key-behavior': return (
                        <XInputProficiencyKeyBehavior 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'multi-dropdown': return (
                        <XInputMultiSelect 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                      case 'select-tree': return (
                        <XInputSelectTree 
                          columnMode={props.columnMode}
                          labelWidth={props.labelWidth}
                          containerStyle={props.labelStyle}
                          {...form} />
                      );
                    }
                  })()
                }
              </Box>
            </Flex>
          );
        })
      }
    </Flex>
  );
}
