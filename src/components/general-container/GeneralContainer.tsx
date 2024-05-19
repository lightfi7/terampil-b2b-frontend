import { Flex, FlexProps, Text } from "@chakra-ui/react";

export interface GeneralContainerProps extends FlexProps {
  children?: any
  title?: string
  titleColor?: string
  rightItem?: any
}

export function GeneralContainer(props: GeneralContainerProps) {
  return (
    <Flex 
      w={'100%'}
      direction={'column'}>
      <Flex 
        borderRadius={'12px'}
        bg={'#FFF'}
        p={'18px'}
        direction={'column'}
        boxShadow={'0px 1px 8px rgba(0, 0, 0, .1)'}
        gap={'12px'}
        {...props}>
        <Flex
          justify={'space-between'}
          align={'center'}>
          { props.title && <Text 
            fontSize={'1.6em'}
            color={props.titleColor}
            fontWeight={700}>
            { props.title }
          </Text> }
          { props.rightItem }
        </Flex>
        { props.children }
      </Flex>
    </Flex>
  );
}
