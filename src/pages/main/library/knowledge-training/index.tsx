import { AButton } from '@/components/button/AButton';
import { ContainerGradient } from '@/components/container-gradient/ContainerGradient';
import { ContextMenu } from '@/components/context-menu/ContextMenu';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { GroupTrainingGrid } from '@/components/group-training-grid/GroupTrainingGrid';
import { currencyFormatter } from '@/components/input-number';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { Pagination } from '@/components/pagination/Pagination';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import { ThreeDotsImage } from '@/components/three-dots-image/ThreeDotsImage';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Library } from 'data-design/src/entity/Library.entity';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

interface LibrarySummary {
  category: string
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
  const [list_data, setListData] = useState<IPagination<Library>>({
    total: 0,
    data: []
  });
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const total_page = Math.ceil(list_data.total / limit);

  async function getListData(filter?: {[key: string]: any}) {
    setLoading(true);
    try {
      setListData((await axios.get('/library', {
        params: {
          limit,
          offset: page * limit,
          ...(filter ?? {})
        }
      })).data);
      setSummary((await axios.get('/summary-library')).data);
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
      title={'Training & Event'}>
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
        <PageTitleSubtitle
          title={'Knowledge & Training'}
          subtitle={'Bagikan materi tambahan untuk karyawan Anda disini'} />
        <GroupTrainingGrid data={summary.map((libsum: LibrarySummary) => ({
          label: libsum.category,
          count: parseInt(libsum.total),
          image: 'https://ekrutassets.s3.ap-southeast-1.amazonaws.com/blogs/images/000/001/440/original/brand-marketing-adalah_1-EKRUT.jpg'
        }))} />
        <GeneralContainer title={'Daftar Materi'}>
          <TableAction
            filterOptions={[{
              type: 'text',
              name: 'title'
            }, {
              type: 'text',
              name: 'tag'
            }]}
            onFilter={(key: string, value: string) => getListData({ [key]: value })}
            button={{
              label: '+ Tambah Materi',
              onClick() {
                window.location.href = `/main/library/knowledge-training/add`;
              }
            }} />
          <XTable data={{
            header: [{
              label: 'Judul',
              key: 'title',
              w: '450px',
              normal: true,
              renderValue(lib: Library) {
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
                      src={lib.thumbnail} />
                    <Text>
                      { lib.title }
                    </Text>
                  </Flex>
                );
              }
            }, {
              label: 'Author / Trainer',
              key: 'micro-learning',
              renderValue(lib: Library) {
                return lib.trainer_name ?? '-';
              }
            }, {
              label: 'Micro Learning',
              key: 'micro-learning',
              renderValue(lib: Library) {
                return lib.is_micro_learning ? 'Micro Learning' : '-';
              }
            }, {
              label: 'Jenis',
              key: 'type'
            }, {
              label: 'Kategori',
              key: 'category'
            }, {
              label: 'Deskripsi',
              key: 'description',
              w: '350px',
              normal: true
            }, {
              label: 'Total Waktu',
              key: 'length_minutes'
            }, {
              label: 'Harga',
              key: 'price',
              renderValue(row: Library) {
                return currencyFormatter.format(row.price);
              },
            }, {
              label: 'Tagging',
              key: 'daftar_tag',
              w: '350px',
              normal: true,
              renderValue(value: Library) {
                return value.tags.join(' ');
              },
            }, {
              label: '',
              key: '',
              renderValue(value: Library) {
                return <Flex 
                  align={'center'}
                  gap={'12px'}>
                  <AButton 
                    variant={'outline'}
                    onClick={() => {
                      window.location.href = `/main/library/knowledge-training/${value.id}`;
                    }}>
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
            data: list_data.data
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
