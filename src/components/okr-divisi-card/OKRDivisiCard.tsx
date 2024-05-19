import { Flex, Text } from "@chakra-ui/react";
import TerampilPieChart from "../terampil-pie-chart/TerampilPieChart";
import { ProgressValue } from "../progress-value/ProgressValue";
import { ProgressValueDashboard } from "../progress-value/ProgressValue";
import { DivisiSummaryItem } from "@/pages/main/okr-divisi";
import { getBadgeLabelProgress } from "@/util";
import moment from "moment";

interface OKRDivisiCardProps {
  onClick?(): void
  data: DivisiSummaryItem
  i: number
}

export function OKRDivisiCard(props: OKRDivisiCardProps) {
  const badge = getBadgeLabelProgress({
    start_date: moment().startOf('year').toDate(),
    target_date: moment().endOf('year').toDate(),
    current_value: props.data.okr,
    target_value: 100
  });

  return (
    <Flex
      onClick={props.onClick}
      cursor={'pointer'}
      flex={1}
      minH={'100px'}
      bg={'#FFF'}
      boxShadow={'0px 1px 19px 1px rgba(0, 0, 0, .1)'}
      borderRadius={4}
      p={'12px 14px'}
      pb={'24px'}
      direction={'column'}>
      <Flex
        align={'center'}
        color={'blue.500'}
        fontWeight={700}
        fontSize={'1.2em'}>
        <Text>
          #{props.i + 1}
        </Text>
        <Text
          flex={1}
          textAlign={'center'}>
          { props.data.organization_node.name }
        </Text>
      </Flex>
      <Flex 
        gap={'24px'}
        align={'center'}>
        <TerampilPieChart 
          innerRadius={45}
          outerRadius={64}
          data={[{
            name: 'Selesai',
            color: 'url(#colorUv)',
            value: (props.data.okr ?? 0) / 100 
          }, {
            name: 'Belum',
            color: '#E5E5E5',
            value: 1 - (props.data.okr ?? 0) / 100
          }]}
          centerValue={`${(props.data.okr).toFixed(0)}%`} />
        <Flex
          direction={'column'}
          gap={'5px'}>
          <Text
            fontWeight={700}
            color={'blue.500'}
            fontSize={'1.2em'}>
            {(props.data.okr).toFixed(0)}% { badge }
          </Text>
          <Flex
            fontSize={'.85em'}
            direction={'column'}>
            <Text>
              Cabang
            </Text>
            <Text
              color={'#898989'}>
              Kantor Pusat
            </Text>
          </Flex>
          <Flex
            fontSize={'.85em'}
            direction={'column'}>
            <Text>
              Cabang
            </Text>
            <Text
              color={'#898989'}>
              Kantor Pusat
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        direction={'column'}
        gap={'12px'}>
        <Flex
          align={'center'}
          gap={'12px'}
          fontWeight={600}>
          <Text
            textAlign={'right'}
            flex={3}
            fontSize={'.85em'}>
            OKRs
          </Text>
          <Flex
            flex={8}>
            <ProgressValue 
              w={'100%'}
              h={'8px'}
              progress={props.data.okr / 100}
              color={'blue.500'}
              bgGradient={'linear-gradient(90deg, #23BAC7 3.21%, #0777BD 114.1%)'} />
          </Flex>
          <Text
            fontSize={'.85em'}
            color={'blue.500'}
            flex={2}>
            { (props.data.okr).toFixed(2) }%
          </Text>
        </Flex>
        <Flex
          mt={'11px'}
          align={'center'}
          gap={'12px'}
          fontWeight={600}>
          <Text
            textAlign={'right'}
            flex={3}
            fontSize={'.85em'}>
            Dev
          </Text>
          <Flex
            flex={8}>
            <ProgressValue 
              w={'100%'}
              h={'8px'}
              progress={props.data.development_plan / 100}
              color={'blue.500'}
              bgGradient={'linear-gradient(90deg, #23BAC7 3.21%, #0777BD 114.1%)'} />
          </Flex>
          <Text
            fontSize={'.85em'}
            color={'blue.500'}
            flex={2}>
            {(props.data.development_plan ?? 0).toFixed(2)}%
          </Text>
        </Flex>
        <Flex
          align={'center'}
          gap={'12px'}
          fontWeight={600}>
          <Text
            textAlign={'right'}
            flex={3}
            fontSize={'.85em'}>
            Competency Proficiency
          </Text>
          <Flex
            flex={8}>
            <ProgressValue 
              w={'100%'}
              h={'8px'}
              progress={props.data.competency / 100}
              color={'blue.500'}
              bgGradient={'linear-gradient(90deg, #23BAC7 3.21%, #0777BD 114.1%)'} />
          </Flex>
          <Text
            fontSize={'.85em'}
            color={'blue.500'}
            flex={2}>
            {(props.data.competency ?? 0).toFixed(2)}%
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
