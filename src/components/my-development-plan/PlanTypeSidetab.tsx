import { Box, Checkbox, Flex, FlexProps, Text } from "@chakra-ui/react";
import { LibraryType } from "data-design/src/entity/Library.entity";

interface PlanTypeSidetabProps extends FlexProps {
  type: LibraryType
  setType(type: LibraryType): void
}

export function PlanTypeSidetab(props: PlanTypeSidetabProps) {
  return (
    <Flex 
      {...props}
      direction={'column'}
      borderRadius={'8px'}
      boxShadow={'0px 4px 10px rgba(98, 98, 98, 0.15);'}
      p={'18px 18px'}
      bg={'#FFF'}
      gap={'12px'}>
      <Text>
        Tipe Plan
      </Text>
      <Box
        flex={1}
        h={'1px'}
        border={'solid 1px #EEE'} />
      <Flex
        direction={'column'}
        gap={'8px'}>
        {
          Object.keys(LibraryType).map((value: string) => (
            <Flex key={value}>
              <Checkbox>
                <Text
                  fontSize={'.85em'}>
                  { value }
                </Text>
              </Checkbox>
            </Flex>
          ))
        }
      </Flex>
    </Flex>
  );
}
