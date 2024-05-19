import { calculateObjective } from "@/util";
import { Flex, Text } from "@chakra-ui/react";
import { Objective } from "data-design/src/entity/Objective.entity";
import { ObjectiveWResult } from "../dashboard-sub-page/DashboardPersonal";
import { numberFormatter, numberFormatter0 } from "../input-number";
import { ProgressValue } from "../progress-value/ProgressValue";

interface DashboardOKRCardProps {
  data: ObjectiveWResult
}

export function DashboardOKRCard(props: DashboardOKRCardProps) {
  return (
    <Flex
      boxShadow={'0px 1px 12px rgba(0, 0, 0, .1)'}
      direction={'column'}
      borderRadius={7}
      p={'4px 0'}
      color={'#626262'}
      bg={'#FFF'}
      flex={1}>
      <Flex 
        gap={'5px'}
        p={'18px 18px'}
        direction={'column'}
        minH={'5em'}>
        <Text
          fontSize={'1.1em'}>
          { props.data.objective.title }
        </Text>
        <Text
          color={'blue.500'}
          fontSize={'1.1em'}
          mb={'12px'}>
          <b>{ numberFormatter0.format(props.data.objective.list_key_result[0].target * props.data.result) } { props.data.objective.list_key_result[0].unit }</b>
        </Text>
        <ProgressValue
          h={'10px'}
          progress={props.data.result} />
      </Flex>
      <Flex 
        gap={'5px'}
        p={'18px 18px'}
        pt={0}
        direction={'column'}>
        <Text
          fontSize={'1.1em'}>
          Target
        </Text>
        <Text
          fontSize={'1.1em'}>
          <b>{ numberFormatter0.format(props.data.objective.list_key_result[0].target) } { props.data.objective.list_key_result[0].unit }</b> ({ (100 * props.data.result).toFixed(2) }% <span style={{ color: '#29C56A' }}> dari target)</span>
        </Text>
      </Flex>
    </Flex>
  );
}
