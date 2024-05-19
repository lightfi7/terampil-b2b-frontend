import { AButton } from '@/components/button/AButton';
import { Pagination } from '@/components/pagination/Pagination';
import { XTable } from '@/components/table/XTable';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const [loading_download, setLoadingDownload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [list_role, setListRole] = useState<IPagination<any>>({
    total: 0,
    data: []
  });
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const total_page = Math.ceil(list_role.total / limit);

  async function getListRole() {
    setLoading(true);
    try {
      setListRole((await axios.get('/role', {
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
    getListRole();
  }, [page, limit]);

  return (
    <TemplateAuth
      title={'Role'}
      admin={props.admin}>
      <Flex 
        direction={'column'}
        gap={'12px'}>
        <Flex 
          borderRadius={'12px'}
          bg={'#FFF'}
          p={'18px'}
          alignItems={'center'}
          justify={'space-between'}>
          <Text fontSize={'24px'}>
            Role
          </Text>
          <AButton 
            borderRadius={10}
            onClick={() => window.location.href = '/main/role/add'}
            isLoading={loading_download}
            leftIcon={<Image src={'/icons/icon-add2.svg'} />}>
            Add
          </AButton>
        </Flex>
        <Flex 
          borderRadius={'12px'}
          bg={'#FFF'}
          p={'18px'}
          direction={'column'}
          gap={'12px'}>
          <XTable loading={loading} data={{
            onRowClick(row: any) {
              window.location.href = `/main/role/${row.id}`;
            },
            header: [{
              label: 'Ref ID',
              key: 'id'
            }, {
              label: 'Name',
              key: 'name'
            }, {
              label: 'Date Created',
              key: 'created_at'
            }],
            data: list_role.data
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
