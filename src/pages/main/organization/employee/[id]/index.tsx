import { ContainerGradient } from '@/components/container-gradient/ContainerGradient';
import { DashboardChartOKRCard } from '@/components/dashboard-chart-okr-card/DashboardChartOKRCard';
import { DashboardOKRCard } from '@/components/dashboard-okr-card/DashboardOKRCard';
import { DashboardProgressCard } from '@/components/dashboard-progress-card/DashboardProgressCard';
import YearPicker from '@/components/date-picker/YearPicker';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { EmployeeLabels } from '@/components/employee-labels/EmployeeLabels';
import { XInputSelect } from '@/components/form/input/XInputSelect';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { KaryawanBadge } from '@/components/karyawan-badge/KaryawanBadge';
import { Pagination } from '@/components/pagination/Pagination';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import TerampilBarChart from '@/components/terampil-bar-chart/TerampilBarChart';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Box, Flex, Image, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../../cookies.util';
export { getServerSideProps };

export interface Summary {
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
  competency: {
    key: string
    value: number
  }[]
  budget: number
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const http_init_karyawan: useHttpOutput<Employee> = useHttp({
    url: `/karyawan/${id}`
  });
  const http_init_karyawan_summary: useHttpOutput<Summary> = useHttp({
    url: `/karyawan/${id}/summary`
  });
  const http_my_training_proposal: useHttpOutput<TrainingProposal[]> = useHttp({
    url: '/development-plan/proposal'
  });

  const total_okr_selesai = http_init_karyawan_summary.result?.okr.total && http_init_karyawan_summary.result?.okr.total > 0 ? 100 * (http_init_karyawan_summary.result?.okr.total_diatas_80_persen ?? 0) / (http_init_karyawan_summary.result?.okr.total ?? 0) : 0;

