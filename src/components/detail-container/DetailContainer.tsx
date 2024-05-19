import { Flex, Text } from "@chakra-ui/react";

export interface DetailContainerProps {
  children?: any
  title?: any
}

export function DetailContainer(props: DetailContainerProps) {
  return (
    <Flex
      direction={'column'} 
      bg={'#FFF'}
      p={'24px 24px'}
      pb={'32px'}
      gap={'8px'}
      boxShadow={'0px 1px 12px rgba(0, 0, 0, .1)'}
      borderRadius={12}>
      <Text 
        fontWeight={700}
        color={'#C4C4C4'}>
        { props.title }
      </Text>
      { props.children }
    </Flex>
  );
}
