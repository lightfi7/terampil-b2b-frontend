import { randomColor } from "@/util";
import { Box, Flex, Text } from "@chakra-ui/react";
import _ from "lodash";

export interface GroupDataSummaryItem {
  label: string
  value: number
  unit: string
}

interface GroupDataSummaryProps {
  data: GroupDataSummaryItem[]
}

export function GroupDataSummary(props: GroupDataSummaryProps) {
  const chunk_data = _.chunk(props.data, 2);
  return (
    <Flex
      gap={'32px'}
      overflowX={'auto'}
      p={'15px 20px'}
      border={'solid 1px #DDD'}
      borderRadius={8}>
      {
        chunk_data.map((list_data: GroupDataSummaryItem[], i: number) => (
          <Flex
            direction={'column'}
            key={`${i}`}
            gap={'24px'}>
            {
              list_data.map((item: GroupDataSummaryItem, j: number) => (
                <Flex 
                  key={`${i}-${j}`}
                  fontSize={'.8em'}
                  gap={'9px'}>
                  <Box
                    w={'8px'}
                    h={'8px'}
                    borderRadius={999}
                    bg={randomColor()}
                    mt={'5px'} />
                  <Flex
                    gap={'3px'}
                    direction={'column'}>
                    <Text
                      fontWeight={500}
                      whiteSpace={'nowrap'}>
                      { item.label }
                    </Text>
                    <Flex
                      align={'center'}
                      gap={'4px'}>
                      <Text
                        fontWeight={500}
                        fontSize={'1.4em'}>
                        { item.value }
                      </Text>
                      <Text>
                        { item.unit }
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              ))
            }
          </Flex>
        ))
      }
    </Flex>
  );
}
