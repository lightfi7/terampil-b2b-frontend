import { Box, Flex, Text } from "@chakra-ui/react";

interface TabWithStepProps {
  step?: number
  onStepChange?(step: number): void
  children?: any[] | any
  w?: number | string
}

export function TabWithStep(props: TabWithStepProps) {
  const step = props.step ?? 0;
  const children = Array.isArray(props.children) ? props.children : [props.children];
  const total_step = children.length ?? 0;

  return (
    <Flex 
      direction={'column'}
      align={'center'} 
      w={'100%'}>
      <Flex 
        mb={'36px'}
        direction={'column'} 
        w={props.w ?? '350px'}
        gap={'8px'}>
        <Text 
          fontWeight={600}
          alignSelf={'center'}
          color={'#005BD4'}>
          STEP { step + 1 }/{ total_step }
        </Text>
        <Flex gap={'8px'}>
          {
            (children ?? []).map((sub, i: number) => (
              <Box 
                key={i}
                flex={1}
                h={'4px'}
                bg={i <= step ? '#FFE01B' : '#D9DBE9'}
                borderRadius={999} />
            ))
          }
        </Flex>
      </Flex>
      { children[step] }
    </Flex>
  );
}
