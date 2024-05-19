import { useHttpOutput } from "@/hooks/useHttp";
import { uploadFile } from "@/util";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { CompetencyAssessment } from "data-design/src/entity/CompetencyAssessment.entity";
import { Employee } from "data-design/src/entity/Employee.entity";
import { KeyBehavior } from "data-design/src/entity/KeyBehavior.entity";
import { Library } from "data-design/src/entity/Library.entity";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import { AButton } from "../button/AButton";
import { XInputNumber } from "../form/input/XInputNumber";
import { ModalContentCompetencyReview } from "../modal/ModalContentCompetencyReview";
import { ModalContentCompetencySubmission } from "../modal/ModalContentCompetencySubmission";
import { ModalInfo, OnModalReady } from "../modal/ModalInfo";
import { CompetencyAssessmentSubmissionButton } from "./CompetencyAssessmentSubmissionButton";
import { _CompetencyLearningRecommendation } from "./CompetencyLearningRecommendation";

interface KeyBehaviorItemProps {
  onChecked?(library: Library, checked: boolean, date?: Date, price?: number): Promise<void>
  proposal: TrainingProposal[] | undefined
  result: CompetencyAssessment[] | undefined
  competency: Competency
  employee?: Employee | undefined
  data: KeyBehavior
  onReview?(): void
  assess?: useHttpOutput<void>
  submit?: useHttpOutput<void>
  review?: useHttpOutput<void>
  checkHttp?: useHttpOutput<any>
  uncheckHttp?: useHttpOutput<any>
  getRecommendationByTags?: useHttpOutput<Library[]>
}

export function KeyBehaviorItem(props: KeyBehaviorItemProps) {
  const kb_result: CompetencyAssessment | undefined = props.result?.find((ca: CompetencyAssessment) => ca.key_behavior?.id === props.data.id);
  const [value, setValue] = useState<number | undefined>(kb_result?.assesment_value);
  const [is_open, setIsOpen] = useState<boolean>(false);
  const [has_change, setHasChange] = useState<boolean>(false);
  const [modal_submission, setModalSubmission] = useState<OnModalReady>();
  const [modal_review, setModalReview] = useState<OnModalReady>();
  const [loading_upload, setLoadingUpload] = useState<boolean>(false);
  const need_review = Boolean(kb_result?.evidence_file) && !kb_result?.assesment_value;

  async function assess() {
    if (!props.assess) {
      return;
    }
    await props.assess.post({
      value,
      employee_id: props.employee?.id
    }, {
      params: {
        id: props.data.id
      }
    });
    setHasChange(false);
  }

  async function submit(value: number, file: any) {
    if (!props.submit) {
      return;
    }
    try {
      const evidence: string | undefined = await uploadFile(file, setLoadingUpload);
      await props.submit.post({
        value,
        evidence
      }, {
        params: {
          id: props.data.id
        }
      });
      modal_submission?.close();
    } catch (err: any) {
      alert(err.response.data.toString());
    }
  }

  async function review(approve: boolean, nilai: number, notes: string) {
    if (!props.review) {
      return;
    }
    try {
      await props.review.post({
        approve,
        value: nilai,
        notes,
        employee_id: props.employee?.id
      }, {
        params: {
          id: props.data.id
        }
      });
      modal_review?.close();
    } catch (err: any) {
      alert(err.response.data.toString());
    }
  }

  useEffect(() => {
    setValue(kb_result?.assesment_value);
  }, [kb_result?.assesment_value]);

  return (
    <Flex 
      w={'100%'}
      direction={'column'}
      gap={'12px'}>

      {/* DATA */}
      <Flex 
        w={'100%'}
        bg={'#FFF'}
        borderColor={'brand'}
        borderRadius={4}
        border={'solid 1px #DDD'}
        pt={'1px'}
        pb={'1px'}
        borderLeft={need_review ? `solid 6px red` : ''}
        align={'center'}
        position={'relative'}>
        <Flex 
          p={'12px 16px'}
          flex={4}
          gap={'8px'}>
          <Text
            fontSize={'.8em'}>
            <span>{ props.data?.label }</span>
          </Text>
        </Flex>
        <Flex
          p={'8px 18px'}>
          <CompetencyAssessmentSubmissionButton
            kcID={props.data.id}
            value={value as any}
            assessmentValue={kb_result?.assesment_value}
            title={props.data.label}
            employee={props.employee}
            assess={props.assess}
            submit={props.submit}
            review={props.review}
            modeReview={Boolean(props.review)}
            evidenceURL={kb_result?.evidence_file} />
        </Flex>
        <Flex
          position={'absolute'}
          left={0}
          top={'100%'}
          mt={is_open ? '8px' : '-12px'}
          ml={'18px'}>
          <AButton
            bg={'brand'}
            _hover={{
              bg: 'brand'
            }}
            onClick={() => setIsOpen(!is_open)}
            p={0}
            pr={'16px'}
            pl={'16px'}
            h={'24px'}
            fontSize={'.7em'}
            borderRadius={999}
            color={'#C4C4C4'}>
            { is_open ? '-' : '+' } Learning Recommendation
          </AButton>
        </Flex>
      </Flex>

      {/* SKILL GAP */}
      <AnimateHeight
        duration={is_open ? 200 : 30}
        height={is_open ? 'auto' : 0}>
        <Flex 
          pl={'3%'}
          mt={is_open ? '26px' : 0}
          direction={'column'}
          gap={'12px'}>
          <_CompetencyLearningRecommendation 
            open={is_open}
            tags={props.data.tags}
            competency={props.competency}
            getRecommendationByTags={props.getRecommendationByTags}
            onChecked={props.onChecked}
            proposal={props.proposal}
            checkHttp={props.checkHttp}
            uncheckHttp={props.uncheckHttp}
            employee={props.employee}
            data={props.getRecommendationByTags?.result ?? []} />
        </Flex>
      </AnimateHeight>
    </Flex>
  );
}
