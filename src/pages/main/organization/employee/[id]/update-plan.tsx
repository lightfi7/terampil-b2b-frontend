import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { EmployeeLabels } from '@/components/employee-labels/EmployeeLabels';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { currencyFormatter } from '@/components/input-number';
import { KaryawanBadge } from '@/components/karyawan-badge/KaryawanBadge';
import { ModalContentTrainingProgressDate } from '@/components/modal/ModalContentTrainingProgressDate';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { Pagination } from '@/components/pagination/Pagination';
import { XTable } from '@/components/table/XTable';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex, Image, Switch, Text } from '@chakra-ui/react';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Summary } from '.';
import { getServerSideProps, WithAdminPageProps } from '../../../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const http_init_karyawan: useHttpOutput<Employee> = useHttp({
    url: `/karyawan/${id}`
  });
  const http_init_karyawan_summary: useHttpOutput<Summary> = useHttp({
    url: `/karyawan/${id}/summary`
  });
  const http_get_library: useHttpOutput<IPagination<Library>> = useHttp({
    url: '/library'
  });
  const http_my_training_proposal: useHttpOutput<TrainingProposal[]> = useHttp({
    url: '/development-plan/proposal'
  });
  const http_propose_training: useHttpOutput<TrainingProposal[]> = useHttp({
    url: 'development-plan/library/:id/propose-to/:id_employee',
    callback() {
      http_my_training_proposal.get({
        query: {
          id
        }
      });
      http_init_karyawan_summary.get();
    }
  });
  const http_unpropose_training: useHttpOutput<TrainingProposal[]> = useHttp({
    url: 'development-plan/library/:id/unpropose-from/:id_employee',
    callback() {
      http_my_training_proposal.get({
        query: {
          id
        }
      });
      http_init_karyawan_summary.get();
    }
  });


  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const total_page = Math.ceil((http_get_library.result?.total ?? 0) / limit);
  const [modal_plan_date, setModalPlanDate] = useState<OnModalReady>();
  const [loading_plan_date, setLoadingPlanDate] = useState<boolean>(false);
  
  async function onCheck(library: Library, checked: boolean, date?: Date, price?: number) {
    if (checked) {
      await http_propose_training.post({
        date,
        price
      }, {
        params: {
          id: library.id,
          id_employee: parseInt(id as string)
        }
      });
      modal_plan_date?.close();
    } else {
      await http_unpropose_training.post({}, {
        params: {
          id: library.id,
          id_employee: parseInt(id as string)
        }
      });
    }
  }

  function init() {
    http_my_training_proposal.get({
      query: {
        id
      }
    });
    http_init_karyawan.get();
    http_init_karyawan_summary.get();
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!http_my_training_proposal.result) {
      return;
    }

    http_get_library.get({
      query: {
        page,
        limit,
        except_ids: http_my_training_proposal.result.map(x => x.library.id)
      }
    });
  }, [http_my_training_proposal.result, page, limit]);

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
          title={'Update Plan Karyawan'} />
        <KaryawanBadge
          summaryBadge={http_init_karyawan_summary.result}
          data={http_init_karyawan.result} />
        <GeneralContainer
          title={'Current Plan'}>
          <XTable loading={http_get_library.loading} data={{
            header: [{
              label: 'Judul',
              key: 'judul',
              w: '250px',
              normal: true,
              renderValue(row: TrainingProposal) {
                return (
                  <Flex
                    align={'center'}
                    gap={'12px'}>
                    <Image
                      border={'solid 1px #EEE'}
                      src={row.library?.thumbnail}
                      borderRadius={'4px'}
                      minW={'72px'}
                      minH={'72px'}
                      w={'72px'}
                      h={'72px'}
                      objectFit={'cover'} />
                    <Text>
                      { row.library?.title }
                    </Text>
                    <EmployeeLabels labels={row.library.label ? [row.library.label] : []} />
                  </Flex>
                );
              },
            }, {
              label: 'Tanggal Training',
              key: 'tanggal',
              renderValue(row: TrainingProposal) {
                return moment(row.training_date).format('DD MMMM YYYY');
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
              label: 'Harga Diajukan',
              key: 'price',
              renderValue(row: TrainingProposal) {
                return currencyFormatter.format(row.proposal_budget ?? 0);
              },
            }, {
              label: 'Status',
              key: 'status',
              renderValue(row: TrainingProposal) {
                return 'On Going';
              },
            }, {
              label: '',
              key: 'check',
              renderValue(row: TrainingProposal) {
                return (
                  <Switch
                    isChecked={true}
                    onChange={() => onCheck(row.library, false)} />
                );
              },
            }],
            data: http_my_training_proposal.result ?? []
          }} />
        </GeneralContainer>
        <GeneralContainer
          title={'Available Plan'}>
          <XTable loading={http_get_library.loading} data={{
            header: [{
              label: 'Judul',
              key: 'judul',
              w: '250px',
              normal: true,
              renderValue(row: Library) {
                return (
                  <Flex
                    align={'center'}
                    gap={'12px'}>
                    <Image
                      border={'solid 1px #EEE'}
                      src={row.thumbnail}
                      borderRadius={'4px'}
                      minW={'72px'}
                      minH={'72px'}
                      w={'72px'}
                      h={'72px'}
                      objectFit={'cover'} />
                    <Text>
                      { row.title }
                    </Text>
                    <EmployeeLabels labels={row.label ? [row.label] : []} />
                  </Flex>
                );
              },
            }, {
              label: 'Jenis Materi',
              key: 'jenis_materi',
              renderValue(row: Library) {
                return row.type;
              },
            }, {
              label: 'Kategori',
              key: 'kategori',
              renderValue(row: Library) {
                return row.category;
              },
            }, {
              label: 'Harga',
              key: 'price',
              renderValue(row: Library) {
                return currencyFormatter.format(row?.price);
              },
            }, {
              label: '',
              key: 'check',
              renderValue(row: Library) {
                return (
                  <ModalInfo
                    mdWidth={600}
                    title={`Tanggal Training`}
                    setOnModalReady={setModalPlanDate}
                    trigger={<Switch isChecked={false} />}>
                    <ModalContentTrainingProgressDate
                      loading={loading_plan_date}
                      initialPrice={row?.price}
                      onSubmit={(date: Date, price: number) => onCheck(row, true, date, price)}
                      onCancel={() => modal_plan_date?.close()} />
                  </ModalInfo>
                );
              },
            }],
            data: http_get_library.result?.data ?? [],
          }} />
          <Pagination 
            page={page} 
            numberOfPages={total_page} 
            limit={limit}
            onLimitChange={setLimit}
            onPageChange={setPage} />
        </GeneralContainer>
        <br/>
      </Flex>
    </TemplateAuth>
  );
}
