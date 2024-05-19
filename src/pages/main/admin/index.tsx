import { AButton } from '@/components/button/AButton';
import { ContainerGradient } from '@/components/container-gradient/ContainerGradient';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { Pagination } from '@/components/pagination/Pagination';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [list_admin, setListAdmin] = useState<IPagination<any>>({
    total: 0,
    data: []
  });
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const total_page = Math.ceil(list_admin.total / limit);

  async function getListAdmin() {
    setLoading(true);
    try {
      setListAdmin((await axios.get('/admin', {
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
    getListAdmin();
  }, [page, limit]);

  return (
    <TemplateAuth
      title={'Admin'}
      admin={props.admin}>
      <ContainerGradient 
        p={'24px 18px'}
        justify={'space-between'}
        align={'center'}>
        <Flex 
          gap={'32px'}
          flex={1}>
          <Image 
            w={'80px'}
            h={'80px'}
            objectFit={'contain'}
            src={'/icons/light/icon-user-big.png'} />
          <Flex
            align={'center'}
            gap={'28px'}>
            <Flex 
              direction={'column'}
              gap={'12px'}>
              <Text 
                fontWeight={600}
                fontSize={'1.1em'}>
                Total Admin
              </Text>
              <Text
                fontSize={'.76em'}>
                Update 15 Mar 2021, 23:59
              </Text>
            </Flex>
            <Text 
              fontSize={'2em'}
              fontWeight={700}>
              20
            </Text>
          </Flex>
        </Flex>
      </ContainerGradient>
      <GeneralContainer title={'Daftar List Admin'}>
        <TableAction
          button={{
            label: '+ Add Admin',
            onClick() {
              window.location.href = `/main/admin/add`;
            }
          }} />
        <XTable loading={loading} data={{
          onRowClick(row: any) {
            window.location.href = `/main/admin/${row.id}`;
          },
          header: [{
            label: 'Ref ID',
            key: 'id'
          }, {
            label: 'Name',
            key: 'nama'
          }, {
            label: 'Email',
            key: 'email'
          }, {
            label: 'Role',
            key: 'role_id',
            renderValue(row: any) {
              return row.role?.name;
            }
          }, {
            label: 'Date Created',
            key: 'created_at'
          }],
          data: list_admin.data
        }} />
        <Pagination 
          page={page} 
          numberOfPages={total_page} 
          limit={limit}
          onLimitChange={setLimit}
          onPageChange={setPage} />
      </GeneralContainer>
    </TemplateAuth>
  );
}
