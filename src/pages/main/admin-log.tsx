import { AButton } from '@/components/button/AButton';
import { Pagination } from '@/components/pagination/Pagination';
import { XTable } from '@/components/table/XTable';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const [loading_download, setLoadingDownload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [list_merchant, setListAdminLog] = useState<IPagination<any>>({
    total: 0,
    data: []
  });
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const total_page = Math.ceil(list_merchant.total / limit);

  async function getListAdminLog() {
    setLoading(true);
    try {
      setListAdminLog((await axios.get('/admin-log', {
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
    getListAdminLog();
  }, [page, limit]);

  return (
    <TemplateAuth
      title={'Admin Log'}
      admin={props.admin}>
      <Flex 
        direction={'column'}
        gap={'12px'}>
        <Flex 
          borderRadius={'12px'}
          bg={'#FFF'}
          p={'18px'}
          direction={'column'}
          gap={'12px'}>
          <XTable loading={loading} data={{
            header: [{
              label: 'Ref ID',
              key: 'id'
            }, {
              label: 'Log',
              key: 'log'
            }, {
              label: 'Date Created',
              key: 'created_at'
            }],
            data: list_merchant.data
          }} />
          <Pagination 
            page={page} 
            numberOfPages={total_page} 
            limit={limit}
            onLimitChange={setLimit}
            onPageChange={setPage} />
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
