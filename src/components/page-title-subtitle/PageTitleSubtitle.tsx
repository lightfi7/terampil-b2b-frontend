import { Flex, Text } from "@chakra-ui/react";

interface PageTitleSubtitleProps {
  title?: string
  subtitle?: any
}

export function PageTitleSubtitle(props: PageTitleSubtitleProps) {
  return (
    <Flex 
      direction={'column'}
      gap={'4px'}
      mt={'8px'}>
      <Text 
        fontWeight={600}
        fontSize={'1.1em'}>
        { props.title }
      </Text>
      <Text 
        color={'#979797'}
        fontSize={'.9em'}>
        { props.subtitle }
      </Text>
    </Flex>
  );
}
