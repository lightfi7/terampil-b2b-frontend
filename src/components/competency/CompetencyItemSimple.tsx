import { useHttpOutput } from "@/hooks/useHttp";
import { Flex, Image, Text } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { CompetencyAssessment, CompetencyAssessmentStatus } from "data-design/src/entity/CompetencyAssessment.entity";
import { CompetencyAssessmentGeneral } from "data-design/src/entity/CompetencyAssessmentGeneral.entity";
import { Employee } from "data-design/src/entity/Employee.entity";
import { KeyBehavior } from "data-design/src/entity/KeyBehavior.entity";
import { Library } from "data-design/src/entity/Library.entity";
import { ProficiencyLevel } from "data-design/src/entity/ProficiencyLevel.entity";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { AButton } from "../button/AButton";
import { CompetencyAssessmentSubmissionButton } from "./CompetencyAssessmentSubmissionButton";
import { _CompetencyLearningRecommendation } from "./CompetencyLearningRecommendation";
import { KeyBehaviorItem } from "./KeyBehaviorItem";

interface CompetencyItemSimpleProps {
  getRecommendationByTags?: useHttpOutput<Library[]>
  onChecked?(library: Library, checked: boolean, date?: Date, price?: number): Promise<void>
  proposal: TrainingProposal[] | undefined
  employee: Employee | undefined
  data: Competency
  onReview?(): void
  assess?: useHttpOutput<void>
  submit?: useHttpOutput<void>
  review?: useHttpOutput<void>
  checkHttp?: useHttpOutput<any>
  uncheckHttp?: useHttpOutput<any>
  onLevelClick?(level: Competency): void
}

export function CompetencyItemSimple(props: CompetencyItemSimpleProps) {
  const [is_open, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number>(props.data.list_competency_assessment_general?.[0]?.value);

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
        cursor={'pointer'}
        align={'center'}
        position={'relative'}>
        <Flex 
          p={'12px 16px'}
          flex={4}
          align={'center'}
          gap={'12px'}>
          <Text
            fontSize={'1em'}
            fontWeight={600}>
            { props.data?.name }
          </Text>
        </Flex>
        <Text 
          p={'12px 16px'}
          flex={2}
          fontSize={'.8em'}
          cursor={'pointer'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onLevelClick && props.onLevelClick(props.data);
          }}>
          Level { props.employee?.proficiency_level }
        </Text>
        <Text 
          p={'12px 16px'}
          flex={1}
          fontSize={'.8em'}>
          { value >= props.data.minimum_score ? 'Lulus' : 'Tidak Lulus' }
        </Text>
        <Flex
          p={'8px 18px'}>
          <CompetencyAssessmentSubmissionButton
            kcID={props.data.id}
            value={value}
            assessmentValue={props.data.list_competency_assessment_general?.[0]?.assesment_value}
            title={'props.data.label'}
            employee={props.employee}
            assess={props.assess}
            submit={props.submit}
            review={props.review}
            modeReview={Boolean(props.review)}
            evidenceURL={props.data.list_competency_assessment_general?.[0]?.evidence_file} />
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
            competency={props.data}
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
