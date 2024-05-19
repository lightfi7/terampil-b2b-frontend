import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { AButton } from "../button/AButton";

interface DashboardCardProps {
  title?: string
  description?: string
  buttonLabel?: string
}

export function DashboardCard(props: DashboardCardProps) {
  return (
    <Flex
      bg={'#FCFCFC'}
      direction={'column'}
      p={'24px'}
      w={'290px'}
      gap={'20px'}
      borderRadius={16}>
      <Flex>
        <Box 
          bg={'#EBECFE'}
          borderRadius={16}
          p={'12px'}>
          <Image 
            w={'20px'}
            h={'20px'}
            src={'/icons/icon-purple-invoice.svg'} />
        </Box>
      </Flex>
      <Flex
        direction={'column'}
        gap={'5px'}>
        <Text 
          fontSize={'1em'}
          fontWeight={700}>
          { props.title }
        </Text>
        <Text
          fontSize={'.9em'}>
          { props.description }
        </Text>
      </Flex>
      <Flex>
        <AButton 
          pt={'6px !important'}
          pb={'6px !important'}
          h={'30px !important'}
          fontWeight={700}>
          { props.buttonLabel }
        </AButton>
      </Flex>
    </Flex>
  );
}
