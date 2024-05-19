import { Box, Button, Checkbox, Flex, Input } from "@chakra-ui/react";
import { XFormItem, XFormItemMultiValue } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputMultiValueProps extends XFormItemMultiValue {}

export function XInputMultiValue(props: XInputMultiValueProps) {
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <Flex 
        gap={'8px'}
        direction={'column'}>
        { props.renderHeader && props.renderHeader() }
        {
          (props.values ?? []).map((value: any, i: number) => (
            <Box key={i}>
              { props.renderRow(value, i) }
            </Box>
          ))
        }
        { props.onAddButtonClick && <Button onClick={props.onAddButtonClick}>
          { props.labelAddButton ?? 'Tambah Item +' }
        </Button> }
      </Flex>
    </XFormLabel>
  );
}
