
import { Flex, Link, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";

interface ModalContentSimpleTextProps {
  onSubmit?(notes?: string): void
  onCancel?(): void
  inputLabel?: string
  loading?: boolean
}

export function ModalContentSimpleText(props: ModalContentSimpleTextProps) {
  const [notes, setNotes] = useState<string>('');

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit(notes);
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}>
      <Text>
        { props.inputLabel }
      </Text>
      <Textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder={props.inputLabel} />
      <Flex
        mt={'24px'}
        justify={'space-between'}
        gap={'16px'}>
        <AButton
          isLoading={props.loading}
          h={'42px'}
          w={'100%'}
          onClick={props.onCancel}
          variant={'outline'}>
          Tidak
        </AButton>
        <AButton
          isLoading={props.loading}
          h={'42px'}
          w={'100%'}
          onClick={submit}>
          Ya
        </AButton>
      </Flex>
    </Flex>
  );
}
