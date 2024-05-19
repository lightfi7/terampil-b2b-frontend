import { Flex, FlexProps } from "@chakra-ui/react";

interface ContainerGradientProps extends FlexProps {
  children?: any
}

export function ContainerGradient(props: ContainerGradientProps) {
  return (
    <Flex 
      bg={'linear-gradient(90deg, #005CB9 0%, #00DEBF 100%)'}
      borderRadius={10}
      color={'#FFF'}
      {...props}>
      { props.children }
    </Flex>
  );
}
