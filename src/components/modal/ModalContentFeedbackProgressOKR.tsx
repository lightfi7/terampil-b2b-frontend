
import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";

interface ModalContentFeedbackProgressOKRProps {
  onSubmit?(approve: boolean, feedback?: string): void
  onCancel?(): void
  loading?: boolean
  type?: 'approve' | 'reject'
  nama: string
}

export function ModalContentFeedbackProgressOKR(props: ModalContentFeedbackProgressOKRProps) {
  const [feedback, setFeedback] = useState<string>('');

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit(props.type === 'approve', feedback);
  }

  function cancel() {
    if (!props.onCancel) {
      alert('no cancel');
      return;
    }
    props.onCancel();
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}>
      { props.type === 'approve' && <Text
        color={'#626262'}
        fontSize={'.88em'}
        textAlign={'center'}>
        Saya menyatakan bahwa OKRs ini sudah sesuai dengan performa karyawan yang sebenarnya.
      </Text> }
      <XForm
        columnMode
        gap={'8px'}
        forms={[{
          label: 'Tambah feedback (opsional)',
          key: 'pencapaian',
          placeholder: 'Tulis feedback disini',
          type: 'textarea',
          value: feedback,
          onChange: setFeedback,
          hide: props.type === 'reject'
        }, {
          label: `Silakan isi Alasan Reject untuk ${props.nama}`,
          placeholder: 'Tulisan alasan reject disini..',
          key: 'evidence',
          type: 'textarea',
          value: feedback,
          onChange: setFeedback,
          hide: props.type === 'approve'
        }]} />
      <Flex
        mt={'24px'}
        justify={'space-between'}
        gap={'16px'}>
        <AButton
          isLoading={props.loading}
          h={'42px'}
          w={'100%'}
          onClick={submit}
          variant={'outline'}>
          Ya
        </AButton>
        <AButton
          h={'42px'}
          w={'100%'}
          onClick={cancel}>
          Tidak
        </AButton>
      </Flex>
    </Flex>
  );
}
