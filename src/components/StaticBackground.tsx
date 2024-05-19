import { Box, Flex, Image } from "@chakra-ui/react";

interface StaticBackgroundProps {
  children?: any
}

export function StaticBackground(props: StaticBackgroundProps) {
  return (
    <>
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
          src={'/icons/bg-part-bottom.svg'} />
        <Image 
          position={'absolute'}
          top={0}
          left={0}
          src={'/icons/bg-part-top-left.svg'} />
        <Image 
          position={'absolute'}
          top={0}
          right={0}
          src={'/icons/bg-part-top-right.svg'} />
      </Box>
      { props.children }
    </>
  );
}
