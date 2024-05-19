import { AButton } from '@/components/button/AButton';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { Pagination } from '@/components/pagination/Pagination';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex } from '@chakra-ui/react';
import axios from 'axios';
import { Competency } from 'data-design/src/entity/Competency.entity';
import { Objective } from 'data-design/src/entity/Objective.entity';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [list_data, setListData] = useState<Objective[]>([]);

  async function getListData() {
    setLoading(true);
    try {
      setListData((await axios.get('/pre-made-okrs')).data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getListData();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Pre-Made OKRs'}>
      <PageTitleSubtitle
        title={'Pre-Made OKRs'}
        subtitle={'Bagikan materi tambahan untuk karyawan Anda disini'} />
      <GeneralContainer>
        <Flex
          gap={'12px'}
          direction={'column'}
          flex={1}>
          <TableAction
            noSort
            button={{
              label: '+ Tambah Pre-Made OKRs',
              onClick() {
                window.location.href = `/main/library/pre-made-okrs/add`;
              }
            }} />
        </Flex>
      </GeneralContainer>
    </TemplateAuth>
  );
}
