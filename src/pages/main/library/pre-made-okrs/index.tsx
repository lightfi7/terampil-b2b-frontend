import { AButton } from '@/components/button/AButton';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { Pagination } from '@/components/pagination/Pagination';
import { PreMadeOKRCard } from '@/components/pre-made-okr-card/PreMadeOKRCard';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import { Competency } from 'data-design/src/entity/Competency.entity';
import { PreMadeOKR } from 'data-design/src/entity/PreMadeOKR.entity';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [list_data, setListData] = useState<PreMadeOKR[]>([]);

  async function init(filter?: {[key: string]: any}) {
    setLoading(true);
    try {
      setListData((await axios.get('/pre-made-okrs', {
        params: {
          ...(filter ?? {})
        }
      })).data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Pre-Made OKRs'}>
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
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
              filterOptions={[{
                type: 'text',
                name: 'department'
              }, {
                type: 'text',
                name: 'position',
              }]}
              onFilter={(key: string, value: string) => init({ [key]: value })}
              button={{
                label: '+ Tambah Pre-Made OKRs',
                onClick() {
                  window.location.href = `/main/library/pre-made-okrs/add`;
                }
              }} />
          </Flex>
        </GeneralContainer>
        <Grid
          templateColumns={'repeat(2, 1fr)'}
          rowGap={'24px'}
          columnGap={'24px'}>
          {
            list_data.map((pm: PreMadeOKR) => (
              <GridItem
                key={pm.id}>
                <PreMadeOKRCard 
                  data={pm}
                  onClick={() => window.location.href = `/main/library/pre-made-okrs/${pm.id}`} />
              </GridItem>
            ))
          }
        </Grid>
      </Flex>
    </TemplateAuth>
  );
}
