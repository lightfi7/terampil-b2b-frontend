import { useHttp, useHttpOutput } from "@/hooks/useHttp";
import { ROTIData } from "@/pages/main/roti";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { OrganizationNode } from "data-design/src/entity/OrganizationNode.entity";
import moment from "moment";
import { useEffect } from "react";
import { ContainerGradient } from "../container-gradient/ContainerGradient";
import { DashboardChartOKRCard } from "../dashboard-chart-okr-card/DashboardChartOKRCard";
import { DashboardOKRCard } from "../dashboard-okr-card/DashboardOKRCard";
import { DashboardProgressCard } from "../dashboard-progress-card/DashboardProgressCard";
import { XInputSelect } from "../form/input/XInputSelect";
import { GeneralContainer } from "../general-container/GeneralContainer";
import { XTable } from "../table/XTable";
import TerampilBarChart from "../terampil-bar-chart/TerampilBarChart";
import { EmployeeWithDP, EmployeeWithOKR, ObjectiveWResult } from "./DashboardPersonal";

export interface DashboardSuperiorData {
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
  top5employees: EmployeeWithOKR[]
  top5dp: EmployeeWithDP[]
  okrs: ObjectiveWResult[]
  total_organization: number
  total_employee: number
}

interface DashboardSuperiorProps {
  summary?: useHttpOutput<DashboardSuperiorData>
}

