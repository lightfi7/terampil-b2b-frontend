import { AButton } from '@/components/button/AButton';
import { ContextMenu } from '@/components/context-menu/ContextMenu';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { Pagination } from '@/components/pagination/Pagination';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex, Image, Text } from '@chakra-ui/react';
import { TrainingWajib } from 'data-design/src/entity/TrainingWajib.entity';
import { TrainingWajibParticipant } from 'data-design/src/entity/TrainingWajibParticipant.entity';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const http_training_wajib = useHttp<IPagination<TrainingWajib>>({
    url: '/training-wajib'
  });

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const total_page = Math.ceil((http_training_wajib?.result?.total ?? 0) / limit);

  async function init(filter?: {[key: string]: any}) {
    http_training_wajib.get({
      query: {
        limit,
        offset: page * limit,
        ...(filter ?? {})
      }
    });
  }

  useEffect(() => {
    init();
  }, [page, limit]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Training & Event'}>
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
        <PageTitleSubtitle
          title={'Training Wajib untuk Karyawan'}
          subtitle={'Silakan tambah dan pilih training yang wajib diikuti oleh karyawan'} />
        <GeneralContainer title={'Daftar Training Wajib'}>
          <TableAction 
            noSort
            button={{
              label: '+ Tambah Training Wajib',
              onClick() {
                window.location.href = `/main/training-event/training-wajib/add`;
              }
            }} />
          <XTable data={{
            header: [{
              label: 'Judul Training',
              key: 'judul',
              renderValue(row: TrainingWajib) {
                return (
                  <Flex 
                    align={'center'}
                    gap={'14px'}>
                    <Image 
                      minW={'48px'}
                      minH={'48px'}
                      w={'48px'}
                      h={'48px'}
                      borderRadius={12}
                      objectFit={'cover'}
                      bg={'#EEE'}
                      src={row.thumbnail} />
                    <Text>
                      { row.title }
                    </Text>
                  </Flex>
                );
              }
            }, {
              label: 'Organisasi',
              key: 'organisasi',
              renderValue(row: TrainingWajib) {
                return row.list_training_wajib_participant.map((twp: TrainingWajibParticipant) => twp.organization_node.name).join(', ');
              }
            }, {
              label: 'Total Library',
              key: 'library',
              renderValue(row: TrainingWajib) {
                return row.list_training_wajib_library.length;
              }
            }, {
              label: '',
              key: '',
              hide: !props.admin.is_hr,
              renderValue(row: TrainingWajib) {
                return <Flex align={'center'}>
                  <AButton 
                    onClick={() => window.location.href = `training-wajib/add?edit_id=${row.id}`}
                    variant={'outline'}>
                    Ubah
                  </AButton>
                  <ContextMenu 
                    listMenu={[{
                      label: 'Hapus',
                      onClick() {
                        if (confirm('Hapus data ini?')) {
                          return true;
                        }
                      }
                    }]} />
                </Flex>
              }
            }],
            data: http_training_wajib.result?.data ?? []
          }} />
          <Pagination 
            page={page} 
            numberOfPages={total_page} 
            limit={limit}
            onLimitChange={setLimit}
            onPageChange={setPage} />
        </GeneralContainer>
      </Flex>
    </TemplateAuth>
  );
}
