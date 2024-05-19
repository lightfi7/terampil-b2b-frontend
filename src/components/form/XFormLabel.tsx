import { Box, Flex, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";

interface XFormLabelProps {
  label?: string
  prefix?: string
  required?: boolean
  style?: CSSProperties
  columnMode?: boolean
  labelWidth?: string | number
  children: any
}

export function XFormLabel(props: XFormLabelProps) {
  return (
    <Flex 
      direction={props.columnMode ? 'column' : 'row'} 
      style={props.style}
      gap={'4px'}
      p={props.columnMode ? 0 : '0 36px'}>
      { props.label && <Text 
        w={props.columnMode ? 'auto' : (props.labelWidth ?? '15%')}
        mt={'9px'}
        fontWeight={400}
        pr={'1.5%'}
        color={'text'}
        fontSize={'.9em'}>
        { props.label }{ props.required && <span style={{ color: 'red' }}>*</span> }
      </Text> }
      <Flex 
        flex={1}
        align={'center'}
        gap={'12px'}>
        { props.prefix && <Text fontWeight={600}>
          { props.prefix }
        </Text> }
        <Flex 
          flex={1}
          position={'relative'}
          direction={'column'}>
          { props.children }
        </Flex>
      </Flex>
    </Flex>
  );
}
