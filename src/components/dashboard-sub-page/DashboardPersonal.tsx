import { useHttpOutput } from "@/hooks/useHttp";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { Objective } from "data-design/src/entity/Objective.entity";
import { useEffect } from "react";
import { DashboardHighestMemberOKR } from "../dashboard-member-highest-okr/DashboardHighestMemberOKR";
import { DashboardOKRCard } from "../dashboard-okr-card/DashboardOKRCard";
import { DashboardProgressCard } from "../dashboard-progress-card/DashboardProgressCard";

export interface EmployeeWithOKR {
  employee: Employee
  okr: number
}

export interface EmployeeWithDP {
  employee: Employee
  dp: number
}

export interface ObjectiveWResult {
  objective: Objective
  result: number
}

export interface DashboardPersonalData {
  okr: {
    percentage: number
    total: number
    total_diatas_80_persen: number
    total_61_sampai_79_persen: number
    total_dibawah_60_persen: number
  }
  development_progress: {
    percentage: number
    total: number
    total_diatas_80_persen: number
    total_61_sampai_79_persen: number
    total_dibawah_60_persen: number
  }
  top10employees: EmployeeWithOKR[]
  okrs: ObjectiveWResult[]
}

interface DashboardPersonalProps {
  summary?: useHttpOutput<DashboardPersonalData>
}

export function DashboardPersonal(props: DashboardPersonalProps) {
  useEffect(() => {
    if (!props.summary) {
      return;
    }

    props.summary.get();
  }, []);

  return (
    <Flex
      direction={'column'}
      gap={'24px'}>
      <Flex gap={'24px'}>
        <DashboardProgressCard
          title={'OKRs'}
          centerValue={`${(props.summary?.result?.okr.percentage ?? 0).toFixed(2)}%`}
          data={[{
            name: 'Selesai',
            color: 'url(#colorUv)',
            value: (props.summary?.result?.okr.percentage ?? 0) / 100 
          }, {
            name: 'Belum',
            color: '#E5E5E5',
            value: 1 - (props.summary?.result?.okr.percentage ?? 0) / 100
          }]}
          progress={[{
            color: '#3381C7',
            label: 'Di atas 80%',
            progress: (props.summary?.result?.okr.total_diatas_80_persen ?? 0) / (props.summary?.result?.okr.total ?? 1),
            value: String(props.summary?.result?.okr.total_diatas_80_persen ?? 0)
          }, {
            color: '#F18F01',
            label: '61 - 79%',
            progress: (props.summary?.result?.okr.total_61_sampai_79_persen ?? 0) / (props.summary?.result?.okr.total ?? 1),
            value: String(props.summary?.result?.okr.total_61_sampai_79_persen ?? 0)
          }, {
            color: '#E84F52',
            label: 'Di bawah 60%',
            progress: (props.summary?.result?.okr.total_dibawah_60_persen ?? 0) / (props.summary?.result?.okr.total ?? 1),
            value: String(props.summary?.result?.okr.total_dibawah_60_persen ?? 0)
          }]}
          rightItem={
            <Flex 
              gap={'4px'}
              direction={'column'}
              alignSelf={'center'}
              color={'#626262'}>
              <Text
                fontSize={'.8em'}>
                Total OKR
              </Text>
              <Text 
                color={'brand'}
                fontWeight={700}
                fontSize={'1em'}>
                { props.summary?.result?.okr.total ?? 0 }
              </Text>
            </Flex>
          }
          centerItem={
            <Flex
              gap={'4px'}
              color={'#626262'}
              direction={'column'}
              fontSize={'.8em'}
              h={'5em'}>
              <Text
                fontWeight={700}
                color={'#373737'}>
                Progress OKR
              </Text>
              <Text>
                Progress OKR dalam tahun berjalan
              </Text>
            </Flex>
          }
          onDetail={() => window.location.href = '/main/me/okr'} />
        <DashboardProgressCard
          title={'My Development Progress'}
          centerValue={`${ props.summary?.result?.development_progress?.percentage?.toFixed(0) ?? 0 }%`}
          data={[{
            name: 'Selesai',
            color: 'url(#colorUv)',
            value: props.summary?.result?.development_progress?.percentage ?? 0
          }, {
            name: 'Belum',
            color: '#E5E5E5',
            value: 100 - (props.summary?.result?.development_progress?.percentage ?? 0)
          }]}
          progress={[{
            color: '#0170BB',
            label: 'Di atas 80%',
            progress: 
              (props.summary?.result?.development_progress?.total_diatas_80_persen ?? 0) / 
              (props.summary?.result?.development_progress?.total ?? 1),
            value: String(props.summary?.result?.development_progress?.total_diatas_80_persen ?? 0)
          }, {
            color: '#F18F01',
            label: '61 - 79%',
            progress: 
              (props.summary?.result?.development_progress?.total_61_sampai_79_persen ?? 0) / 
              (props.summary?.result?.development_progress?.total ?? 1),
            value: String(props.summary?.result?.development_progress?.total_61_sampai_79_persen ?? 0)
          }, {
            color: '#E84F52',
            label: 'Di bawah 60%',
            progress: 
              (props.summary?.result?.development_progress?.total_dibawah_60_persen ?? 0) / 
              (props.summary?.result?.development_progress?.total ?? 1),
            value: String(props.summary?.result?.development_progress?.total_dibawah_60_persen ?? 0)
          }]}
          rightItem={
            <Flex 
              direction={'column'}
              alignSelf={'center'}
              color={'#373737'}
              gap={'12px'}>
              <Flex 
                gap={'12px'}>
                <Box 
                  bg={'#3381C7'}
                  w={'10px'}
                  h={'10px'}
                  mt={'5px'}
                  borderRadius={999} />
                <Flex 
                  direction={'column'}>
                  <Text
                    fontSize={'.8em'}>
                    Selesai
                  </Text>
                  <Text
                    fontSize={'1.2em'}>
                    0
                  </Text>
                </Flex>
              </Flex>
              <Flex 
                gap={'12px'}>
                <Box 
                  bg={'#E5E5E5'}
                  w={'10px'}
                  h={'10px'}
                  mt={'5px'}
                  borderRadius={999} />
                <Flex 
                  direction={'column'}>
                  <Text
                    fontSize={'.8em'}>
                    On-Progress
                  </Text>
                  <Text
                    fontSize={'1.2em'}>
                    { (props.summary?.result?.development_progress?.total ?? 0) }
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          }
          centerItem={
            <Flex
              gap={'4px'}
              color={'#626262'}
              direction={'column'}
              fontSize={'.8em'}
              h={'5em'}>
              <Text
                fontWeight={700}
                color={'#373737'}>
                Development
              </Text>
              <Text>
                Total Development: <b>{ (props.summary?.result?.development_progress?.total ?? 0) }</b>
              </Text>
            </Flex>
          }
          onDetail={() => window.location.href = '/main/me/development'} />
      </Flex>
      <Grid
        gridTemplateColumns={'repeat(3, 1fr)'}
        gap={'12px'}>
        {
          (props.summary?.result?.okrs ?? []).map((o: ObjectiveWResult) => (
            <DashboardOKRCard
              key={o.objective.id}
              data={o} />
          ))
        }
      </Grid>
      <Text
        color={'#005CB9'}
        fontWeight={700}
        fontSize={'1.2em'}>
        TOP 10 Team Members with the highest OKRs progress
      </Text>
      <DashboardHighestMemberOKR
        data={props.summary?.result?.top10employees ?? []} />
    </Flex>
  );
}
