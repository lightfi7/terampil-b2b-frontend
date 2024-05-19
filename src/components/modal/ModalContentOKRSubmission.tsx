
import { Flex, Text } from "@chakra-ui/react";
import { KeyResult } from "data-design/src/entity/KeyResult.entity";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";

interface ModalContentOKRSubmissionProps {
  onSubmit?(value: number, evidence: any): void
  onCancel?(): void
  loading?: boolean
  kr: KeyResult
}

export function ModalContentOKRSubmission(props: ModalContentOKRSubmissionProps) {
  const [file, setFile] = useState<any>();
  const [value, setValue] = useState<number>('' as any);

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit(value, file);
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}>
      <Flex
        align={'flex-end'}
        gap={'12px'}>
        <XForm
          columnMode
          gap={'8px'}
          forms={[{
            label: 'Progress',
            key: 'value',
            placeholder: 'Progress',
            type: 'number',
            value,
            onChange: setValue
          }]} />
        <Text
          mb={'10px'}>
          { props.kr.unit }
        </Text>
      </Flex>
      <XForm
        columnMode
        gap={'8px'}
        forms={[{
          label: 'Upload Evidence',
          key: 'evidence',
          placeholder: 'Upload Evidence',
          type: 'file',
          value: file,
          onChange: setFile
        }]} />
      <Flex
        mt={'24px'}
        justify={'space-between'}
        gap={'16px'}>
        <AButton
          isLoading={props.loading}
          h={'42px'}
          w={'100%'}
          onClick={submit}>
          Submit
        </AButton>
      </Flex>
    </Flex>
  );
}
