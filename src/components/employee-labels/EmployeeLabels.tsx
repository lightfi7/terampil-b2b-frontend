import { Flex, Text } from "@chakra-ui/react";

interface EmployeeLabelsProps {
  labels: string[]
}

export function EmployeeLabels(props: EmployeeLabelsProps) {
  return (
    <Flex
      align={'center'}
      gap={'5px'}>
      {
        props.labels.map((label: string, i: number) => (
          <Text 
            bg={'#005CB911'}
            borderRadius={3}
            fontSize={'.85em'}
            p={'3px 5px'}
            key={i}>
            { label }
          </Text>
        ))
      }
    </Flex>
  );
}
