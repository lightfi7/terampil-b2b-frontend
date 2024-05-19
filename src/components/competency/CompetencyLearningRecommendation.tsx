import { useHttpOutput } from "@/hooks/useHttp";
import { Box, Flex, Spinner, Switch, Text } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { Employee } from "data-design/src/entity/Employee.entity";
import { KeyBehavior } from "data-design/src/entity/KeyBehavior.entity";
import { Library } from "data-design/src/entity/Library.entity";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import { memo, useEffect, useMemo, useState } from "react";
import { ModalContentTrainingProgressDate } from "../modal/ModalContentTrainingProgressDate";
import { ModalInfo, OnModalReady } from "../modal/ModalInfo";
import { _KBLibraryItem } from "./KBLibraryItem";

interface CompetencyLearningRecommendationProps {
  onChecked?(library: Library, checked: boolean, date?: Date, price?: number): Promise<void>
  getRecommendationByTags?: useHttpOutput<Library[]>
  competency: Competency
  checkHttp?: useHttpOutput<any>
  uncheckHttp?: useHttpOutput<any>
  employee?: Employee | undefined
  proposal: TrainingProposal[] | undefined
  data: Library[]
  open?: boolean
  tags?: string[]
}

export function CompetencyLearningRecommendation(props: CompetencyLearningRecommendationProps) {
  const [list_library, setListLibrary] = useState<Library[]>([]);

  async function init() {
    try {
      const list_lib = await props.getRecommendationByTags?.get({
        query: {
          tags: props.tags ?? []
        }
      });
      setListLibrary(list_lib ?? []);
    } catch (err: any) {
      //
    }
  }

  useEffect(() => {
    if (props.open && props.getRecommendationByTags) {
      init();
    }
  }, [props.open]);

  return (
    <Flex
      border={'solid 1px #E4E4E4'}
      boxShadow={'0px 0px 6px 2px rgba(0, 0, 0, 0.08)'}
      borderRadius={4}
      w={'100%'}
      bg={'#FFF'}
      direction={'column'}
      fontSize={'.8em'}>
      <Flex 
        direction={'column'}>
        <Flex 
          color={'#999999'}
          pt={'10px'}
          pb={'10px'}
          align={'center'}>
          <Text 
            flex={3}
            pl={'16px'}>
            Rekomendasi
          </Text>
          <Text 
            flex={1}>
            Jenis Plan
          </Text>
          <Text 
            flex={1}>
            Vendor
          </Text>
          <Text 
            flex={1}>
            Status
          </Text>
          <Text 
            flex={1}>
            Approved Training
          </Text>
        </Flex>
      </Flex>
      { list_library.map((library: Library) => {
          return (
            <_KBLibraryItem
              key={library.id}
              proposal={props.proposal}
              library={library}
              checkHttp={props.checkHttp}
              uncheckHttp={props.uncheckHttp}
              employee={props.employee} />
          );
        })
      }
    </Flex>
  );
}

export const _CompetencyLearningRecommendation = memo(
  (props: CompetencyLearningRecommendationProps) => <CompetencyLearningRecommendation {...props} />,
  (prev, next) => !next.open ?? true
);
