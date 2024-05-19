import { useHttpOutput } from "@/hooks/useHttp";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { Employee } from "data-design/src/entity/Employee.entity";
import { KeyBehavior } from "data-design/src/entity/KeyBehavior.entity";
import { Library } from "data-design/src/entity/Library.entity";
import { ProficiencyLevel } from "data-design/src/entity/ProficiencyLevel.entity";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { useEffect, useState } from "react";
import { _KBLibraryItem } from "../competency/KBLibraryItem";

interface KRSkillGapProps {
  data: Competency
  getRecommendationByTags?: useHttpOutput<Library[]>
  proposal: TrainingProposal[] | undefined
  checkHttp?: useHttpOutput<any>
  uncheckHttp?: useHttpOutput<any>
  employee?: Employee | undefined
}

export function KRSkillGap(props: KRSkillGapProps) {
  const [list_library, setListLibrary] = useState<Library[]>([]);
  
  async function init() {
    try {
      const tags = props.data.list_level?.find((pl: ProficiencyLevel) => {
        return pl.level == (props.employee?.proficiency_level ? props.employee?.proficiency_level : 1);
      })?.list_key_behavior.reduce((acc: string[], curr: KeyBehavior) => [...acc, ...curr.tags], []);
      console.log('props.data', props.data);
      console.log('tags', tags);
      console.log(props.data.list_level)
      const list_lib = await props.getRecommendationByTags?.get({
        query: {
          tags
        }
      });
      setListLibrary(list_lib ?? []);
    } catch (err: any) {
      //
    }
  }

  useEffect(() => {
    console.log('props.data', props.data);
    if (!props.getRecommendationByTags) {
      return;
    }

    init();
  }, []);

  return (
    <Flex
      border={'solid 1px #373737'}
      borderRadius={4}
      w={'100%'}
      bg={'#FFF'}
      direction={'column'}
      fontSize={'.8em'}>
      <Flex
        p={'12px 16px'}
        direction={'column'}>
        <Text 
          color={'#999999'}>
          Competency Gap
        </Text>
        <Text 
          fontWeight={600}
          color={'#F18F01'}>
          { props.data.name }
        </Text>
      </Flex>
      <Flex 
        color={'#999999'}
        mb={'4px'}>
        <Text 
          flex={3}
          pl={'16px'}>
          Rekomendasi:
        </Text>
        <Text 
          flex={1}>
          Jenis Plan
        </Text>
        <Text 
          flex={1}>
          Availability
        </Text>
        <Text 
          flex={1}>
          Status Progres
        </Text>
        <Text 
          flex={1}>
          Approved Training
        </Text>
      </Flex>
      {
        list_library.map((library: Library) => (
          <_KBLibraryItem
            key={library.id}
            checkHttp={props.checkHttp}
            uncheckHttp={props.uncheckHttp}
            employee={props.employee}
            proposal={props.proposal}
            library={library} />
        ))
      }
    </Flex>
  );
}
