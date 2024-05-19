import { AButton } from '@/components/button/AButton';
import { CalendarType } from '@/components/date-picker/calendar-view/CalendarView';
import ComplexDatePicker, { ComplexDateType } from '@/components/date-picker/ComplexDatePicker';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { currencyFormatter } from '@/components/input-number';
import { useSelectTreeData, XInputSelectTree } from '@/components/form/input/XInputSelectTree';
import { OrganizationStructureTree } from '@/components/organization-structure-tree/OrganizationStructureTree';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import TerampilPieChart, { PieChartItem } from '@/components/terampil-pie-chart/TerampilPieChart';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Box, Flex, Text } from '@chakra-ui/react';
import { LibraryCategory } from 'data-design/src/entity/Library.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
import { dfsGeneral, flattenTreeGeneral, generateTreeGeneral } from '@/components/organization-structure-tree/node.utility';
export { getServerSideProps };

export const colors: string[] = [
  '#00DEBF',
  '#F18F01',
  '#29C56A',
  '#E84F52',
  '#7AA1DD',
  '#7AA1DD',
  '#7AA1DD',
  '#7AA1DD',
]

export namespace PlanBudgetFinal {
  export interface GroupCategory {
    category: LibraryCategory
    q1: TrainingProposal[]
    q2: TrainingProposal[]
    q3: TrainingProposal[]
    q4: TrainingProposal[]
  }
  export interface GroupPerNode {
    organization_node_id: number
    organization_parent_node_id?: number
    data: TrainingProposal[]
  }
  export interface OrganizationTrainingBudget {
    organization: OrganizationNode
    data: TrainingProposal[]
  }
  export interface GroupPerNodeQ {
    organization_node_id: number
    q1: TrainingProposal[]
    q2: TrainingProposal[]
    q3: TrainingProposal[]
    q4: TrainingProposal[]
  }
  export interface GroupPerNodeM {
    organization_node_id: number
    m1: TrainingProposal[]
    m2: TrainingProposal[]
    m3: TrainingProposal[]
    m4: TrainingProposal[]
    m5: TrainingProposal[]
    m6: TrainingProposal[]
    m7: TrainingProposal[]
    m8: TrainingProposal[]
    m9: TrainingProposal[]
    m10: TrainingProposal[]
    m11: TrainingProposal[]
    m12: TrainingProposal[]
  }
}

