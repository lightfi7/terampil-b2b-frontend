import { useHttpOutput } from "@/hooks/useHttp";
import { uploadFile } from "@/util";
import { Button, Flex } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { useEffect, useState } from "react";
import { XInputNumber } from "../form/input/XInputNumber";
import { ModalContentCompetencyReview } from "../modal/ModalContentCompetencyReview";
import { ModalContentCompetencySubmission } from "../modal/ModalContentCompetencySubmission";
import { ModalInfo, OnModalReady } from "../modal/ModalInfo";

interface CompetencyAssessmentSubmissionButtonProps {
  kcID: number
  value?: number
  assessmentValue?: number
  title?: string
  employee?: Employee | undefined
  assess?: useHttpOutput<void>
  submit?: useHttpOutput<void>
  review?: useHttpOutput<void>
  modeReview?: boolean
  evidenceURL?: string
}

export function CompetencyAssessmentSubmissionButton(props: CompetencyAssessmentSubmissionButtonProps) {
  const [value, setValue] = useState<number | undefined>(props.assessmentValue);
  const [has_change, setHasChange] = useState<boolean>(false);
  const [modal_submission, setModalSubmission] = useState<OnModalReady>();
  const [modal_review, setModalReview] = useState<OnModalReady>();
  const [loading_upload, setLoadingUpload] = useState<boolean>(false);

  async function assess() {
    if (!props.assess) {
      return;
    }
    await props.assess.post({
      value,
      employee_id: props.employee?.id
    }, {
      params: {
        id: props.kcID
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
          id: props.kcID
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
          id: props.kcID
        }
      });
      modal_review?.close();
    } catch (err: any) {
      alert(err.response.data.toString());
    }
  }

  return (
    <Flex 
      fontSize={'.8em'}
      gap={'4px'}
      align={'center'}>
      <XInputNumber
        containerStyle={{
          padding: 0,
          width: 100
        }}
        type={"number"}
        placeholder={'0'}
        value={props.value ?? 0}
        disabled={true} />
      <XInputNumber
        containerStyle={{ 
          padding: 0,
          width: 100 
        }}
        type={"number"}
        placeholder={'0'}
        value={value}
        disabled={!props.assess || typeof value === 'undefined'}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            assess();
          }
        }}
        onChange={(value: number) => {
          setValue(value);
          setHasChange(true);
        }} />
      { props.assess && <Button
        onClick={assess} 
        isDisabled={!has_change}
        bg={has_change ? 'brand' : ''}
        color={'#FFF'}>
        ✔
      </Button> }
      { props.submit && <ModalInfo
        mdWidth={600}
        title={`Submit competency progress "${props.title}"`}
        setOnModalReady={setModalSubmission}
        trigger={
          <Button
            ml={'12px'}
            bg={'brand'}
            color={'#FFF'}
            borderRadius={999}
            h={'22px'}
            px={'20px'}
            _hover={{
              bg: 'brand'
            }}
            fontSize={'.9em'}>
            Submit
          </Button>
        }>
        <ModalContentCompetencySubmission
          loading={props.submit.loading || loading_upload}
          onSubmit={submit}
          onCancel={() => modal_submission?.close()}   />
      </ModalInfo> }
      { props.review && <ModalInfo
        mdWidth={600}
        title={`Review competency progress "${props.title}"`}
        setOnModalReady={setModalReview}
        trigger={
          <Button
            disabled={Boolean(!props.evidenceURL)}
            ml={'12px'}
            bg={'brand'}
            color={'#FFF'}
            borderRadius={999}
            h={'22px'}
            px={'20px'}
            _hover={{
              bg: 'brand'
            }}
            fontSize={'.9em'}>
            Review
          </Button>
        }>
        <ModalContentCompetencyReview
          evidenceURL={props.evidenceURL}
          loading={props.review.loading}
          onSubmit={review}
          onCancel={() => modal_review?.close()} />
      </ModalInfo> }
    </Flex>
  );
}
