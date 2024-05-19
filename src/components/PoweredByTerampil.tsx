import { Flex } from "@chakra-ui/react";

interface PoweredByTerampilProps {}

export function PoweredByTerampil(props: PoweredByTerampilProps) {
  return (
    <Flex
      align={'center'}
      justify={'center'}
      fontWeight={600}
      fontSize={'.9em'}>
      Powered by Terampil &copy; 2023
    </Flex>
  );
}