  useEffect(() => {
    http_init_karyawan.get();
    http_init_karyawan_summary.get();
    http_my_training_proposal.get({
      query: {
        id
      }
    });
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Dashboard'}
      noSidebar>
      <Flex 
        p={'0 4%'}
        direction={'column'}
        gap={'48px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Detail Karyawan'} />
        <KaryawanBadge 
          summaryBadge={http_init_karyawan_summary.result}
          onBadgeClick={() => window.location.href = `${id}/competency`}
          data={http_init_karyawan.result} />
        <Flex gap={'24px'}>
          <DashboardProgressCard
            onDetail={() => window.location.href = `${id}/okr-detail`}
            title={'OKRs'}
            centerValue={`${ http_init_karyawan_summary.result?.okr.percentage.toFixed(0) }%`}
            data={[{
              name: 'Selesai',
              color: '#005CB9',
              value: http_init_karyawan_summary.result?.okr.percentage ?? 0
            }, {
              name: 'Belum',
              color: '#E5E5E5',
              value: 100 - (http_init_karyawan_summary.result?.okr.percentage ?? 0)
            }]}
            progress={[{
              color: '#005CB9',
              label: 'Di atas 80%',
              progress: (http_init_karyawan_summary.result?.okr.total_diatas_80_persen ?? 0) / (http_init_karyawan_summary.result?.okr.total ?? 1),
              value: `${http_init_karyawan_summary.result?.okr.total_diatas_80_persen ?? 0}`
            }, {
              color: '#F18F01',
              label: '61 - 79%',
              progress: (http_init_karyawan_summary.result?.okr.total_61_sampai_79_persen ?? 0) / (http_init_karyawan_summary.result?.okr.total ?? 1),
              value: `${http_init_karyawan_summary.result?.okr.total_61_sampai_79_persen ?? 0}`
            }, {
              color: '#E84F52',
              label: 'Di bawah 60%',
              progress: (http_init_karyawan_summary.result?.okr.total_dibawah_60_persen ?? 0) / (http_init_karyawan_summary.result?.okr.total ?? 1),
              value: `${http_init_karyawan_summary.result?.okr.total_dibawah_60_persen ?? 0}`
            }]}
            rightItem={
              <Flex 
                gap={'4px'}
                direction={'column'}
                alignSelf={'center'}
                color={'#626262'}>
                {/* <Text
                  fontSize={'.8em'}>
                  OKRs Tahun 2021
                </Text>
                <Text 
                  color={'brand'}
                  fontWeight={700}
                  fontSize={'1em'}>
                  Top Performer
                </Text> */}
                <Text
                  mt={'12px'}
                  fontSize={'.8em'}>
                  Total OKR
                </Text>
                <Text
                  color={'#373737'}
                  fontWeight={700}
                  fontSize={'1em'}>
                  { http_init_karyawan_summary.result?.okr.total ?? 0 }
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
                <Text>
                  &nbsp;
                </Text>
              </Flex>
            } />
          <DashboardProgressCard
            title={`${http_init_karyawan.result?.name?.split(' ')[0] ?? ''} Development Plan Progress`}
            onDetail={() => window.location.href = `${id}/development-progress`}
            centerValue={`${ http_init_karyawan_summary.result?.development_progress?.percentage?.toFixed(0) ?? 0 }%`}
            data={[{
              name: 'Selesai',
              color: '#005CB9',
              value: http_init_karyawan_summary.result?.development_progress?.percentage ?? 0
            }, {
              name: 'Belum',
              color: '#F18F01',
              value: 100 - (http_init_karyawan_summary.result?.development_progress?.percentage ?? 0)
            }]}
            progress={[{
              color: '#29C56A',
              label: 'Di atas 80%',
              progress: 
                (http_init_karyawan_summary.result?.development_progress?.total_diatas_80_persen ?? 0) / 
                (http_init_karyawan_summary.result?.development_progress?.total ?? 1),
              value: String(http_init_karyawan_summary.result?.development_progress?.total_diatas_80_persen ?? 0)
            }, {
              color: '#F18F01',
              label: '61 - 79%',
              progress: 
                (http_init_karyawan_summary.result?.development_progress?.total_61_sampai_79_persen ?? 0) / 
                (http_init_karyawan_summary.result?.development_progress?.total ?? 1),
              value: String(http_init_karyawan_summary.result?.development_progress?.total_61_sampai_79_persen ?? 0)
            }, {
              color: '#E84F52',
              label: 'Di bawah 60%',
              progress: 
                (http_init_karyawan_summary.result?.development_progress?.total_dibawah_60_persen ?? 0) / 
                (http_init_karyawan_summary.result?.development_progress?.total ?? 1),
              value: String(http_init_karyawan_summary.result?.development_progress?.total_dibawah_60_persen ?? 0)
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
                    bg={'#005CB9'}
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
                    bg={'#F18F01'}
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
                      { (http_init_karyawan_summary.result?.development_progress?.total ?? 0) }
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
                  Total Development: <b>{ (http_init_karyawan_summary.result?.development_progress?.total ?? 0) }</b>
                </Text>
              </Flex>
            } />
        </Flex>
        <Flex 
          direction={'column'}
          gap={'8px'}>
          <Text 
            fontSize={'1.3em'}
            fontWeight={700}>
            Development Plan
          </Text>
          <TableAction
            button={{
              label: 'Update Plan',
              onClick() {
                window.location.href = `/main/organization/employee/${id}/update-plan`;
              }
            }}
            noSort />
          <Flex mt={'12px'}>
            <GeneralContainer>
              <XTable data={{
                header: [{
                  label: 'Judul',
                  key: 'judul',
                  w: '250px',
                  normal: true,
                  renderValue(row: TrainingProposal) {
                    return (
                      <Flex
                        gap={'5px'}
                        align={'center'}>
                        <Text>
                          { row.library?.title }
                        </Text>
                        <EmployeeLabels labels={row.library.label ? [row.library.label] : []} />
                      </Flex>
                    );
                  },
                }, {
                  label: 'Jenis Materi',
                  key: 'jenis_materi',
                  renderValue(row: TrainingProposal) {
                    return row.library?.type;
                  },
                }, {
                  label: 'Kategori',
                  key: 'kategori',
                  renderValue(row: TrainingProposal) {
                    return row.library?.category;
                  },
                }, {
                  label: 'Status',
                  key: 'status',
                  renderValue(row: TrainingProposal) {
                    return 'On Going';
                  },
                }],
                data: http_my_training_proposal.result ?? []
              }} />
              <Pagination 
                page={0} 
                numberOfPages={0} 
                limit={10}
                onLimitChange={() => {}}
                onPageChange={() => {}} />
            </GeneralContainer>
          </Flex>
        </Flex>
        <br/>
      </Flex>
    </TemplateAuth>
  );
}
