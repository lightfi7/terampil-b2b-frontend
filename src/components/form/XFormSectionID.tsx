import { Box, Text } from "@chakra-ui/react";

interface XFormSectionIDProps {
  label?: string
  children?: any
}

export function XFormSectionID(props: XFormSectionIDProps) {
  return (
    <Box>
      <Text
        fontWeight={700}>
        { props.label ?? 'ID' }
      </Text>
      <Box 
        borderBottom={'solid 1px #DDD'}
        pb={'8px'}
        mb={'8px'} />
      <Text
        mb={'24px'}
        fontSize={'1.2em'}>
        { props.children }
      </Text>
    </Box>
  );
}