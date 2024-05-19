import { Flex, Image, Link, Text } from "@chakra-ui/react";

export interface DetailNavigationProps {
  onBack?(): void
  title?: string
}

export function DetailNavigation(props: DetailNavigationProps) {
  return (
    <Flex
      align={'center'}
      gap={'12px'}>
      <Link onClick={props.onBack}>
        <Image 
          src={'/icons/light/icon-arrow-left.png'}
          w={'22px'}
          h={'22px'} />
      </Link>
      <Text 
        fontWeight={700}
        color={'brand'}>
        { props.title }
      </Text>
    </Flex>
  );
}