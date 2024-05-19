import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";

interface StaticSideBackgroundProps {
  children?: any
}

export function StaticSideBackground(props: StaticSideBackgroundProps) {
  return (
    <>
      <Flex 
        pl={'25%'}
        direction={'column'}
        justify={'flex-start'}
        align={'flex-start'}>
        { props.children }
      </Flex>
      <Flex
        position={'fixed'}
        top={0}
        left={0}
        w={'25%'}
        justify={'flex-start'}>
        <Box 
          position={'absolute'}
          zIndex={-1}
          w={'100%'}
          h={'100vh'}
          bg={'#272727'}>
          <Image 
            position={'absolute'}
            bottom={0}
            left={0}
            w={'100%'}
            objectFit={'contain'}
            src={'/icons/bg-side-part-bottom.svg'} />
          <Image 
            position={'absolute'}
            bottom={0}
            left={0}
            w={'70%'}
            src={'/icons/bg-side-part-bottom-left.svg'} />
          <Image 
            position={'absolute'}
            top={0}
            right={0}
            w={'40%'}
            src={'/icons/bg-side-part-top-right.svg'} />
        </Box>
        <Flex 
          direction={'column'}
          color={'white'}
          p={'36px 24px'}>
          <Link href={'/'}>
            <Image 
              objectFit={'contain'}
              w={'130px'}
              src={'logo-whitebox.png'} />
          </Link>
          <Flex
            direction={'column'}
            p={'30px'}>
            <Text 
              fontSize={'28px'}
              fontWeight={900}>
              Welcome!
            </Text>
            <Text mt={'12px'}>
              Before start transaction, we need more information about your business so that we can give you the best services
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
