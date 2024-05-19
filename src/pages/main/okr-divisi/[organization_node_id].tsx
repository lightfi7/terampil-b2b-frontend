import { DashboardProgressCard } from "@/components/dashboard-progress-card/DashboardProgressCard";
import { TemplateAuth } from "@/template-auth";
import { Box, Flex, Text } from "@chakra-ui/react";
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
import { KaryawanBadge } from "@/components/karyawan-badge/KaryawanBadge";
import { Summary } from "../organization/employee/[id]";
import { useHttp, useHttpOutput } from "@/hooks/useHttp";
import { useEffect } from "react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { OrganizationBadge } from "@/components/organization-badge/OrganizationBadge";
import { DetailNavigation } from "@/components/detail-navigation/DetailNavigation";
import { DashboardHighestMemberOKR } from "@/components/dashboard-member-highest-okr/DashboardHighestMemberOKR";
import { DashboardPersonalData, EmployeeWithDP, EmployeeWithOKR } from "@/components/dashboard-sub-page/DashboardPersonal";
import { OrganizationNode } from "data-design/src/entity/OrganizationNode.entity";
import { useRouter } from "next/router";
import { DashboardHighestMemberDP } from "@/components/dashboard-member-highest-okr/DashboardHighestMemberDP";
export { getServerSideProps };

interface DivisiSpesifik {
  organization_node: OrganizationNode
  employee_head?: Employee,
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
  competency_proficiency: number,
  top10employees: EmployeeWithOKR[]
  top10dp: EmployeeWithDP[]
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const organization_node_id = router.query.organization_node_id;
  const http_dashboard_divisi_spesifik = useHttp<DivisiSpesifik>({
    url: `/dashboard/divisi/${organization_node_id}`
  });

