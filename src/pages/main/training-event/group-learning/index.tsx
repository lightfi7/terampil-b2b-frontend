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
import { Flex } from '@chakra-ui/react';
import { GroupLearning } from 'data-design/src/entity/GroupLearning.entity';
import { GroupLearningParticipant } from 'data-design/src/entity/GroupLearningParticipant.entity';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const http_group_learning = useHttp<IPagination<GroupLearning>>({
    url: '/group-learning'
  });

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const total_page = Math.ceil((http_group_learning?.result?.total ?? 0) / limit);

  async function init(filter?: {[key: string]: any}) {
    http_group_learning.get({
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
          title={'Group Learning untuk Karyawan'}
          subtitle={'Silakan tambah dan pilih training yang wajib diikuti oleh karyawan'} />
        <GeneralContainer title={'Daftar Group Learning'}>
          <TableAction 
            noSort
            button={{
              label: '+ Tambah Group Learning',
              onClick() {
                window.location.href = `/main/training-event/group-learning/add`;
              }
            }} />
          <XTable data={{
            header: [{
              label: 'Judul Training',
              key: 'judul',
              renderValue(row: GroupLearning) {
                return row.name;
              }
            }, {
              label: 'Participant',
              key: 'participant',
              renderValue(row: GroupLearning) {
                return row.list_group_learning_participant.map((twp: GroupLearningParticipant) => twp.employee.name).join(', ');
              }
            }, {
              label: 'Schedule',
              key: 'library',
              renderValue(row: GroupLearning) {
                return `${moment(row.date_start).format('DD-MM-YYYY')} to ${moment(row.date_end).format('DD-MM-YYYY')}`;
              }
            }, {
              label: 'Location',
              key: 'location',
              renderValue(row: GroupLearning) {
                return row.place;
              }
            }, {
              label: '',
              key: '',
              hide: !props.admin.is_hr,
              renderValue(row: GroupLearning) {
                return <Flex align={'center'}>
                  <AButton 
                    variant={'outline'}
                    onClick={() => window.location.href = `group-learning/add?edit_id=${row.id}`}>
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
            data: http_group_learning.result?.data ?? []
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
