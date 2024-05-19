import { Flex, Text } from "@chakra-ui/react";

export enum RoleSBType {
  PERSONAL = 'PERSONAL',
  TEAM = 'TEAM',
  CEO = 'CEO',
  HR = 'HR'
}

interface RoleSwitchButtonProps {
  active: any
  setActive(active: any): void
  isSuperior?: boolean
  isHR?: boolean
  isCEO?: boolean
}

export function RoleSwitchButton(props: RoleSwitchButtonProps) {
  return (
    <Flex
      gap={'24px'}
      w={'100%'}>
      <PButton
        active={props.active == RoleSBType.PERSONAL}
        onClick={() => props.setActive(RoleSBType.PERSONAL)}>
        My Personal Dashboard
      </PButton>
      { props.isSuperior && <PButton
        active={props.active == RoleSBType.TEAM}
        onClick={() => props.setActive(RoleSBType.TEAM)}>
        My Team Dashboard
      </PButton> }
      { props.isCEO && <PButton
        active={props.active == RoleSBType.CEO}
        onClick={() => props.setActive(RoleSBType.CEO)}>
        CEO Dashboard
      </PButton> }
      { props.isHR && <PButton
        active={props.active == RoleSBType.HR}
        onClick={() => props.setActive(RoleSBType.HR)}>
        HR Dashboard
      </PButton> }
    </Flex>
  );
}

interface PButtonProps {
  children?: any
  active?: boolean
  onClick?(): void
}

function PButton(props: PButtonProps) {
  return (
    <Flex
      bgGradient={props.active ? 'linear-gradient(90deg, #3381C7 0%, #32DECB 105.41%);' : undefined}
      bg={props.active ? undefined : '#8B8B8B'}
      flex={1}
      align={'center'}
      justify={'center'}
      borderRadius={8}
      cursor={'pointer'}
      p={'12px'}
      onClick={props.onClick}>
      <Text
        fontWeight={700}
        fontSize={'1.2em'}>
        { props.children }
      </Text>
  </Flex>
  )
}
