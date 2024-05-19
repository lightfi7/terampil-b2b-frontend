import { Flex } from "@chakra-ui/react";
import { AButton } from "../button/AButton";
import { GeneralContainer } from "../general-container/GeneralContainer";
import { ProgressValue, ProgressValueDashboard, ProgressValueDashboardProps } from "../progress-value/ProgressValue";
import TerampilPieChart, { PieChartItem } from "../terampil-pie-chart/TerampilPieChart";

export interface DashboardProgressItem extends ProgressValueDashboardProps {}

interface DashboardProgressCardProps {
  title?: string
  data?: PieChartItem[]
  centerValue?: string
  progress?: DashboardProgressItem[]
  rightItem?: any
  centerItem?: any
  onDetail?(): void
}

export function DashboardProgressCard(props: DashboardProgressCardProps) {
  return (
    <GeneralContainer 
      title={props.title}
      titleColor={'brand'}
      p={'24px'}>
      <Flex 
        gap={'24px'}
        mt={'12px'}>
        <TerampilPieChart 
          data={props.data ?? []}
          centerValue={props.centerValue} />
        <Flex>
          { props.rightItem }
        </Flex>
      </Flex>
      <Flex mt={'12px'}>
        { props.centerItem }
      </Flex>
      {
        (props.progress ?? []).map((dpi: DashboardProgressItem, i: number) => (
          <ProgressValueDashboard key={i} {...dpi} />
        ))
      }
      { props.onDetail && <AButton 
        h={'40px'}
        mt={'12px'}
        onClick={props.onDetail}>
        Lihat Detail
      </AButton> }
    </GeneralContainer>
  );
}
