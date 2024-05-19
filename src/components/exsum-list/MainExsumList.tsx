import { Flex } from "@chakra-ui/react";
import { MainExsumListItem } from "./MainExsumListItem";
import { ExSumData } from "@/pages/main/executive-summary";

interface MainExsumListProps {
  data: ExSumData.ExecutiveSummarySummaryItem[] | undefined
}

export function MainExsumList(props: MainExsumListProps) {
  return (
    <Flex
      flex={1}
      fontSize={'.75em'}
      gap={'5px'}
      direction={'column'}>
      {
        (props.data ?? []).map((item: ExSumData.ExecutiveSummarySummaryItem, i: number) => (
          <MainExsumListItem
            key={item.organization_node.id}
            data={item}
            index={i} />
        ))
      }
    </Flex>
  );
}