export function DashboardSuperior(props: DashboardSuperiorProps) {
  const http_init: useHttpOutput<ROTIData.GroupROTIPerNode[]> = useHttp({
    url: '/roti/summary'
  });
  const total_benefit = http_init?.result?.reduce((acc: number, node: ROTIData.GroupROTIPerNode) => acc + +node.benefit, 0) ?? 0;
  const total_cost = http_init?.result?.reduce((acc: number, node: ROTIData.GroupROTIPerNode) => acc + +node.cost, 0) ?? 0;
  const total_roti = 100 * (total_benefit - total_cost) / total_cost;

  useEffect(() => {
    http_init.get({
      query: {
        year: moment().format('yyyy')
      }
    });
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
          title={'Team OKRs'}
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
          onDetail={() => window.location.href = '/main/team/okr'} />
        <DashboardProgressCard
          title={'Team Development Progress'}
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
          onDetail={() => window.location.href = '/main/team/development'} />
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
      {/* <Flex
        align={'center'}
        justify={'space-between'}>
        <Flex>
          <YearPicker
            value={new Date()}
            setValue={() => { }} />
          <XInputSelect
            containerStyle={{
              padding: 0,
              width: 250,
              paddingLeft: '15px',
              paddingTop: 0,
              paddingBottom: 0
            }}
            key={''}
            placeholder={'Organization'}
            type={"dropdown"} />
        </Flex>
        <Flex>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<Image
                src={'/icons/light/icon-search-grey.png'}
                w={'18px'}
                h={'18px'}
                objectFit={'contain'} />
              }
            />
            <Input
              placeholder={'Cari'}
              fontSize={'.8em'}
              value={''} />
          </InputGroup>
        </Flex>
      </Flex> */}
      <ContainerGradient
        direction={'column'}
        p={'24px 32px'}
        pb={'32px'}
        gap={'16px'}>
        <Text
          fontWeight={700}
          fontSize={'1.3em'}>
          Semua Organisasi ({ props.summary?.result?.total_organization ?? 0 } Organisasi)
        </Text>
        <Flex gap={'12px'}>
          <Flex
            flex={1}
            gap={'8px'}
            direction={'column'}>
            <Text
              fontSize={'.8em'}>
              Jumlah Karyawan
            </Text>
            <Text
              fontWeight={600}
              fontSize={'1.1em'}>
              { props.summary?.result?.total_employee ?? 0 } Karyawan
            </Text>
          </Flex>
        </Flex>
      </ContainerGradient>
      {/* <Flex
        boxShadow={'0px 1px 8px rgba(0, 0, 0, .1)'}
        bg={'#FFF'}
        direction={'column'}
        overflow={'hidden'}
        borderRadius={12}>
        <Flex
          p={'20px 48px'}
          gap={'24px'}
          direction={'column'}
          flex={1}>
          <Flex
            gap={'12px'}>
            <DashboardChartOKRCard />
            <DashboardChartOKRCard bg={'#F18F01'} />
            <DashboardChartOKRCard bg={'#E84F52'} />
          </Flex>
          <Flex
            direction={'column'}
            gap={'8px'}>
            <Text
              color={'brand'}
              fontWeight={600}
              fontSize={'1.1em'}>
              Karyawan Overview
            </Text>
            <Text
              color={'#626262'}
              fontSize={'.8em'}>
              Dalam rentang waktu
            </Text>
          </Flex>
          <Flex
            bg={'#F5F5F5'}
            w={'100%'}
            h={'450px'}
            align={'center'}
            justify={'center'}>
            <Text>
            </Text>
          </Flex>
        </Flex>
        <Flex
          justify={'space-around'}
          bg={'#E5E5E5'}
          p={'18px 0'}
          border={'solid 1px #C4C4C4'}
          w={'100%'}>
          <Flex
            gap={'12px'}>
            <Box
              bg={'#00DEBF'}
              w={'10px'}
              h={'10px'}
              mt={'5px'}
              borderRadius={999} />
            <Flex
              direction={'column'}
              gap={'3px'}>
              <Flex
                align={'center'}
                gap={'7px'}>
                <Text
                  color={'#373737'}
                  fontSize={'.8em'}>
                  Karyawan Daftar
                </Text>
                <Image
                  w={'14px'}
                  h={'14px'}
                  objectFit={'contain'}
                  src={'/icons/light/icon-question-black.png'} />
              </Flex>
              <Text
                fontSize={'.9em'}
                fontWeight={600}>
                3500
              </Text>
            </Flex>
          </Flex>
          <Flex
            gap={'12px'}>
            <Box
              bg={'#E84F52'}
              w={'10px'}
              h={'10px'}
              mt={'5px'}
              borderRadius={999} />
            <Flex
              direction={'column'}
              gap={'3px'}>
              <Flex
                align={'center'}
                gap={'7px'}>
                <Text
                  color={'#373737'}
                  fontSize={'.8em'}>
                  Karyawan Login
                </Text>
                <Image
                  w={'14px'}
                  h={'14px'}
                  objectFit={'contain'}
                  src={'/icons/light/icon-question-black.png'} />
              </Flex>
              <Text
                fontSize={'.9em'}
                fontWeight={600}>
                3500
              </Text>
            </Flex>
          </Flex>
          <Flex
            gap={'12px'}>
            <Box
              bg={'#F18F01'}
              w={'10px'}
              h={'10px'}
              mt={'5px'}
              borderRadius={999} />
            <Flex
              direction={'column'}
              gap={'3px'}>
              <Flex
                align={'center'}
                gap={'7px'}>
                <Text
                  color={'#373737'}
                  fontSize={'.8em'}>
                  Karyawan Ikut Training
                </Text>
                <Image
                  w={'14px'}
                  h={'14px'}
                  objectFit={'contain'}
                  src={'/icons/light/icon-question-black.png'} />
              </Flex>
              <Text
                fontSize={'.9em'}
                fontWeight={600}>
                3500
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex> */}
      <Text
        fontWeight={600}
        fontSize={'1.2em'}
        color={'brand'}>
        Top 5 Karyawan dengan Pencapaian OKRs Tertinggi
      </Text>
      <Box bg={'#FFF'}>
        <XTable data={{
          header: [{
            label: 'Nama Karyawan',
            key: 'nama',
            renderValue(row: any) {
              return (
                <Flex
                  align={'center'}
                  gap={'14px'}>
                  <Image
                    w={'36px'}
                    h={'36px'}
                    borderRadius={999}
                    objectFit={'cover'}
                    bg={'#EEE'}
                    src={row.photo} />
                  <Text>
                    {row.name}
                  </Text>
                </Flex>
              );
            }
          }, {
            label: 'Organisasi',
            key: 'organization',
            type: 'string',
          }, {
            label: 'Jabatan',
            key: 'jabatan',
            type: 'string',
          }, {
            label: 'Nilai OKRs',
            key: 'nilai_okrs',
            type: 'string',
          }],
          data: props.summary?.result?.top5employees.map((e: EmployeeWithOKR, i: number) => ({
            name: e.employee.name,
            photo: e.employee.photo,
            organization: e.employee.job_profile?.organization_node?.name ?? '',
            jabatan: e.employee.job_profile?.name ?? '',
            nilai_okrs: `${e.okr.toFixed(2)}%`
          })) ?? []
        }} />
      </Box>
      <Text
        fontWeight={600}
        fontSize={'1.2em'}
        color={'brand'}>
        Top 5 Karyawan dengan Pencapaian Development Progress Tertinggi
      </Text>
      <Box bg={'#FFF'}>
        <XTable data={{
          header: [{
            label: 'Nama Karyawan',
            key: 'nama',
            renderValue(row: any) {
              return (
                <Flex
                  align={'center'}
                  gap={'14px'}>
                  <Image
                    w={'36px'}
                    h={'36px'}
                    borderRadius={999}
                    objectFit={'cover'}
                    bg={'#EEE'}
                    src={row.photo} />
                  <Text>
                    {row.name}
                  </Text>
                </Flex>
              );
            }
          }, {
            label: 'Organisasi',
            key: 'organization',
            type: 'string',
          }, {
            label: 'Jabatan',
            key: 'jabatan',
            type: 'string',
          }, {
            label: 'Nilai DPs',
            key: 'nilai_dps',
            type: 'string',
          }],
          data: props.summary?.result?.top5dp.map((e: EmployeeWithDP) => ({
            name: e.employee.name,
            photo: e.employee.photo,
            organization: e.employee.job_profile?.organization_node?.name ?? '',
            jabatan: e.employee.job_profile?.name ?? '',
            nilai_dps: `${e.dp?.toFixed(2)}%`
          })) ?? []
        }} />
      </Box>
      <GeneralContainer title={'Return On Training Investment'}>
        <Flex
          justify={'space-between'}
          align={'flex-end'}
          mt={'-12px'}>
          <Text
            color={'#626262'}
            fontSize={'.8em'}>
            ROTI dalam 5 tahun terakhir
          </Text>
          {/* <XInputSelect
            containerStyle={{
              padding: 0,
              width: 100,
              paddingLeft: '15px',
              paddingTop: 0,
              paddingBottom: 0
            }}
            key={''}
            placeholder={'Year'}
            type={"dropdown"} /> */}
        </Flex>
        <Flex
          h={'620px'}
          pt={'12px'}>
          <Flex
            flex={1}>
            <TerampilBarChart
              data={http_init.result?.map((org_roti: ROTIData.GroupROTIPerNode) => ({
                label: org_roti.organization_node?.name ?? '',
                Cost: org_roti.cost,
                Benefit: org_roti.benefit
              })) ?? []} />
          </Flex>
        </Flex>
      </GeneralContainer>
    </Flex>
  );
}
