import { Box, Text } from "@chakra-ui/react";

interface XFormSectionTitleProps {
  children?: any
  mt?: number | string
}

export function XFormSectionTitle(props: XFormSectionTitleProps) {
  return (
    <Box mt={props.mt ?? '24px'}>
      <Text
        fontWeight={600}
        fontSize={'1.3em'}>
        { props.children }
      </Text>
      <Box 
        borderBottom={'solid 1px #DDD'}
        pb={'8px'}
        mb={'12px'} />
    </Box>
  );
}