  function init() {
    http_dashboard_divisi_spesifik.get();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'OKR Divisi'}>
      <Flex 
        direction={'column'}
        gap={'24px'}
        p={'0 14px'}
        pt={'10px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Kembali'} />
        <OrganizationBadge
          data={http_dashboard_divisi_spesifik.result?.organization_node}
          head={http_dashboard_divisi_spesifik.result?.employee_head} />
        <Flex gap={'24px'}>
          <DashboardProgressCard
            title={'OKRs'}
            centerValue={`${(http_dashboard_divisi_spesifik?.result?.okr.percentage ?? 0).toFixed(2)}%`}
            data={[{
              name: 'Selesai',
              color: 'url(#colorUv)',
              value: (http_dashboard_divisi_spesifik?.result?.okr.percentage ?? 0) / 100 
            }, {
              name: 'Belum',
              color: '#E5E5E5',
              value: 1 - (http_dashboard_divisi_spesifik?.result?.okr.percentage ?? 0) / 100
            }]}
            progress={[{
              color: '#3381C7',
              label: 'Di atas 80%',
              progress: (http_dashboard_divisi_spesifik?.result?.okr.total_diatas_80_persen ?? 0) / (http_dashboard_divisi_spesifik?.result?.okr.total ?? 1),
              value: String(http_dashboard_divisi_spesifik?.result?.okr.total_diatas_80_persen ?? 0)
            }, {
              color: '#F18F01',
              label: '61 - 79%',
              progress: (http_dashboard_divisi_spesifik?.result?.okr.total_61_sampai_79_persen ?? 0) / (http_dashboard_divisi_spesifik?.result?.okr.total ?? 1),
              value: String(http_dashboard_divisi_spesifik?.result?.okr.total_61_sampai_79_persen ?? 0)
            }, {
              color: '#E84F52',
              label: 'Di bawah 60%',
              progress: (http_dashboard_divisi_spesifik?.result?.okr.total_dibawah_60_persen ?? 0) / (http_dashboard_divisi_spesifik?.result?.okr.total ?? 1),
              value: String(http_dashboard_divisi_spesifik?.result?.okr.total_dibawah_60_persen ?? 0)
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
                  { http_dashboard_divisi_spesifik?.result?.okr.total ?? 0 }
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
            } />
          <DashboardProgressCard
            title={'My Development Progress'}
            centerValue={`${ http_dashboard_divisi_spesifik?.result?.development_progress?.percentage?.toFixed(0) ?? 0 }%`}
            data={[{
              name: 'Selesai',
              color: 'url(#colorUv)',
              value: http_dashboard_divisi_spesifik?.result?.development_progress?.percentage ?? 0
            }, {
              name: 'Belum',
              color: '#E5E5E5',
              value: 100 - (http_dashboard_divisi_spesifik?.result?.development_progress?.percentage ?? 0)
            }]}
            progress={[{
              color: '#0170BB',
              label: 'Di atas 80%',
              progress: 
                (http_dashboard_divisi_spesifik?.result?.development_progress?.total_diatas_80_persen ?? 0) / 
                (http_dashboard_divisi_spesifik?.result?.development_progress?.total ?? 1),
              value: String(http_dashboard_divisi_spesifik?.result?.development_progress?.total_diatas_80_persen ?? 0)
            }, {
              color: '#F18F01',
              label: '61 - 79%',
              progress: 
                (http_dashboard_divisi_spesifik?.result?.development_progress?.total_61_sampai_79_persen ?? 0) / 
                (http_dashboard_divisi_spesifik?.result?.development_progress?.total ?? 1),
              value: String(http_dashboard_divisi_spesifik?.result?.development_progress?.total_61_sampai_79_persen ?? 0)
            }, {
              color: '#E84F52',
              label: 'Di bawah 60%',
              progress: 
                (http_dashboard_divisi_spesifik?.result?.development_progress?.total_dibawah_60_persen ?? 0) / 
                (http_dashboard_divisi_spesifik?.result?.development_progress?.total ?? 1),
              value: String(http_dashboard_divisi_spesifik?.result?.development_progress?.total_dibawah_60_persen ?? 0)
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
                      { (http_dashboard_divisi_spesifik?.result?.development_progress?.total ?? 0) }
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
                  Total Development: <b>{ (http_dashboard_divisi_spesifik?.result?.development_progress?.total ?? 0) }</b>
                </Text>
              </Flex>
            } />
        </Flex>
        <Flex
          direction={'column'}
          gap={'24px'}
          bg={'#FFF'}
          borderRadius={12}
          boxShadow={'0px 1px 12px rgba(0, 0, 0, .1)'}
          p={'18px'}>
          <Text
            fontSize={'1.3em'}
            color={'blue.500'}
            fontWeight={700}>
            Top 10 Karyawan Divisi Marketing Dengan Pencapaian OKRs Tertinggi
          </Text>
          <DashboardHighestMemberOKR
            data={http_dashboard_divisi_spesifik.result?.top10employees ?? []} />
        </Flex>
        <Flex
          direction={'column'}
          gap={'24px'}
          bg={'#FFF'}
          borderRadius={12}
          boxShadow={'0px 1px 12px rgba(0, 0, 0, .1)'}
          p={'18px'}>
          <Text
            fontSize={'1.3em'}
            color={'blue.500'}
            fontWeight={700}>
            Top 10 Karyawan Divisi Marketing Dengan Pencapaian Development Tertinggi
          </Text>
          <DashboardHighestMemberDP
            data={http_dashboard_divisi_spesifik.result?.top10dp ?? []} />
        </Flex>
        {/* <Flex
          direction={'column'}
          gap={'24px'}
          bg={'#FFF'}
          borderRadius={12}
          boxShadow={'0px 1px 12px rgba(0, 0, 0, .1)'}
          p={'18px'}>
          <Text
            fontSize={'1.3em'}
            color={'blue.500'}
            fontWeight={700}>
            Top 10 Karyawan Divisi Marketing Dengan Competency Proficiency Tertinggi
          </Text>
          <DashboardHighestMemberOKR
            data={http_dashboard_divisi_spesifik.result?.top10employees ?? []} />
        </Flex> */}
      </Flex>
    </TemplateAuth>
  );
}
