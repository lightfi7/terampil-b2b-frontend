
import { Flex, Text } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { KeyBehavior } from "data-design/src/entity/KeyBehavior.entity";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";

interface ModalContentCompetencySubmissionProps {
  onSubmit?(value: number, evidence_file: any): void
  onCancel?(): void
  loading?: boolean
}

export function ModalContentCompetencySubmission(props: ModalContentCompetencySubmissionProps) {
  const [value, setValue] = useState<number>('' as any);
  const [file, setFile] = useState<any>();

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
      <XForm
        columnMode
        gap={'8px'}
        forms={[{
          label: 'Value',
          key: 'value',
          placeholder: 'Value',
          type: 'number',
          value: value,
          onChange: setValue
        }, {
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
