import { Flex, Text } from "@chakra-ui/react";
import { numberFormatter } from "../input-number";
import { ProgressValue, ProgressValueDashboard } from "../progress-value/ProgressValue";
import TerampilPieChart from "../terampil-pie-chart/TerampilPieChart";

interface SpecificCompetencyBadgeProps {
  label: string
  value: number
}

export function SpecificCompetencyBadge(props: SpecificCompetencyBadgeProps) {
  return (
    <Flex
      p={'10px 28px'}
      pb={'28px'}
      flex={1}
      borderRadius={'12px'}
      direction={'column'}
      bg={'#FFF'}
      gap={'14px'}
      boxShadow={'0px 2px 25px rgba(0, 0, 0, .05)'}>
      <Text
        mt={'8px'}
        color={'#0160BA'}
        fontWeight={700}
        fontSize={'1.1em'}>
        { props.label }
      </Text>
      <Flex
        align={'center'}
        gap={'18px'}>
        <Flex
          gap={'12px'}
          direction={'column'}
          align={'center'}>
          <TerampilPieChart
            d={'120px'} 
            outerRadius={55}
            innerRadius={39}
            data={[{
              name: 'Belum',
              color: '#E5E5E5',
              value: 100 - props.value
            }, {
              name: '',
              color: '#0160BA',
              value: props.value
            }]}
            centerValue={`${Math.round(props.value)}%`} />
        </Flex>
        <Flex
          justify={'space-between'}
          direction={'column'}
          w={'100%'}
          gap={'15px'}
          py={'24px'}>
          <Flex
            color={'#333'}
            direction={'column'}
            fontSize={'.8em'}>
            <Text>
              Competency Progress
            </Text>
            <Flex
              whiteSpace={'nowrap'}
              align={'center'}
              gap={'10px'}>
              <Flex
                flex={1}>
                <ProgressValue
                  bgGradient={'linear-gradient(90deg, #0777BD 3.21%, #23BAC7 114.1%)'}
                  w={'100%'}
                  h={'8px'}
                  progress={props.value / 100} />
              </Flex>
              <Text>
                { numberFormatter.format(props.value) }%
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
