import { useHttpOutput } from "@/hooks/useHttp";
import { Flex, Text } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { CompetencyAssessment } from "data-design/src/entity/CompetencyAssessment.entity";
import { CompetencyAssessmentGeneral } from "data-design/src/entity/CompetencyAssessmentGeneral.entity";
import { Employee } from "data-design/src/entity/Employee.entity";
import { Library } from "data-design/src/entity/Library.entity";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import { OKRTitle } from "../objective-key-result/OKRTitle";
import { CompetencyItem } from "./CompetencyItem";
import { CompetencyItemSimple } from "./CompetencyItemSimple";

interface CompetencyGroupProps {
  getRecommendationByTags?: useHttpOutput<Library[]>
  onChecked?(library: Library, checked: boolean, date?: Date, price?: number): Promise<void>
  proposal: TrainingProposal[] | undefined
  resultKeyBehavior: CompetencyAssessment[] | undefined
  employee: Employee | undefined
  title?: string
  data: Competency[]
  assess?: useHttpOutput<void>
  submit?: useHttpOutput<void>
  review?: useHttpOutput<void>
  checkHttp?: useHttpOutput<any>
  uncheckHttp?: useHttpOutput<any>
  onLevelClick?(level: Competency): void
  modeSimple?: boolean
}

export function CompetencyGroup(props: CompetencyGroupProps) {
  const [is_open, setIsOpen] = useState<boolean>(false);

  return (
    <Flex
      flex={1}
      direction={'column'}
      gap={'8px'}>
      <OKRTitle 
        bobot={props.title ?? 'General Behavior Competency'}
        onClick={() => setIsOpen(!is_open)}
        open={is_open} />
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
              Competency
            </Text>
            <Text 
              p={'12px 16px'}
              flex={2}
              fontWeight={600}
              fontSize={'.8em'}>
              Proficiency Level
            </Text>
            <Text 
              p={'12px 16px'}
              flex={1}
              fontWeight={600}
              fontSize={'.8em'}>
              Status
            </Text>
            <Text 
              p={'12px 16px'}
              flex={1}
              fontWeight={600}
              fontSize={'.8em'}>
              Score
            </Text>
          </Flex>
          {
            props.data.map((c: Competency) => (
              <>
                { props.modeSimple && <CompetencyItemSimple
                  key={c.id}
                  onLevelClick={props.onLevelClick}
                  checkHttp={props.checkHttp}
                  uncheckHttp={props.uncheckHttp}
                  getRecommendationByTags={props.getRecommendationByTags}
                  onChecked={props.onChecked}
                  proposal={props.proposal}
                  employee={props.employee}
                  data={c}
                  assess={props.assess}
                  submit={props.submit}
                  review={props.review} /> }
                { !props.modeSimple && <CompetencyItem
                  key={c.id}
                  onLevelClick={props.onLevelClick}
                  checkHttp={props.checkHttp}
                  uncheckHttp={props.uncheckHttp}
                  getRecommendationByTags={props.getRecommendationByTags}
                  onChecked={props.onChecked}
                  proposal={props.proposal}
                  result={props.resultKeyBehavior}
                  employee={props.employee}
                  data={c}
                  assess={props.assess}
                  submit={props.submit}
                  review={props.review} /> }
              </>
            ))
          }
        </Flex>
      </AnimateHeight>
    </Flex>
  );
}
