import { useHttpOutput } from "@/hooks/useHttp";
import { uploadFile } from "@/util";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import { Competency } from "data-design/src/entity/Competency.entity";
import { Employee } from "data-design/src/entity/Employee.entity";
import { EmployeeKeyResultData, EmployeeKeyResultStatus } from "data-design/src/entity/EmployeeKeyResultData.entity";
import { KeyResult } from "data-design/src/entity/KeyResult.entity";
import { KeyResultCompetency } from "data-design/src/entity/KeyResultCompetency.entity";
import { Library } from "data-design/src/entity/Library.entity";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import { AButton } from "../button/AButton";
import { ModalContentOKRReviewHistory } from "../modal/ModalContentOKRReviewHistory";
import { ModalContentOKRSubmission } from "../modal/ModalContentOKRSubmission";
import { ModalContentOKRSubmissionHistory } from "../modal/ModalContentOKRSubmissionHistory";
import { ModalInfo, OnModalReady } from "../modal/ModalInfo";
import { ProgressValue } from "../progress-value/ProgressValue";
import { ThreeDotsImage } from "../three-dots-image/ThreeDotsImage";
import { KRSkillGap } from "./KRSkillGap";
import moment from "moment";
import { Objective } from "data-design/src/entity/Objective.entity";
import { numberFormatter } from "../input-number";

interface OKRKeyResultProps {
  objective: Objective | undefined
  data: KeyResult
  onReview?(): void
  getListCompetency(): Promise<Competency[] | undefined>
  getRecommendationByTags?: useHttpOutput<Library[]>
  proposal: TrainingProposal[] | undefined
  checkHttp?: useHttpOutput<any>
  uncheckHttp?: useHttpOutput<any>
  employee?: Employee | undefined
  submit?: useHttpOutput<void>
  review?: useHttpOutput<void>
  history?: useHttpOutput<EmployeeKeyResultData[]>
  withRedDotUnreadProgress?: boolean
}

