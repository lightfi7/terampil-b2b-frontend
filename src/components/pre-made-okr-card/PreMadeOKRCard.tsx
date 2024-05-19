import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { PreMadeOKR } from "data-design/src/entity/PreMadeOKR.entity";

interface PreMadeOKRCardProps {
  data: PreMadeOKR
  onClick?(): void
}

export function PreMadeOKRCard(props: PreMadeOKRCardProps) {
  return (
    <Flex
      boxShadow={'0px 0px 6px 2px rgba(0, 0, 0, 0.08);'}
      borderRadius={10}
      p={'24px'}
      direction={'column'}
      gap={'24px'}
      bg={'#FFF'}>
      <Text
        color={'#005CB9'}
        fontSize={'1.5em'}
        fontWeight={600}
        alignSelf={'center'}>
        { props.data.position } ({ props.data.department })
      </Text>
      <Image
        src={props.data.thumbnail ?? '/image/04.png'}
        w={'100%'}
        h={'240px'}
        objectFit={'contain'} />
      <Button
        bg={'#005CB9'}
        _hover={{
          bg: '#005CB9AA'
        }}
        color={'#FFF'}
        fontSize={'.8em'}
        h={'32px'}
        fontWeight={500}
        onClick={props.onClick}>
        Lihat Preview
      </Button>
    </Flex>
  );
}
