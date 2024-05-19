import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { ProgressValue } from "../progress-value/ProgressValue";
import { ModalInfo, OnModalReady } from "../modal/ModalInfo";
import { ModalContentTrainingDevelopmentSubmissionReview } from "../modal/ModalContentTrainingDevelopmentSubmissionReview";
import { useState } from "react";

interface DevelopmentPlanCardProps {
  data: TrainingProposal
  onClick?(data: TrainingProposal): void
  onReviewSubmit?(data: TrainingProposal, notes?: string): void
  reviewMode?: boolean
  loading?: boolean
}

export function DevelopmentPlanCard(props: DevelopmentPlanCardProps) {
  const [modal_review, setModalReview] = useState<OnModalReady>();

  async function submit(notes?: string) {
    if (!props.onReviewSubmit) {
      return;
    }

    await props.onReviewSubmit(props.data, notes);
    modal_review?.close();
  }

  return (
    <Flex
      boxShadow={'0px 1px 10px rgba(98, 98, 98, 0.15)'}
      borderRadius={'12px'}
      overflow={'hidden'}
      cursor={'pointer'}
      bg={'#FFF'}
      onClick={() => props.onClick && props.onClick(props.data)}>
      <Image
        w={'160px'}
        h={'100%'}
        objectFit={'cover'}
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/development-plan/proposal/${props.data.id}/thumbnail`} />
      <Flex
        p={'12px 18px'}
        flex={1}
        gap={'12px'}
        direction={'column'}
        justify={'space-between'}>
        <Flex
          flex={1}
          gap={'12px'}>
          <Flex
            direction={'column'}
            gap={'8px'}>
            <Text
              fontWeight={600}
              fontSize={'1.1em'}>
              { props.data.library.title }
            </Text>
            <Text
              fontSize={'.9em'}>
              { props.data.library.description?.slice(0, 100) }...
            </Text>
          </Flex>
          <Text>
            { props.data.library.type }
          </Text>
        </Flex>
        <Flex
          align={'center'}
          gap={'12px'}>
          <ProgressValue
            h={'6px'}
            color={'brand'}
            progress={props.data.progress} />
          <Text
            fontWeight={700}
            fontSize={'.9em'}>
            { (props.data.progress * 100).toFixed(0) }%
          </Text>
        </Flex>
        { (props.reviewMode && props.data.submission_evidence) && <Flex
          justify={'flex-end'}
          gap={'12px'}>
          <ModalInfo
            mdWidth={600}
            title={props.data.library.title}
            setOnModalReady={setModalReview}
            trigger={
              <Text 
                fontWeight={700}
                color={'blue.500'}>
                Lihat Submission
              </Text>
            }>
            <ModalContentTrainingDevelopmentSubmissionReview
              data={props.data}
              onSubmit={submit}
              loading={props.loading} />
          </ModalInfo>
        </Flex> }
        {/* { !props.reviewMode && <Flex
          justify={'flex-end'}>
          <Button
            onClick={e => e.stopPropagation()}
            colorScheme={'blue'}>
            Submit Nilai
          </Button>
        </Flex> } */}
      </Flex>
    </Flex>
  );
}
