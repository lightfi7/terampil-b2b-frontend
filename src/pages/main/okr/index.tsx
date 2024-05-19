import { AButton } from '@/components/button/AButton';
import { ContextMenu } from '@/components/context-menu/ContextMenu';
import { ObjectiveWResult } from '@/components/dashboard-sub-page/DashboardPersonal';
import YearPicker from '@/components/date-picker/YearPicker';
import { useSelectTreeData, XInputSelectTree } from '@/components/form/input/XInputSelectTree';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { Pagination } from '@/components/pagination/Pagination';
import { XTable } from '@/components/table/XTable';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex } from '@chakra-ui/react';
import { Objective } from 'data-design/src/entity/Objective.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
import { currencyFormatter } from '@/components/input-number';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();

  const http_init: useHttpOutput<OrganizationNode[]> = useHttp({
    url: '/onboarding/existing-organization-structure'
  });
  const http_get_okr: useHttpOutput<IPagination<ObjectiveWResult>> = useHttp({
    url: '/okr-w-cascade'
  });
  const http_delete_okr: useHttpOutput<IPagination<Objective>> = useHttp({
    url: '/okr/:id',
    callback: init
  });

  const { type } = router.query;
  const [year_date, setYearDate] = useState<Date>(new Date());
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [organization_id, setOrganizationID] = useState<number>('' as any);
  const total_page = Math.ceil((http_get_okr.result?.total ?? 0) / limit);
  const tree = useSelectTreeData(http_init.result ?? []);

  async function init() {
    if (!organization_id) {
      return;
    }
    http_get_okr.get({
      query: {
        limit,
        offset: page * limit,
        organization_id,
        type,
        year: year_date.getFullYear()
      }
    });
  }

  useEffect(() => {
    init();
  }, [organization_id, page, limit, year_date]);

  useEffect(() => {
    http_init.get();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={`OKRs ${type === 'karyawan' ? 'Employee' : 'Organization'}`}>
      <Flex
        direction={'column'}
        p={'12px 12px'}
        pt={0}
        gap={'12px'}>
        <PageTitleSubtitle
          title={`OKRs`}
          subtitle={`Atur OKRs`} />
        <Flex 
          justify={'space-between'}>
          <Flex
            gap={'12px'}>
            <YearPicker 
              value={year_date}
              setValue={setYearDate} />
            <XInputSelectTree 
              containerStyle={{
                padding: 0,
                width: 250,
                paddingTop: 0,
                paddingBottom: 0
              }}
              key={'tree-data'}
              value={organization_id}
              onChange={setOrganizationID} 
              treeData={tree} 
              type={'select-tree'} />
          </Flex>
          <AButton 
            h={'36px'}
            p={'0 12px'}
            onClick={() => {
              window.location.href = `/main/okr/add${type ? `?type=${type}` : ''}`;
            }}>
            + Tambah Objektif
          </AButton>
        </Flex>
        <GeneralContainer title={'Daftar OKRs'}>
          <Flex
            flex={1}
            direction={'column'}
            gap={'12px'}>
            <XTable 
              loading={http_get_okr.loading}
              data={{
                header: [{
                  label: 'Objective',
                  key: 'objective',
                  type: 'string',
                  renderValue(okr: ObjectiveWResult) {
                    return okr.objective.title;
                  },
                }, {
                  label: 'Organisasi',
                  key: 'organisasi',
                  type: 'string',
                  hide: type === 'karyawan',
                  renderValue(okr: ObjectiveWResult) {
                    return okr.objective.organization_node?.name;
                  },
                }, {
                  label: 'Employee',
                  key: 'employee',
                  type: 'string',
                  hide: type !== 'karyawan',
                  renderValue(okr: ObjectiveWResult) {
                    return okr.objective.employee?.name;
                  },
                }, {
                  label: 'Organization',
                  key: 'organization',
                  type: 'string',
                  hide: type !== 'karyawan',
                  renderValue(okr: ObjectiveWResult) {
                    return `${okr.objective.employee?.job_profile?.organization_node?.name} (${okr.objective.employee?.job_profile?.name})`;
                  },
                }, {
                  label: 'Weight',
                  key: 'bobot',
                  type: 'string',
                  renderValue(okr: ObjectiveWResult) {
                    return `${okr.objective.weight}%`;
                  }
                }, {
                  label: 'Total Key Result',
                  key: 'key-result',
                  type: 'string',
                  renderValue(okr: ObjectiveWResult) {
                    return String(okr.objective.list_key_result.length);
                  },
                }, {
                  label: 'Target KR#1',
                  key: 'target-key-result-1',
                  type: 'string',
                  renderValue(okr: ObjectiveWResult) {
                    return currencyFormatter.format(okr.objective.list_key_result[0].target);
                  },
                }, {
                  label: 'Pencapaian',
                  key: 'pencapaian',
                  type: 'string',
                  renderValue(okr: ObjectiveWResult) {
                    return `${okr.result.toFixed(2)}%`;
                  },
                }, {
                  label: '',
                  key: '',
                  renderValue(okr: ObjectiveWResult) {
                    return <Flex align={'center'}>
                      <ContextMenu 
                        listMenu={[{
                          label: 'Edit',
                          onClick() {
                            window.location.href = `okr/add?type=${type}&edit_id=${okr.objective.id}`;
                          }
                        }, {
                          label: 'Hapus',
                          onClick() {
                            if (confirm('Hapus data ini?')) {
                              http_delete_okr.del({
                                params: {
                                  id: okr.objective.id
                                }
                              });
                              return true;
                            }
                          }
                        }]} />
                    </Flex>
                  }
                }],
                data: http_get_okr.result?.data ?? []
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
