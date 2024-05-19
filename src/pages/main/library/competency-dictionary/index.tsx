import { AButton } from '@/components/button/AButton';
import { ContainerGradient } from '@/components/container-gradient/ContainerGradient';
import { ContextMenu } from '@/components/context-menu/ContextMenu';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { GeneralContainerWithTreeOrg } from '@/components/general-container/GeneralContainerWithTreeOrg';
import { GroupTrainingGrid } from '@/components/group-training-grid/GroupTrainingGrid';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { Pagination } from '@/components/pagination/Pagination';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import { ThreeDotsImage } from '@/components/three-dots-image/ThreeDotsImage';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Competency } from 'data-design/src/entity/Competency.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

interface LibrarySummary {
  kategori: string
  total: string
}

export enum DaftarLibrary {
  'Personal Foundation' = 'Personal Foundation',
  'Marketing & Branding' = 'Marketing & Branding',
  'Operation & Technology' = 'Operation & Technology',
  'Human Capital' = 'Human Capital',
  'Business Foundation' = 'Business Foundation',
  'Sales' = 'Sales',
  'Finance & Accounting' = 'Finance & Accounting',
  'Lainnya' = 'Lainnya',
}

export default function(props: WithAdminPageProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<LibrarySummary[]>([]);
  const [list_data, setListData] = useState<IPagination<Competency>>({
    total: 0,
    data: []
  });
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const total_page = Math.ceil(list_data.total / limit);

  async function getListData() {
    setLoading(true);
    try {
      setListData((await axios.get('/competency-dictionary', {
        params: {
          limit,
          offset: page * limit
        }
      })).data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getListData();
  }, [page, limit]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Competency Dictionary'}>
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
        <PageTitleSubtitle
          title={'Competency Dictionary'}
          subtitle={'Bagikan materi tambahan untuk karyawan Anda disini'} />
        <GeneralContainer>
          <Flex
            gap={'12px'}
            direction={'column'}
            flex={1}>
            <TableAction
              noSort
              button={{
                label: '+ Tambah Competency Dictionary',
                onClick() {
                  window.location.href = `/main/library/competency-dictionary/add`;
                }
              }} />
            <XTable data={{
              header: [{
                label: 'Competency',
                key: 'name',
                w: 200,
                normal: true,
              }, {
                label: 'Job Profiles',
                key: 'job_profiles',
                w: 650,
                normal: true,
                renderValue(row: Competency) {
                  return row.list_competency_job_profile.map(x => x.job_profile.name).join(', ');
                }
              }, {
                label: 'Type',
                key: 'type'
              }, {
                label: 'Minimum Score',
                key: 'minimum_score',
                type: 'number',
              }, {
                label: '',
                key: '',
                renderValue(value: Competency) {
                  return <Flex align={'center'}>
                    <AButton 
                      variant={'outline'}
                      onClick={() => {
                        window.location.href = `/main/library/competency-dictionary/${value.id}`;
                      }}>
                      Detail
                    </AButton>
                  </Flex>
                }
              }],
              data: list_data.data
            }} />
            <Pagination 
              page={page} 
              numberOfPages={total_page} 
              limit={limit}
              onLimitChange={setLimit}
              onPageChange={setPage} />
          </Flex>
        </GeneralContainer>
      </Flex>
    </TemplateAuth>
  );
}