const children_map: {[key: string | number]: any} = {};
export default function(props: WithAdminPageProps) {
  const http_training_budget_per_organization_node: useHttpOutput<PlanBudgetFinal.GroupPerNode[]> = useHttp({
    url: '/training-budget/per-organization-node',
    callback() {
      getOnlyTreeAndChildren();
    },
  });
  const http_get_existing_org_structure: useHttpOutput<OrganizationNode[]> = useHttp({
    url: '/organization-structure-existing'
  });
  const http_init_org: useHttpOutput<OrganizationNode[]> = useHttp({
    url: '/onboarding/existing-organization-structure'
  });

  const tree = useSelectTreeData(http_init_org.result ?? []);
  const [organization_id, setOrganizationID] = useState<number>('' as any);
  const [filtered_org_node, setFilteredOrgNode] = useState<OrganizationNode[]>([]);
  const [date_picker, setDatePicker] = useState<ComplexDateType>({
    type: CalendarType.YEAR,
    date: moment().startOf('year').toDate(),
    date2: moment().endOf('year').toDate()
  });
  const total_budget = (http_training_budget_per_organization_node?.result ?? []).reduce((acc: number, curr: PlanBudgetFinal.GroupPerNode) => {
    return acc + curr.data.reduce((acc2: number, curr2: TrainingProposal) => {
      return acc2 + +curr2.proposal_budget;
    }, 0)
  }, 0);
  const chart_data = (http_training_budget_per_organization_node?.result ?? []).map((gc: PlanBudgetFinal.GroupPerNode, i: number) => ({
    name: (http_get_existing_org_structure.result ?? []).find(x => x.id == gc.organization_node_id)?.name ?? '',
    value: gc.data.reduce((acc: number, curr: TrainingProposal) => acc + +curr.proposal_budget, 0),
    color: colors[i]
  }));

  function getOnlyTreeAndChildren() {
    if (!http_get_existing_org_structure?.result) {
      return;
    }
    const organization_node_selected = http_get_existing_org_structure.result.find((o: OrganizationNode) => o.id == organization_id);
    if (!organization_node_selected) {
      return;
    }
    generateTreeGeneral<OrganizationNode>(
      http_get_existing_org_structure?.result,
      (t: OrganizationNode) => t.id,
      (t: OrganizationNode) => t.parent?.id,
      (t: OrganizationNode, children: OrganizationNode[]) => {
        children_map[t.id] = children;
      },
    );
    const budget_flatten = flattenTreeGeneral(
      organization_node_selected, 
      (t: OrganizationNode) => children_map[t.id]
    );
    setFilteredOrgNode(budget_flatten);
  }

  useEffect(() => {
    http_get_existing_org_structure.get();
    http_init_org.get();
  }, []);

  useEffect(() => {
    if (!organization_id) {
      return;
    }
    http_training_budget_per_organization_node.get({
      query: {
        start_date: date_picker.date,
        end_date: date_picker.date2 ?? new Date(),
        root_organization_id: organization_id
      }
    });
  }, [date_picker.date, date_picker.date2, organization_id]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Plan & Budget Final'}>
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
        <Flex
          gap={'12px'}>
          <Flex
            w={'350px'}>
            <ComplexDatePicker
              value={date_picker}
              setValue={setDatePicker} />
          </Flex>
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
        <GeneralContainer title={'Budget yang diajukan'}>
          <Flex
            align={'center'}
            gap={'6px'}>
            <Text
              fontSize={'.88em'}>
              Total budget yang dipakai:
            </Text>
            <Text
              color={'brand'}
              fontWeight={700}
              fontSize={'1.3em'}>
              { currencyFormatter.format(total_budget) }
            </Text>
          </Flex>
          <Flex
            gap={'5%'}>
            <TerampilPieChart 
              data={chart_data}
              centerValue={''} />
            <Flex 
              direction={'column'}
              alignSelf={'center'}
              color={'#373737'}
              gap={'24px'}
              flex={1}>
              {
                _.chunk(chart_data, 4).map((items: PieChartItem[], i: number) => (
                  <Flex 
                    key={i}
                    direction={'row'}>
                    {
                      items.map((item: PieChartItem, j: number) => (
                        <Flex 
                          w={'25%'}
                          key={`${i}-${j}`}
                          gap={'12px'}>
                          <Box 
                            bg={item.color}
                            w={'10px'}
                            h={'10px'}
                            mt={'5px'}
                            borderRadius={999} />
                          <Flex 
                            direction={'column'}>
                            <Text
                              fontSize={'.8em'}>
                              { item.name }
                            </Text>
                            <Text
                              fontSize={'1em'}>
                              { currencyFormatter.format(item.value) }
                            </Text>
                          </Flex>
                        </Flex>
                      )) 
                    }
                  </Flex>
                ))
              }
            </Flex>
          </Flex>
        </GeneralContainer>
        <GeneralContainer title={'Plan & Budget Final'}>
          <XTable loading={http_training_budget_per_organization_node.loading} data={{
            onRowClick(row: OrganizationNode) {
              window.location.href = `plan-budget-final/${row.id}`;
            },
            header: [{
              label: 'Organization Node',
              key: 'org-node',
              renderValue(node: OrganizationNode) {
                return node.name;
              }
            }, {
              label: 'Training Budget',
              key: 'training-budget',
              renderValue(node: OrganizationNode) {
                return currencyFormatter.format(node.list_training_budget.find(x => x.year == date_picker.date.getFullYear() || x.year == date_picker.date2?.getFullYear())?.budget ?? 0);
              }
            }, {
              label: 'Training Cost',
              key: 'training-cost',
              renderValue(node: OrganizationNode) {
                const list_training = http_training_budget_per_organization_node.result?.find((gc: PlanBudgetFinal.GroupPerNode) => gc.organization_node_id == node.id)?.data;
                return currencyFormatter.format(list_training?.reduce((acc: number, curr: TrainingProposal) => acc + +(curr.proposal_budget ?? 0), 0) ?? 0);
              }
            }, {
              label: 'Total Plan',
              key: 'total_plan',
              renderValue(node: OrganizationNode) {
                const list_training = http_training_budget_per_organization_node.result?.find((gc: PlanBudgetFinal.GroupPerNode) => gc.organization_node_id == node.id)?.data;
                return Object.keys(_.groupBy(list_training, x => x.library.id)).length;
              }
            }, {
              label: 'Total Peserta',
              key: 'total_peserta',
              renderValue(node: OrganizationNode) {
                return http_training_budget_per_organization_node.result?.find((gc: PlanBudgetFinal.GroupPerNode) => gc.organization_node_id == node.id)?.data.length ?? 0;
              }
            }, {
              label: '',
              key: 'q3',
              renderValue() {
                return (
                  <AButton variant={'outline'}>
                    Detail
                  </AButton>
                );
              }
            }],
            data: filtered_org_node ?? []
          }} />
        </GeneralContainer>
      </Flex>
    </TemplateAuth>
  );
}
