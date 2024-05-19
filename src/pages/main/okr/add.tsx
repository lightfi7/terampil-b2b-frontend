import { AButton } from '@/components/button/AButton';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { useSelectTreeData } from '@/components/form/input/XInputSelectTree';
import { XForm } from '@/components/form/XForm';
import { OKRForm, OKRFormData } from '@/components/pre-form/OKRForm';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex } from '@chakra-ui/react';
import axios from 'axios';
import { Competency } from 'data-design/src/entity/Competency.entity';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { KeyResult } from 'data-design/src/entity/KeyResult.entity';
import { Objective } from 'data-design/src/entity/Objective.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { type, edit_id, is_team } = router.query;
  const is_team_mode = is_team == 'true';

  const http_init_org_node: useHttpOutput<OrganizationNode[]> = useHttp({
    url: '/onboarding/existing-organization-structure'
  });
  const http_okr_relation: useHttpOutput<Objective[]> = useHttp({
    url: '/okr-relation'
  });
  const http_get_one_okr: useHttpOutput<Objective> = useHttp({
    url: '/okr/:id'
  });
  const http_init_employee: useHttpOutput<IPagination<Employee>> = useHttp({
    url: '/karyawan'
  });
  const http_init_competency: useHttpOutput<IPagination<Competency>> = useHttp({
    url: '/competency-dictionary'
  });
  const http_create_okr = useHttp({
    url: '/okr'
  });
  const http_update_okr = useHttp({
    url: '/okr/:id'
  });

  const [data, setData] = useState<OKRFormData.Objective>({
    objective: '',
    start_date: new Date(),
    end_date: new Date(),
    update_period: '' as any,
    weight: '' as any,
    list_key_result: []
  });
  const [organization_id, setOrganizationID] = useState<number>('' as any);
  const [employee_id, setEmployeeID] = useState<number>('' as any);
  const [okr_related_id, setOKRRelatedID] = useState<number>('' as any);
  const tree = useSelectTreeData(http_init_org_node.result);
  const is_relation_okr_disabled = organization_id == tree.root?.org_node.id;

  async function createData() {
    if (edit_id) {
      updateData();
      return;
    }
    try {
      await http_create_okr.post({
        organization_id,
        employee_id,
        parent_id: okr_related_id,
        ...data
      });
      if (is_team) {
        window.location.href = `/main/team/okr`;
      } else {
        window.location.href = `/main/okr?type=${type}`;
      }
    } catch (err: any) {
      alert(err.response.data.toString());
    }
  }

  async function updateData() {
    try {
      await http_update_okr.put({
        parent_id: okr_related_id,
        ...data
      }, {
        params: {
          id: edit_id as string
        }
      });
      if (is_team) {
        window.location.href = `/main/team/okr`;
      } else {
        window.location.href = `/main/okr?type=${type}`;
      }
    } catch (err: any) {
      alert(err.response.data.toString());
    }
  }

  useEffect(() => {
    if (edit_id) {
      http_get_one_okr.get({
        params: {
          id: edit_id as string
        }
      })
    }
  }, [edit_id]);

  useEffect(() => {
    if (http_get_one_okr.result) {
      setEmployeeID(http_get_one_okr.result.employee?.id ?? '' as any);
      setOrganizationID(http_get_one_okr.result.organization_node?.id ?? '' as any);
      setData({
        objective: http_get_one_okr.result.title,
        start_date: http_get_one_okr.result.start_date,
        end_date: http_get_one_okr.result.end_date,
        update_period: http_get_one_okr.result.update_periode,
        weight: http_get_one_okr.result.weight,
        list_key_result: http_get_one_okr.result.list_key_result.map((kr: KeyResult) => ({
          id: kr.id,
          title: kr.title,
          target: kr.target,
          unit: kr.unit,
          update_period: kr.update_periode,
          target_per_period: kr.target_per_periode,
          weight: kr.weight,
          list_competency: kr.list_kr_competency?.map((kc => kc.competency.id)),
        })),
      });
      setOKRRelatedID(http_get_one_okr.result.parent?.id ?? ('' as any));
    }
  }, [http_get_one_okr.result]);

  useEffect(() => {
    http_init_org_node.get();
    http_init_competency.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER
      }
    });
    http_init_employee.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER,
        is_team: is_team_mode
      }
    });
  }, []);

  useEffect(() => {
    if (type === 'karyawan') {
      http_okr_relation.get({
        query: {
          employee_id
        }
      });
    } else {
      http_okr_relation.get({
        query: {
          organization_id
        }
      });
    }
  }, [type, employee_id, organization_id]);

  useEffect(() => {
    if (is_relation_okr_disabled) {
      setOKRRelatedID('' as any);
    }
  }, [is_relation_okr_disabled]);

  return (
    <TemplateAuth
      title={'Create Objective'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Create Objective'} />
        <Flex
          bg={'#FFF'}
          p={'12px 24px'}>
          <XForm 
            forms={[{
              label: 'Organisasi',
              key: 'organisasi',
              placeholder: 'Organisasi',
              type: 'select-tree',
              value: organization_id,
              treeData: tree,
              hide: type === 'karyawan',
              onChange: setOrganizationID
            }, {
              label: 'Employee',
              key: 'organisasi',
              placeholder: 'Employee',
              type: 'dropdown',
              value: employee_id,
              options: http_init_employee.result?.data.map((employee: Employee) => ({
                value: employee.id,
                label: employee.name
              })),
              hide: type !== 'karyawan',
              onChange: setEmployeeID
            }, {
              label: 'Relasi OKR',
              key: 'relasi-okr',
              placeholder: 'Relasi OKR',
              type: 'dropdown',
              hide: is_relation_okr_disabled,
              options: http_okr_relation.result?.filter((obj: Objective) => String(obj.id) !== edit_id).map((obj: Objective) => ({
                value: obj.id,
                label: `${obj.title} - ${obj.employee ? obj.employee?.name : obj.organization_node?.name}`
              })),
              value: okr_related_id,
              onChange: setOKRRelatedID
            }]} />
        </Flex>
        <OKRForm
          title={'Isi Detail Objective'}
          data={data}
          setData={setData}
          listCompetency={http_init_competency.result?.data ?? []} />
        <Flex 
          mt={'8px'}
          justify={'flex-end'}
          gap={'12px'}>
          <AButton 
            onClick={() => window.history.back()}
            variant={'outline'}>
            Batal
          </AButton>
          <AButton 
            isLoading={http_create_okr.loading || http_update_okr.loading}
            onClick={createData}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
