
import { Button, Flex, Text } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { CompetencyAssessment } from "data-design/src/entity/CompetencyAssessment.entity";
import { KeyBehavior } from "data-design/src/entity/KeyBehavior.entity";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";

interface ModalContentCompetencyReviewProps {
  evidenceURL?: string
  onSubmit?(status: boolean, nilai: number, notes: string): void
  onCancel?(): void
  loading?: boolean
}

export function ModalContentCompetencyReview(props: ModalContentCompetencyReviewProps) {
  const [status, setStatus] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [nilai, setNilai] = useState<number>('' as any);

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit(status, nilai, notes);
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}>
      <Flex>
        <Button
          fontSize={'.8em'}
          h={'24px'}
          colorScheme={'blue'}
          variant={'outline'}
          onClick={() => window.open(props.evidenceURL)}>
          Download Evidence
        </Button>
      </Flex>
      <XForm
        columnMode
        gap={'8px'}
        forms={[{
          label: 'Status',
          key: 'status',
          placeholder: 'Status',
          type: 'dropdown',
          options: [{
            value: true,
            label: 'Approve'
          }, {
            value: false,
            label: 'Reject'
          }],
          value: status,
          onChange: setStatus
        }, {
          label: 'Nilai',
          key: 'nilai',
          placeholder: 'Nilai',
          type: 'number',
          value: nilai,
          onChange: setNilai,
          max: 100,
          min: 0
        }, {
          label: 'Notes',
          key: 'notes',
          placeholder: 'Notes',
          type: 'textarea',
          value: notes,
          onChange: setNotes
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
          Review
        </AButton>
      </Flex>
    </Flex>
  );
}
