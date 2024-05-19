import { useHttp, useHttpOutput } from "@/hooks/useHttp";
import { ROTIData } from "@/pages/main/roti";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { OrganizationNode } from "data-design/src/entity/OrganizationNode.entity";
import moment from "moment";
import { useEffect, useState } from "react";
import { ContainerGradient } from "../container-gradient/ContainerGradient";
import { DashboardChartOKRCard } from "../dashboard-chart-okr-card/DashboardChartOKRCard";
import { DashboardOKRCard } from "../dashboard-okr-card/DashboardOKRCard";
import { DashboardProgressCard } from "../dashboard-progress-card/DashboardProgressCard";
import { XInputSelect } from "../form/input/XInputSelect";
import { GeneralContainer } from "../general-container/GeneralContainer";
import { XTable } from "../table/XTable";
import TerampilBarChart from "../terampil-bar-chart/TerampilBarChart";
import { EmployeeWithDP, EmployeeWithOKR, ObjectiveWResult } from "./DashboardPersonal";
import { SampleNewChart } from "../sample-new-chart/SampleNewChart";
import { XInputSelectTree, useSelectTreeData } from "../form/input/XInputSelectTree";
import { flattenTreeGeneral, generateTreeGeneral } from "../organization-structure-tree/node.utility";
import TerampilPieChart from "../terampil-pie-chart/TerampilPieChart";

export interface DashboardCEOData {
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

interface DashboardCEOProps {
  summary?: useHttpOutput<DashboardCEOData>
}

const list_children_temp: any = {};
export function DashboardCEO(props: DashboardCEOProps) {
  const http_init: useHttpOutput<ROTIData.GroupROTIPerNode[]> = useHttp({
    url: '/roti/summary'
  });
  const http_org_node: useHttpOutput<OrganizationNode[]> = useHttp({
    url: '/onboarding/existing-organization-structure'
  });
  const total_benefit = http_init?.result?.reduce((acc: number, node: ROTIData.GroupROTIPerNode) => acc + +node.benefit, 0) ?? 0;
  const total_cost = http_init?.result?.reduce((acc: number, node: ROTIData.GroupROTIPerNode) => acc + +node.cost, 0) ?? 0;
  const total_roti = 100 * (total_benefit - total_cost) / total_cost;
  const [organization_id, setOrganizationID] = useState<number>('' as any);
  const list_organization_node = http_org_node.result ?? [];
  const tree = useSelectTreeData(list_organization_node);
  const selected_tree = list_organization_node.length > 0
    ? generateTreeGeneral<OrganizationNode>(
      list_organization_node,
      (t: OrganizationNode) => t.id,
      (t: OrganizationNode) => t.parent?.id,
      (t: OrganizationNode, lt: OrganizationNode[]) => list_children_temp[t.id] = lt,
      list_organization_node.find((o: OrganizationNode) => o.id == organization_id)
    )
    : undefined;
  const flatten_selected_tree = selected_tree
    ? flattenTreeGeneral<OrganizationNode>(
      selected_tree,
      (t: OrganizationNode) => list_children_temp[t.id]
    )
    : [];
  const flatten_selected_tree_id: number[] = flatten_selected_tree.map((o: OrganizationNode) => o.id);
  const filtered_roti_data = (http_init.result ?? []).filter((roti: ROTIData.GroupROTIPerNode) => flatten_selected_tree_id.includes(roti.organization_node?.id ?? -1));

  async function init() {
    http_init.get({
      query: {
        year: moment().format('yyyy')
      }
    });
    http_org_node.get();
    if (!props.summary) {
      return;
    }

    props.summary.get();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Flex
      direction={'column'}
      gap={'24px'}>
      <Flex gap={'24px'}>
        <DashboardProgressCard
          title={'Company OKRs'}
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
          onDetail={() => window.location.href = '/main/okr'} />
        <DashboardProgressCard
          title={'Company Development Progress'}
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
          onDetail={() => window.location.href = '/main/training-budget/plan-budget-final'} />
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
      <GeneralContainer>
        <Flex
          direction={'column'}>
          <SampleNewChart
            title={'Company Cost'}
            xs={{
              label: 'Sample',
              values: ['Cost', 'Benefit']
            }}
            ys={[{
              label: 'Value',
              colors: ['#F18F01', '#01B1BE'],
              values: [total_cost, total_benefit]
            }]} />
          <Flex
            alignSelf={'center'}
            my={'24px'}
            align={'center'}
            gap={'24px'}>
            <TerampilPieChart
              d={'240px'} 
              outerRadius={120}
              innerRadius={85}
              data={[{
                name: '',
                color: '#E5E5E5',
                value: 100 - Math.min(100, total_roti)
              }, {
                name: '',
                color: 'url(#colorUv)',
                value: Math.min(100, total_roti)
              }]}
              centerValue={`${ Math.min(100, total_roti).toFixed(0) }%`} />
            <Text
              fontSize={'2.4em'}
              fontWeight={700}>
              ROTI
            </Text>
          </Flex>
        </Flex>
      </GeneralContainer>
      <GeneralContainer>
        <Flex
          align={'center'}
          pl={'24px'}
          gap={'12px'}>
          <Text>
            Select Organization Node: 
          </Text>
          <XInputSelectTree 
            containerStyle={{
              padding: 0,
              width: 250,
              paddingTop: 0,
              paddingBottom: 0
            }}
            key={'tree-data'}
            value={organization_id}
            onChange={setOrganizationID} 
            treeData={tree} 
            type={'select-tree'} />
        </Flex>
        <Flex 
          h={'620px'}
          pt={'12px'}>
          <Flex
            flex={1}>
            <TerampilBarChart
              data={filtered_roti_data.map((org_roti: ROTIData.GroupROTIPerNode) => ({
                label: org_roti.organization_node?.name ?? '',
                Cost: org_roti.cost,
                Benefit: org_roti.benefit
              }))} />
          </Flex>
        </Flex>
      </GeneralContainer>
    </Flex>
  );
}
