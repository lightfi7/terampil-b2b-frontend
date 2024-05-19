
import { Flex, Text } from "@chakra-ui/react";
import { KeyBehavior } from "data-design/src/entity/KeyBehavior.entity";
import { ProficiencyLevel } from "data-design/src/entity/ProficiencyLevel.entity";

interface ModalContentListLevelProps {
  levels: ProficiencyLevel[]
}

export function ModalContentListLevel(props: ModalContentListLevelProps) {
  return (
    <Flex
      direction={'column'}
      fontSize={'.9em'}
      gap={'12px'}>
      {
        props.levels.map((level: ProficiencyLevel) => (
          <Flex
            direction={'column'}
            key={level.id}
            gap={'4px'}>
              <Text
                fontWeight={600}>
                { level.label }
              </Text>
              <Flex
                direction={'column'}>
                {
                  level?.list_key_behavior.map((kb: KeyBehavior) => (
                    <Flex
                      key={kb.id}
                      gap={'4px'}>
                      <Text>•</Text>
                      <Text>
                        { kb.label }
                      </Text>
                    </Flex>
                  ))
                }
              </Flex>
          </Flex>
        ))
      }
    </Flex>
  );
}
