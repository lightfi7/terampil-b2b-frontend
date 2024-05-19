
import { Flex, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { ModalInfo, OnModalReady } from "./ModalInfo";
import { ModalContentSimpleText } from "./ModalContentSimpleText";

interface ModalContentTrainingDevelopmentSubmissionReviewProps {
  onSubmit?(notes?: string): void
  onCancel?(): void
  data: TrainingProposal
  loading?: boolean
}

export function ModalContentTrainingDevelopmentSubmissionReview(props: ModalContentTrainingDevelopmentSubmissionReviewProps) {
  const [modal_text, setModalText] = useState<OnModalReady>();

  function submit(notes?: string) {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit(notes);
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}>
      <Text
        fontSize={'.85em'}>
        Detail
      </Text>
      <Text>
        { props.data.library.description } 
      </Text>
      <Text
        fontSize={'.85em'}>
        Status
      </Text>
      <Text>
        <b>{ props.data.submission_approved ? 'Approved' : 'Pending' }</b> (notes: { props.data.submission_feedback ?? '-' }) 
      </Text>
      <Text
        fontSize={'.85em'}>
        Nilai Submission
      </Text>
      <Text>
        { props.data.submission_value } 
      </Text>
      <Text
        fontSize={'.85em'}>
        Evidence
      </Text>
      <Link
        href={props.data.submission_evidence}>
        { props.data.submission_evidence } 
      </Link>
      <Flex
        mt={'24px'}
        justify={'space-between'}
        gap={'16px'}
        w={'100%'}>
        <ModalInfo
          mdWidth={400}
          title={`Apakah Anda yakin approve tugas ini?`}
          setOnModalReady={setModalText}
          trigger={
            <AButton
              isLoading={props.loading}
              h={'42px'}
              w={'100%'}
              flex={1}>
              Approve
            </AButton>
          }>
          <ModalContentSimpleText
            inputLabel={'Tambah Catatan (opsional)'}
            onCancel={modal_text?.close}
            onSubmit={submit}
            loading={props.loading} />
        </ModalInfo>
      </Flex>
    </Flex>
  );
}
