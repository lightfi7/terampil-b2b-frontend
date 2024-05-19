import { Flex, Text } from "@chakra-ui/react";

export interface ProfileMenuItem {
  label: string
  key: any
}

interface ProfileMenuProps {
  options: ProfileMenuItem[]
  active?: any
  onChange?(key: any): void
}

export function ProfileMenu(props: ProfileMenuProps) {
  return (
    <Flex 
      direction={'column'}
      boxShadow={'0px 1px 14px rgba(0, 0, 0, .2)'}
      borderRadius={8}
      overflow={'hidden'}
      w={'100%'}>
      {
        props.options.map((item: ProfileMenuItem, i: number) => (
          <Flex 
            key={i}
            borderRadius={5}
            cursor={'pointer'}
            padding={'12px 20px'}
            color={props.active == item.key ? '#FFF' : 'inherit'}
            bg={props.active == item.key ? 'brand' : ''}
            onClick={() => props.onChange && props.onChange(item.key)}>
            <Text
              fontSize={'.9em'}>
              { item.label }
            </Text>
          </Flex>
        ))
      }
    </Flex>
  );
}
