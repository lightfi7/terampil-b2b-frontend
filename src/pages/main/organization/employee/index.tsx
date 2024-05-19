import { AButton } from '@/components/button/AButton';
import { ContainerGradient } from '@/components/container-gradient/ContainerGradient';
import { ContextMenu } from '@/components/context-menu/ContextMenu';
import { EmployeeWithOKR } from '@/components/dashboard-sub-page/DashboardPersonal';
import { EmployeeLabels } from '@/components/employee-labels/EmployeeLabels';
import { EmployeeSummary } from '@/components/employee-summary/EmployeeSummary';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { currencyFormatter } from '@/components/input-number';
import { ModalContentArchiveEmployee } from '@/components/modal/ModalContentArchiveEmployee';
import { ModalContentTransferAllOKR } from '@/components/modal/ModalContentTransferAllOKR';
import { ModalContentUnarchiveEmployee } from '@/components/modal/ModalContentUnarchiveEmployee';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { Pagination } from '@/components/pagination/Pagination';
import { RoleSBType } from '@/components/role-switch-button/RoleSwitchButton';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { calculateOKR, IPagination } from '@/util';
import { Flex, Image, Text } from '@chakra-ui/react';
import { Employee, EmployeeStatus } from 'data-design/src/entity/Employee.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { useEffect, useState } from 'react';
import { getServerSideProps, useSidebarMode, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

interface EmployeeTotalSummary {
  total_employee: number
  total_training_proposal: number
}

export default function(props: WithAdminPageProps) {
  const [modal_archive, setModalArchive] = useState<OnModalReady>();
  const [modal_unachive, setModalUnarchive] = useState<OnModalReady>();
  const [modal_transfer_okr, setModalTransferOKR] = useState<OnModalReady>();
  const is_team_mode = !props.admin.is_ceo && !props.admin.is_hr && props.admin.job_profile?.is_organization_head;
  
  const http_organization_node: useHttpOutput<OrganizationNode[]> = useHttp({
    url: '/onboarding/existing-organization-structure'
  });
  const http_karyawan_total_summary: useHttpOutput<EmployeeTotalSummary> = useHttp({
    url: 'karyawan-summary'
  });
  const http_get_karyawan_w_okr: useHttpOutput<IPagination<EmployeeWithOKR>> = useHttp({
    url: 'karyawan-w-okr'
  });
  const http_get_karyawan: useHttpOutput<IPagination<Employee>> = useHttp({
    url: 'karyawan'
  });
  const http_archive: useHttpOutput<any> = useHttp({
    url: '/karyawan/:id/archive',
    callback() {
      modal_archive?.close();
      http_get_karyawan_w_okr.get({
        query: {
          limit,
          offset: page * limit
        }
      });
    }
  });
  const http_unarchive: useHttpOutput<any> = useHttp({
    url: '/karyawan/:id/unarchive',
    callback() {
      modal_unachive?.close();
      http_get_karyawan_w_okr.get({
        query: {
          limit,
          offset: page * limit
        }
      });
    }
  });
  const http_transfer_all_okr: useHttpOutput<any> = useHttp({
    url: '/karyawan/:id/transfer-all-okr',
    callback() {
      modal_transfer_okr?.close();
      http_get_karyawan_w_okr.get({
        query: {
          limit,
          offset: page * limit
        }
      });
    }
  });

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [selected_employee_modal, setSelectedEmployeeModal] = useState<Employee>();
  const total_page = Math.ceil((http_get_karyawan_w_okr.result?.total ?? 0) / limit);

  function archive() {
    http_archive.put({}, {
      params: {
        id: selected_employee_modal?.id ?? ''
      }
    });
  }

  function unarchive() {
    http_unarchive.put({}, {
      params: {
        id: selected_employee_modal?.id ?? ''
      }
    });
  }

  function transfer_all_okr(destination_employee_id: number) {
    http_transfer_all_okr.put({
      destination_employee_id
    }, {
      params: {
        id: selected_employee_modal?.id ?? ''
      }
    });
  }

  async function getListData(filter?: {[key: string]: any}) {
    http_get_karyawan_w_okr.get({
      query: {
        limit,
        offset: page * limit,
        is_team: is_team_mode,
        ...(filter ?? {})
      }
    });
    http_get_karyawan.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER
      }
    });
    http_karyawan_total_summary.get();
    http_organization_node.get();
  }

  useEffect(() => {
    getListData();
  }, [page, limit, is_team_mode]);

  return (
    <TemplateAuth
      title={'Karyawan'}
      admin={props.admin}>
      <Flex
        direction={'column'}
        p={'12px 12px'}
        pt={0}
        gap={'12px'}>
        <EmployeeSummary
          totalEmployee={http_karyawan_total_summary.result?.total_employee}
          totalTrainingProposal={http_karyawan_total_summary.result?.total_training_proposal} />
        <GeneralContainer title={'Semua Karyawan'}>
          <TableAction
            filterOptions={[{
              type: 'text',
              name: 'name'
            }, {
              type: 'dropdown',
              name: 'organization_node_id',
              options: (http_organization_node.result ?? []).map((o: OrganizationNode) => ({
                label: o.name,
                value: o.id
              }))
            }]}
            onFilter={(key: string, value: string) => getListData({ [key]: value })}
            button={{
              label: '+ Tambah Karyawan',
              onClick() {
                window.location.href = `/main/organization/employee/add`;
              }
            }} />
          <XTable loading={http_get_karyawan_w_okr.loading} data={{
            onRowClick(row: EmployeeWithOKR) {
              window.location.href = `/main/organization/employee/${row.employee.id}`;
            },
            header: [{
              label: 'Nama',
              key: 'nama',
              renderValue(row: EmployeeWithOKR) {
                return (
                  <Flex 
                    align={'center'}
                    gap={'14px'}>
                    <Image 
                      minW={'36px'}
                      minH={'36px'}
                      w={'36px'}
                      h={'36px'}
                      borderRadius={999}
                      objectFit={'cover'}
                      bg={'#EEE'}
                      src={row.employee.photo} />
                    <Text>
                      { row.employee.name }
                    </Text>
                    <EmployeeLabels labels={row.employee.list_label.map(x => x.label)} />
                  </Flex>
                );
              }
            }, {
              label: 'Status',
              key: 'status',
              renderValue(value: EmployeeWithOKR) {
                return value.employee.status;
              }
            }, {
              label: 'Email',
              key: 'email',
              renderValue(value: EmployeeWithOKR) {
                return value.employee.email;
              }
            }, {
              label: 'NIK',
              key: 'nik',
              renderValue(value: EmployeeWithOKR) {
                return value.employee.nik;
              }
            }, {
              label: 'Cont. ROTI',
              key: 'conti-roti',
              renderValue(value: EmployeeWithOKR) {
                return currencyFormatter.format(value.employee.contribution_roti);
              },
            }, {
              label: 'Organisasi',
              key: 'organisasi',
              renderValue(value: EmployeeWithOKR) {
                return value.employee.job_profile?.organization_node?.name;
              },
            }, {
              label: 'Posisi',
              key: 'posisi',
              renderValue(value: EmployeeWithOKR) {
                return value.employee.job_profile?.name;
              },
            }, {
              label: 'OKRs',
              key: 'okrs',
              renderValue(value: EmployeeWithOKR) {
                return value.employee.list_objective?.length ?? 0;
              }
            }, {
              label: 'OKRs Progress',
              key: 'okrs-progress',
              renderValue(value: EmployeeWithOKR) {
                return `${value.okr.toFixed(2)}%`;
              }
            }, {
              label: 'Ikut Training',
              key: 'ikut_training',
              renderValue(value: EmployeeWithOKR) {
                return 0;
              }
            }, {
              label: '',
              key: '',
              renderValue(value: EmployeeWithOKR) {
                return <Flex align={'center'} gap={'12px'}>
                  <AButton variant={'outline'}>
                    Detail
                  </AButton>
                  <ContextMenu 
                    listMenu={[{
                      label: 'Edit',
                      onClick() {
                        window.location.href = `/main/organization/employee/add?edit_id=${value.employee.id}`;
                      }
                    }, {
                      label: 'Arsip',
                      hide: value.employee.status === EmployeeStatus.ARCHIVED,
                      onClick() {
                        setSelectedEmployeeModal(value.employee);
                        modal_archive?.open();
                      }
                    }, {
                      label: 'Aktifkan',
                      hide: value.employee.status === EmployeeStatus.ACTIVE,
                      onClick() {
                        setSelectedEmployeeModal(value.employee);
                        modal_unachive?.open();
                      }
                    }, {
                      label: 'Transfer OKR',
                      onClick() {
                        setSelectedEmployeeModal(value.employee);
                        modal_transfer_okr?.open();
                      }
                    }]} />
                </Flex>
              }
            }],
            data: http_get_karyawan_w_okr.result?.data ?? []
          }} />
          <Pagination 
            page={page} 
            numberOfPages={total_page} 
            limit={limit}
            onLimitChange={setLimit}
            onPageChange={setPage} />
        </GeneralContainer>
      </Flex>
      <ModalInfo
        mdWidth={600}
        title={`Archive Employee`}
        setOnModalReady={setModalArchive}>
        <ModalContentArchiveEmployee 
          loading={http_archive.loading}
          data={selected_employee_modal}
          onSubmit={archive} />
      </ModalInfo>
      <ModalInfo
        mdWidth={600}
        title={`Unarchive Employee`}
        setOnModalReady={setModalUnarchive}>
        <ModalContentUnarchiveEmployee 
          loading={http_unarchive.loading}
          data={selected_employee_modal}
          onSubmit={unarchive} />
      </ModalInfo>
      <ModalInfo
        mdWidth={600}
        title={`Transfer OKR to`}
        setOnModalReady={setModalTransferOKR}>
        <ModalContentTransferAllOKR 
          loading={http_transfer_all_okr.loading}
          employees={http_get_karyawan.result?.data ?? []}
          onSubmit={transfer_all_okr} />
      </ModalInfo>
    </TemplateAuth>
  );
}
