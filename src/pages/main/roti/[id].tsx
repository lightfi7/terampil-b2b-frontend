import YearPicker from '@/components/date-picker/YearPicker';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { currencyFormatter } from '@/components/input-number';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { XTable } from '@/components/table/XTable';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex } from '@chakra-ui/react';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export namespace ROTIOrgNodeData {
  export interface ROTIEmployee {
    employee: Employee
    cost: number
  }
  
  export interface GroupROTIEmployeeNode {
    organization_node: OrganizationNode
    data: ROTIEmployee[]
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;
  
  const http_init: useHttpOutput<ROTIOrgNodeData.GroupROTIEmployeeNode> = useHttp({
    url: `/roti/employee-per-organization/:id`
  });

  const [year, setYear] = useState<number>(parseInt(moment().format('YYYY')));

  async function init() {
    http_init.get({
      query: {
        year
      },
      params: {
        id: id as string
      }
    });
  }

  useEffect(() => {
    init();
  }, [year]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'ROTI'}>
      <PageTitleSubtitle
        title={'Detail ROTI'}
        subtitle={'Detail dan tambah ROTI setiap tahun'} />
      <Flex 
        justify={'space-between'}>
        <Flex>
        <YearPicker 
          setValue={(date: Date) => setYear(date.getFullYear())}
          value={moment().set('year', year).toDate()} />
        </Flex>
      </Flex>
      <GeneralContainer title={`Ringkasan ROTI ${http_init.result?.organization_node.name}`}>
        <XTable 
          loading={http_init.loading}
          data={{
            header: [{
              label: 'Employee Name',
              key: 'node',
              renderValue(row: ROTIOrgNodeData.ROTIEmployee) {
                return row.employee.name;
              }
            }, {
              label: 'Training Program Cost',
              key: 'cost',
              renderValue(row: ROTIOrgNodeData.ROTIEmployee) {
                return currencyFormatter.format(row.cost);
              }
            }, {
              label: 'Employee Benefits Value',
              key: 'benefit',
              renderValue(row: ROTIOrgNodeData.ROTIEmployee) {
                return currencyFormatter.format(row.employee.contribution_roti);
              }
            }, {
              label: 'ROTI',
              key: 'roti',
              renderValue(row: ROTIOrgNodeData.ROTIEmployee) {
                if (row.cost == 0) {
                  return 'Inf';
                }
                return `${(100 * (row.employee.contribution_roti - row.cost) / row.cost).toFixed(2)}%`;
              }
            }],
            data: http_init.result?.data ?? []
          }} />
      </GeneralContainer>
    </TemplateAuth>
  );
}
