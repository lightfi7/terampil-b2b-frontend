import { Box, Flex, Text } from "@chakra-ui/react";

interface ProgressValueProps {
  w?: string | number
  h?: string | number
  progress?: number
  color?: string
  bg?: string
  bgGradient?: string
}

export function ProgressValue(props: ProgressValueProps) {
  return (
    <Flex 
      position={'relative'}
      bg={props.bg ?? '#C4C4C4'}
      h={props.h ?? '4px'}
      w={props.w ?? '100%'}
      borderRadius={999}
      overflow={'hidden'}>
      <Box
        position={'absolute'}
        w={`${(+(props.progress ?? .5) * 100).toFixed(2)}%`}
        bg={props.color ?? '#005CB9'}
        bgGradient={props.bgGradient}
        borderRadius={999}
        h={'100%'} />
    </Flex>
  );
}

export interface ProgressValueDashboardProps extends ProgressValueProps {
  label?: string
  value?: string
}

export function ProgressValueDashboard(props: ProgressValueDashboardProps) {
  return (
    <Flex direction={'column'}>
      <Text 
        color={'#626262'}
        fontSize={'.8em'}>
        { props.label }
      </Text>
      <Flex 
        mt={'-5px'}
        align={'center'}
        gap={'18px'}>
        <Flex flex={1}>
          <ProgressValue {...props} />
        </Flex>
        <Text
          w={'6%'}
          color={'#626262'}
          fontSize={'.88em'}
          fontWeight={700}>
          { props.value }
        </Text>
      </Flex>
    </Flex>
  );
}
