import { useHttpOutput } from "@/hooks/useHttp";
import { Flex, Image, Text } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { CompetencyAssessment, CompetencyAssessmentStatus } from "data-design/src/entity/CompetencyAssessment.entity";
import { Employee } from "data-design/src/entity/Employee.entity";
import { KeyBehavior } from "data-design/src/entity/KeyBehavior.entity";
import { Library } from "data-design/src/entity/Library.entity";
import { ProficiencyLevel } from "data-design/src/entity/ProficiencyLevel.entity";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { useState } from "react";
import { CompetencyAssessmentSubmissionButton } from "./CompetencyAssessmentSubmissionButton";
import { KeyBehaviorItem } from "./KeyBehaviorItem";

interface CompetencyItemProps {
  getRecommendationByTags?: useHttpOutput<Library[]>
  onChecked?(library: Library, checked: boolean, date?: Date, price?: number): Promise<void>
  proposal: TrainingProposal[] | undefined
  result: CompetencyAssessment[] | undefined
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

export function CompetencyItem(props: CompetencyItemProps) {
  const [show, setShow] = useState<boolean>(false);
  const list_key_behavior = props.data.list_level.find((pf: ProficiencyLevel) => pf.level == props.employee?.proficiency_level)?.list_key_behavior ?? [];
  const list_key_behavior_id = list_key_behavior.map(k => k.id);
  const total_value = list_key_behavior.reduce((acc: number, kb: KeyBehavior) => {
    const kb_result: CompetencyAssessment | undefined = props.result?.find((ca: CompetencyAssessment) => ca.key_behavior.id == kb.id);
    const total = kb_result?.review_status === CompetencyAssessmentStatus.APPROVE ? (+(kb_result?.assesment_value ?? 0) * kb.weight / 100) : 0;
    return acc + total;
  }, 0);
  const has_need_review = (props.result ?? []).reduce((acc: boolean, ca: CompetencyAssessment) => acc || (list_key_behavior_id.includes(ca.key_behavior.id) && Boolean(ca?.evidence_file) && !ca?.assesment_value), false);

  return (
    <Flex 
      w={'100%'}
      direction={'column'}
      gap={'12px'}>

      {/* DATA */}
      <Flex 
        onClick={() => setShow(!show)}
        w={'100%'}
        border={'solid 1px #FFF'}
        borderColor={'brand'}
        borderRadius={4}
        bg={'#FFF'}
        cursor={'pointer'}
        align={'center'}
        position={'relative'}>
        <Flex
          bg={has_need_review ? 'red' : ''}
          h={'64px'}
          align={'center'}
          pr={'12px'}>
          <Image
            src={'/icons/light/icon-arrow-left-grey.png'}
            w={'24px'}
            h={'24px'}
            ml={'16px'}
            transition={'250ms'}
            transform={show ? `rotate(90deg)` : `rotate(-90deg)`} />
        </Flex>
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
          { total_value >= props.data.minimum_score ? 'Lulus' : 'Tidak Lulus' }
        </Text>
        <Text 
          p={'12px 16px'}
          flex={1}
          fontSize={'.8em'}>
          { total_value.toFixed(2) }
        </Text>
      </Flex>
      <Flex 
        p={'12px 16px'}
        pl={'36px'}
        pr={0}
        flex={2}
        gap={'12px'}
        direction={'column'}>
        <Text
          fontSize={'.9em'}
          fontWeight={700}>
          Key Behavior
        </Text>
        {
          list_key_behavior.map((kb: KeyBehavior) => (
            <KeyBehaviorItem
              getRecommendationByTags={props.getRecommendationByTags}
              key={kb.id} 
              checkHttp={props.checkHttp}
              uncheckHttp={props.uncheckHttp}
              onChecked={props.onChecked}
              proposal={props.proposal}
              result={props.result}
              competency={props.data}
              data={kb}
              employee={props.employee}
              onReview={props.onReview}
              assess={props.assess}
              submit={props.submit}
              review={props.review} />
          ))
        }
      </Flex>
    </Flex>
  );
}
