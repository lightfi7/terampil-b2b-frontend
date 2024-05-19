import { Summary } from "@/pages/main/organization/employee/[id]";
import { Flex, Text } from "@chakra-ui/react";
import { CompetencyType } from "data-design/src/entity/Competency.entity";
import { numberFormatter } from "../input-number";
import { ProgressValue, ProgressValueDashboard } from "../progress-value/ProgressValue";
import TerampilPieChart from "../terampil-pie-chart/TerampilPieChart";
import { StarLevel } from "./StarLevel";

interface CompetencyProficiencyBadgeProps {
  simple?: boolean
  onClick?(): void
  summaryBadge: Summary | undefined
}

export function CompetencyProficiencyBadge(props: CompetencyProficiencyBadgeProps) {
  const avg: number = 100 * (props.summaryBadge?.competency.reduce((acc, curr) => +acc + +(curr.value ?? 0) / 100, 0) ?? 0) / (props.summaryBadge?.competency.length ?? 1);
  
  return (
    <Flex
      onClick={props.onClick}
      cursor={props.onClick ? 'pointer' : ''}
      p={'10px 28px'}
      pb={'15px'}
      borderRadius={'12px'}
      direction={'column'}
      align={'center'}
      bg={'#FFF'}
      gap={'14px'}>
      <Text
        mt={'8px'}
        color={'#0160BA'}
        fontWeight={700}
        fontSize={'1.1em'}>
        Competency Proficiency
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
            outerRadius={60}
            innerRadius={43}
            data={[{
              name: '',
              color: '#E5E5E5',
              value: 100 - avg
            }, {
              name: '',
              color: '#0160BA',
              value: avg
            }]}
            centerValue={`${ (avg).toFixed(0) }%`} />
          {/* <StarLevel
            n={5}
            level={Math.round(avg / 20)} /> */}
        </Flex>
        { !props.simple && <Flex
          justify={'space-between'}
          direction={'column'}
          w={'100%'}
          gap={'15px'}
          py={'24px'}>
          {
            [{
              label: 'General Behavior',
              value: props.summaryBadge?.competency.find(x => x.key === CompetencyType.GENERAL_BEHAVIOR)?.value ?? 0,
              bgGradient: 'linear-gradient(90deg, #DB380D 3.21%, #EF931E 114.1%)'
            }, {
              label: 'General Technical',
              value: props.summaryBadge?.competency.find(x => x.key === CompetencyType.TECHNICAL)?.value ?? 0,
              bgGradient: 'linear-gradient(90deg, #0777BD 3.21%, #23BAC7 114.1%)'
            }, {
              label: 'Specific Technical',
              value: props.summaryBadge?.competency.find(x => x.key === CompetencyType.SPECIFIC)?.value ?? 0,
              bgGradient: 'linear-gradient(90deg, #DB380D 3.21%, #EF931E 114.1%)'
            }].map(({ label, value, bgGradient }) => (
              <Flex
                color={'#333'}
                key={label}
                direction={'column'}
                fontSize={'.8em'}>
                <Text>
                  { label }
                </Text>
                <Flex
                  whiteSpace={'nowrap'}
                  align={'center'}
                  gap={'10px'}>
                  <Flex
                    flex={1}>
                    <ProgressValue
                      bgGradient={bgGradient}
                      w={'180px'}
                      h={'8px'}
                      progress={value / 100} />
                  </Flex>
                  <Text>
                    { numberFormatter.format(value) }%
                  </Text>
                </Flex>
              </Flex>
            ))
          }
        </Flex> }
      </Flex>
    </Flex>
  );
}
