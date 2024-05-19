import { Flex, Text } from "@chakra-ui/react";

export enum DevelopmentPlanTabType {
  PROGRESS_TRAINING = 'PROGRESS_TRAINING',
  SERTIFIKAT = 'SERTIFIKAT',
  BOOKMARK = 'BOOKMARK'
}

interface DevelopmentPlanTabProps {
  type: DevelopmentPlanTabType
  setType(type: DevelopmentPlanTabType): void
}

export function DevelopmentPlanTab(props: DevelopmentPlanTabProps) {
  return (
    <Flex
      color={'white'}
      fontWeight={600}
      gap={'12px'}>
      <Text
        p={'8px 16px'}
        borderRadius={'8px'}
        cursor={'pointer'}
        onClick={() => props.setType(DevelopmentPlanTabType.PROGRESS_TRAINING)}
        bg={props.type === DevelopmentPlanTabType.PROGRESS_TRAINING ? 'brand' : '#5D5E5F'}>
        Progress Training
      </Text>
      <Text
        p={'8px 16px'}
        borderRadius={'8px'}
        cursor={'pointer'}
        onClick={() => props.setType(DevelopmentPlanTabType.SERTIFIKAT)}
        bg={props.type === DevelopmentPlanTabType.SERTIFIKAT ? 'brand' : '#5D5E5F'}>
        Sertifikat
      </Text>
      <Text
        p={'8px 16px'}
        borderRadius={'8px'}
        cursor={'pointer'}
        onClick={() => props.setType(DevelopmentPlanTabType.BOOKMARK)}
        bg={props.type === DevelopmentPlanTabType.BOOKMARK ? 'brand' : '#5D5E5F'}>
        Bookmark
      </Text>
    </Flex>
  );
}
