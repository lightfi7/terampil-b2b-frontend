import { Box, Flex } from "@chakra-ui/react";

interface WhiteBoxProps {
  children?: any
  w?: number | string
}

export function WhiteBox(props: WhiteBoxProps) {
  return (
    <Flex 
      w={props.w}
      bg={'#FFF'}
      p={'72px 56px'}
      direction={'column'}
      borderRadius={'24px'}>
      { props.children }
    </Flex>
  );
}
