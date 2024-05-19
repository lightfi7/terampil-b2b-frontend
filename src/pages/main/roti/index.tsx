import YearPicker from '@/components/date-picker/YearPicker';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { currencyFormatter, numberFormatter } from '@/components/input-number';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { XTable } from '@/components/table/XTable';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex, Text } from '@chakra-ui/react';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export namespace ROTIData {
  export interface GroupROTIPerNode {
    organization_node?: OrganizationNode
    benefit: number
    cost: number
  }
}

export default function(props: WithAdminPageProps) {
  const http_init: useHttpOutput<ROTIData.GroupROTIPerNode[]> = useHttp({
    url: '/roti/summary'
  });

  const [year, setYear] = useState<number>(parseInt(moment().format('YYYY')));
  const total_benefit = http_init?.result?.reduce((acc: number, node: ROTIData.GroupROTIPerNode) => acc + +node.benefit, 0) ?? 0;
  const total_cost = http_init?.result?.reduce((acc: number, node: ROTIData.GroupROTIPerNode) => acc + +node.cost, 0) ?? 0;
  const total_roti = 100 * (total_benefit - total_cost) / total_cost;

  async function init() {
    http_init.get({
      query: {
        year
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
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
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
        <Flex direction={'column'}>
          <Text>
            Total Cost: <b>{ currencyFormatter.format(total_cost) }</b>
          </Text>
          <Text>
            Total Benefit: <b>{ currencyFormatter.format(total_benefit) }</b>
          </Text>
          <Text>
            Total ROTI <b>{ numberFormatter.format(total_roti) }%</b>
          </Text>
        </Flex>
        <GeneralContainer title={'Ringkasan ROTI '}>
          <XTable 
            loading={http_init.loading}
            data={{
              onRowClick(row: ROTIData.GroupROTIPerNode) {
                window.location.href = `roti/${row.organization_node?.id}`;
              },
              header: [{
                label: 'Organization Node',
                key: 'node',
                renderValue(row: ROTIData.GroupROTIPerNode) {
                  return row.organization_node?.name;
                }
              }, {
                label: 'Training Program Cost',
                key: 'cost',
                renderValue(row: ROTIData.GroupROTIPerNode) {
                  return currencyFormatter.format(row.cost);
                }
              }, {
                label: 'Employee Benefits Value',
                key: 'benefit',
                renderValue(row: ROTIData.GroupROTIPerNode) {
                  return currencyFormatter.format(row.benefit);
                }
              }, {
                label: 'ROTI',
                key: 'roti',
                renderValue(row: ROTIData.GroupROTIPerNode) {
                  if (row.cost == 0) {
                    return 'Inf';
                  }
                  return `${(100 * (row.benefit - row.cost) / row.cost).toFixed(2)}%`;
                }
              }],
              data: http_init.result ?? []
            }} />
        </GeneralContainer>
      </Flex>
    </TemplateAuth>
  );
}
