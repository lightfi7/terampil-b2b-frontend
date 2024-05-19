import { Flex, FlexProps, Text } from "@chakra-ui/react";

export enum TrainingProgressSidetabType {
  SEMUA = 'SEMUA',
  DALAM_PROGRESS = 'DALAM_PROGRESS',
  SELESAI = 'SELESAI',
}

interface TrainingProgressSidetabProps extends FlexProps {
  type: TrainingProgressSidetabType
  setType(type: TrainingProgressSidetabType): void
}

export function TrainingProgressSidetab(props: TrainingProgressSidetabProps) {
  return (
    <Flex 
      {...props}
      direction={'column'}
      borderRadius={'8px'}
      boxShadow={'0px 4px 10px rgba(98, 98, 98, 0.15);'}>
      <Text
        p={'10px 16px'}
        borderRadius={'8px'}
        bg={props.type === TrainingProgressSidetabType.SEMUA ? 'brand' : 'white'}
        color={props.type === TrainingProgressSidetabType.SEMUA ? 'white' : '#333'}
        cursor={'pointer'}
        onClick={() => props.setType(TrainingProgressSidetabType.SEMUA)}>
        Semua
      </Text>
      <Text
        p={'10px 16px'}
        borderRadius={'8px'}
        bg={props.type === TrainingProgressSidetabType.DALAM_PROGRESS ? 'brand' : 'white'}
        color={props.type === TrainingProgressSidetabType.DALAM_PROGRESS ? 'white' : '#333'}
        cursor={'pointer'}
        onClick={() => props.setType(TrainingProgressSidetabType.DALAM_PROGRESS)}>
        Dalam Proses
      </Text>
      <Text
        p={'10px 16px'}
        borderRadius={'8px'}
        bg={props.type === TrainingProgressSidetabType.SELESAI ? 'brand' : 'white'}
        color={props.type === TrainingProgressSidetabType.SELESAI ? 'white' : '#333'}
        cursor={'pointer'}
        onClick={() => props.setType(TrainingProgressSidetabType.SELESAI)}>
        Selesai
      </Text>
    </Flex>
  );
}
