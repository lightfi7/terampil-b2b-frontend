
import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";

interface ModalContentTrainingProgressDateProps {
  onSubmit?(date: Date, price: number): void
  onCancel?(): void
  initialPrice?: number
  loading?: boolean
}

export function ModalContentTrainingProgressDate(props: ModalContentTrainingProgressDateProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [price, setPrice] = useState<number>(props.initialPrice ?? '' as any);

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit(date, price);
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
          label: 'Harga',
          key: 'harga',
          placeholder: 'Harga',
          type: 'number',
          value: price,
          onChange: setPrice,
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
