import { useHttpOutput } from "@/hooks/useHttp";
import { Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { Competency } from "data-design/src/entity/Competency.entity";
import { Employee } from "data-design/src/entity/Employee.entity";
import { EmployeeKeyResultData, EmployeeKeyResultStatus } from "data-design/src/entity/EmployeeKeyResultData.entity";
import { KeyResult } from "data-design/src/entity/KeyResult.entity";
import { Library } from "data-design/src/entity/Library.entity";
import { Objective } from "data-design/src/entity/Objective.entity";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { OKRKeyResult } from "./OKRKeyResult";
import { OKRTitle } from "./OKRTitle";

interface ObjectiveKeyResultProps {
  title?: string
  data: KeyResult[]
  onReview?(data: KeyResult): void
  getListCompetency(data: KeyResult): Promise<Competency[] | undefined>
  onDetail?(): void
  onDelete?(): void
  onTransfer?(): void
  objektif?: Objective
  getRecommendationByTags?: useHttpOutput<Library[]>
  proposal: TrainingProposal[] | undefined
  checkHttp?: useHttpOutput<any>
  uncheckHttp?: useHttpOutput<any>
  employee?: Employee | undefined
  submit?: useHttpOutput<void>
  review?: useHttpOutput<void>
  history?: useHttpOutput<EmployeeKeyResultData[]>
  showEmployeeName?: boolean
  withRedDotUnreadProgress?: boolean
}

export function ObjectiveKeyResult(props: ObjectiveKeyResultProps) {
  const [is_open, setIsOpen] = useState<boolean>(false);
  const list_pencapaian = props.data?.map((okr: KeyResult) => {
    return okr.target == 0 ? 0 : Math.min(
      okr.list_key_result_data
        .filter((a: EmployeeKeyResultData) => a.status === EmployeeKeyResultStatus.APPROVE)
        .reduce((acc: number, p: EmployeeKeyResultData) => acc + +p.value, 0) 
      / okr.target,
      1
    ) * okr.weight / 100;
  });
  const pencapaian = 100 * list_pencapaian.reduce((acc: number, curr: number) => acc + curr, 0);
  const has_unread_submission = props.data?.reduce((acc: boolean, okr: KeyResult) => {
    const has_unread_submission_kr = okr.list_key_result_data.reduce((acc, curr) => acc || curr.status === EmployeeKeyResultStatus.PENDING, false);
    return acc || has_unread_submission_kr;
  }, false);

  return (
    <Flex
      flex={1}
      direction={'column'}
      gap={'8px'}>
      <OKRTitle 
        pencapaian={pencapaian ?? 0}
        title={props.objektif?.title}
        bobot={props.objektif?.weight}
        listTransferHistory={props.objektif?.list_transfer_history}
        onClick={() => setIsOpen(!is_open)}
        onDelete={props.onDelete}
        onDetail={props.onDetail}
        onTransfer={props.onTransfer}
        open={is_open}
        employeeName={props.showEmployeeName ? props.objektif?.employee?.name : ''}
        redBorderLeft={props.withRedDotUnreadProgress && has_unread_submission} />
      <AnimateHeight
        duration={300}
        height={is_open ? 'auto' : 0}>
        <Flex 
          direction={'column'}
          gap={'12px'}
          mb={'12px'}>

          {/* HEADER */}
          <Flex 
            w={'100%'}
            bg={'#E5E5E5'}>
            <Text 
              p={'12px 16px'}
              flex={4}
              fontWeight={600}
              fontSize={'.8em'}>
              Key Result
            </Text>
            <Text 
              p={'12px 16px'}
              flex={1}
              fontWeight={600}
              fontSize={'.8em'}>
              Target
            </Text>
            <Text 
              p={'12px 16px'}
              flex={1}
              fontWeight={600}
              fontSize={'.8em'}>
              Periode
            </Text>
            <Text 
              p={'12px 16px'}
              flex={1}
              fontWeight={600}
              fontSize={'.8em'}>
              Bobot (100%)
            </Text>
            <Text 
              p={'12px 16px'}
              flex={1}
              fontWeight={600}
              fontSize={'.8em'}>
              Pencapaian
            </Text>
            <Text 
              p={'12px 16px'}
              flex={3}
              fontWeight={600}
              fontSize={'.8em'}>
              Hasil
            </Text>
          </Flex>
          {
            props.data.map((okr: KeyResult) => (
              <OKRKeyResult
                key={okr.id}
                objective={props.objektif}
                submit={props.submit}
                review={props.review}
                history={props.history}
                getRecommendationByTags={props.getRecommendationByTags}
                getListCompetency={() => props.getListCompetency(okr)}
                onReview={() => props.onReview && props.onReview(okr)}
                checkHttp={props.checkHttp}
                uncheckHttp={props.uncheckHttp}
                employee={props.employee}
                proposal={props.proposal}
                data={okr}
                withRedDotUnreadProgress={props.withRedDotUnreadProgress} />
            ))
          }
        </Flex>
      </AnimateHeight>
    </Flex>
  );
}
