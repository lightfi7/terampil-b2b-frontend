import { Flex, Input, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { XFormItem, XFormItemFile, XFormItemText } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputFileProps extends XFormItemFile {}

export function XInputFile(props: XInputFileProps) {
  const [active_file, setActiveFile] = useState<any>();
  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <Flex
        position={'relative'}
        align={'center'}>
        <Input 
          disabled={props.disabled}
          border={'solid 1.8px #C7C9D9'}
          type={'file'}
          fontSize={'.8em'}
          p={'12px 12px'}
          h={'50px'}
          mb={'6px'}
          onChange={e => {
            if (!props.onChange) {
              return;
            }
            const files = e.target.files;
            if (!files) {
              return;
            }
            props.onChange(files[0]);
            setActiveFile(files[0]);
            e.target.value = '';
          }}
          placeholder={props.placeholder}
          style={props.style} />
        { props.loading && <Spinner 
          right={'15px'}
          mt={'0px'}  
          position={'absolute'} /> }
        { !props.loading && <Text
          position={'absolute'}
          right={'18px'}
          mt={'-6px'}
          fontSize={'.9em'}>
          { active_file?.name }
        </Text> }
      </Flex>
    </XFormLabel>
  );
}
