
import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";

interface ModalContentTrainingDevelopmentProgressProps {
  onSubmit?(value: number, evidence_file: any): void
  onCancel?(): void
  initialPrice?: number
  loading?: boolean
}

export function ModalContentTrainingDevelopmentProgress(props: ModalContentTrainingDevelopmentProgressProps) {
  const [date, setDate] = useState<Date>(new Date());
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
          label: 'Masukan Tanggal Training',
          key: 'pencapaian',
          placeholder: 'Masukan Tanggal Training',
          type: 'date',
          value: date,
          onChange: setDate,
        }, {
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
          h={'42px'}
          w={'100%'}
          onClick={props.onCancel}>
          Batal
        </AButton>
        <AButton
          isLoading={props.loading}
          h={'42px'}
          w={'100%'}
          onClick={submit}
          variant={'outline'}>
          Submit
        </AButton>
      </Flex>
    </Flex>
  );
}