export function OKRKeyResult(props: OKRKeyResultProps) {
  const [is_open, setIsOpen] = useState<boolean>(false);
  const total_pencapaian = props.data.list_key_result_data
    .filter((a: EmployeeKeyResultData) => a.status === EmployeeKeyResultStatus.APPROVE)
    .reduce((acc: number, curr: EmployeeKeyResultData) => acc + +curr.value, 0);
  const persen_pencapaian = props.data.target == 0 ? 0 : (100 * total_pencapaian / (props.data.target ?? 0)).toFixed(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [list_competency, setListCompetency] = useState<Competency[]>([]);
  const [modal_submit, setModalSubmit] = useState<OnModalReady>();
  const [modal_review, setModalReview] = useState<OnModalReady>();
  const [modal_history, setModalHistory] = useState<OnModalReady>();
  const [loading_upload, setLoadingUpload] = useState<boolean>(false);
  const has_unread_submission = props.data.list_key_result_data.reduce((acc, curr) => acc || curr.status === EmployeeKeyResultStatus.PENDING, false);
  const kr_end_date = moment(props.objective?.end_date);
  const show_recommendation = moment().isSameOrAfter(kr_end_date);

  async function getListCompetencyData() {
    setLoading(true);
    try {
      const result = await props.getListCompetency();
      console.log('result', result);
      setListCompetency(result ?? []);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(value: number, file: any) {
    if (!props.submit) {
      return;
    }
    const evidence: string | undefined = await uploadFile(file, setLoadingUpload);
    await props.submit.post({
      value,
      evidence
    }, {
      params: {
        id_key_result: props.data.id
      }
    });
    modal_submit?.close();
  }

  useEffect(() => {
    if (!is_open) {
      return;
    }
    getListCompetencyData();
  }, [is_open]);

  return (
    <Flex 
      w={'100%'}
      direction={'column'}
      gap={'12px'}>

      {/* DATA */}
      <Flex 
        w={'100%'}
        border={'solid 1px #FFF'}
        borderColor={'brand'}
        borderRadius={4}
        bg={'#FFF'}
        pt={'7px'}
        pb={'7px'}
        align={'center'}
        position={'relative'}
        borderLeft={(has_unread_submission && props.withRedDotUnreadProgress) ? 'solid 10px red' : ''}>
        <Flex 
          p={'12px 16px'}
          flex={4}>
          <Text
            fontSize={'.8em'}>
            { props.data.title }
          </Text>
        </Flex>
        <Flex 
          p={'12px 16px'}
          flex={1}>
          <Text
            fontSize={'.8em'}>
            { numberFormatter.format(+props.data.target) } { props.data.unit }
          </Text>
        </Flex>
        <Flex 
          p={'12px 16px'}
          flex={1}>
          <Text
            fontSize={'.8em'}>
            { props.data.update_periode }
          </Text>
        </Flex>
        <Flex 
          p={'12px 16px'}
          flex={1}>
          <Text
            fontSize={'.8em'}>
            { +props.data.weight }%
          </Text>
        </Flex>
        <Flex 
          p={'12px 16px'}
          flex={1}>
          <Text
            fontSize={'.8em'}>
            { numberFormatter.format(+total_pencapaian) } { props.data.unit }
          </Text>
        </Flex>
        <Flex 
          p={'12px 16px'}
          flex={3}
          align={'center'}
          gap={'10px'}>
          <Flex
            flex={1}
            direction={'column'}
            w={'55%'}>
            <Flex
              justify={'space-between'}>
              <Text
                fontSize={'.75em'}>
                { persen_pencapaian }%
              </Text>
            </Flex>
            <ProgressValue 
              progress={+persen_pencapaian / 100} />
          </Flex>
          { props.submit && <ModalInfo
            mdWidth={600}
            title={`Submit OKR Progress`}
            setOnModalReady={setModalSubmit}
            trigger={
              <AButton
                onClick={props.onReview}
                p={'4px 12px'}
                fontSize={'.7em'}
                h={'20px'}
                borderRadius={999}>
                Submit
              </AButton>
            }>
            <ModalContentOKRSubmission 
              kr={props.data}
              loading={props.submit?.loading}
              onSubmit={onSubmit}
              onCancel={() => modal_submit?.close()} />
          </ModalInfo> }
          { props.review && <ModalInfo
            mdWidth={1000}
            title={`Review OKR`}
            setOnModalReady={setModalReview}
            trigger={
              <AButton
                onClick={props.onReview}
                p={'4px 12px'}
                fontSize={'.7em'}
                h={'20px'}
                borderRadius={999}>
                Review
              </AButton>
            }>
            <ModalContentOKRReviewHistory 
              review={props.review}
              employee={props.employee}
              data={props.data}
              history={props.history} />
          </ModalInfo> }
          { props.submit && <ModalInfo
            mdWidth={1000}
            title={`History OKR Progress`}
            setOnModalReady={setModalHistory}
            trigger={
              <AButton
                variant={'outline'}
                onClick={props.onReview}
                p={'4px 12px'}
                fontSize={'.7em'}
                h={'20px'}
                borderRadius={999}>
                History
              </AButton>
            }>
            <ModalContentOKRSubmissionHistory 
              data={props.data}
              history={props.history} />
          </ModalInfo> }
        </Flex>
        { show_recommendation && <Flex
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
            { is_open ? '-' : '+' } Competency Gap &amp; Rekomendasi
          </AButton>
        </Flex> }
      </Flex>

      {/* SKILL GAP */}
      <AnimateHeight
        duration={is_open ? 300 : 30}
        height={is_open ? 'auto' : 0}>
        <Flex 
          pl={'3%'}
          mt={is_open ? '26px' : 0}
          direction={'column'}
          gap={'12px'}>
          { loading && <Spinner /> }
          { !loading && <>
            {
              list_competency.map((competency: Competency) => (
                <KRSkillGap 
                  getRecommendationByTags={props.getRecommendationByTags}
                  key={competency.id}
                  checkHttp={props.checkHttp}
                  uncheckHttp={props.uncheckHttp}
                  employee={props.employee}
                  proposal={props.proposal}
                  data={competency} />
              ))
            }
          </> }
        </Flex>
      </AnimateHeight>
    </Flex>
  );
}
