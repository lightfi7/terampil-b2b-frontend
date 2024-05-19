import { PlanBudgetFinal } from "@/pages/main/training-budget/plan-budget-final";
import { Flex, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { OrganizationNode } from "data-design/src/entity/OrganizationNode.entity";
import { TrainingProposal, TrainingProposalStatus } from "data-design/src/entity/TrainingProposal.entity";
import { currencyFormatter } from "data-design/src/util";
import _ from "lodash";

interface TableBudgetProps {
  keyword?: string
  organizationData?: OrganizationNode[]
  data?: PlanBudgetFinal.GroupPerNodeQ[]
}

export function TableBudget(props: TableBudgetProps) {
  function getOrganizationName(org_id: number) {
    return (props.organizationData ?? []).find((org: OrganizationNode) => org.id == org_id)?.name ?? '';
  }

  function getTotalPlan(node_q: PlanBudgetFinal.GroupPerNodeQ) {
    return _.concat(node_q.q1, node_q.q2, node_q.q3, node_q.q4).length;
  }

  function getTotalRealization(node_q: PlanBudgetFinal.GroupPerNodeQ) {
    return _.concat(node_q.q1, node_q.q2, node_q.q3, node_q.q4).filter(x => x.status === TrainingProposalStatus.REALIZATION).length;
  }

  function getBudgetRealization(node_q: PlanBudgetFinal.GroupPerNodeQ) {
    return _.concat(node_q.q1, node_q.q2, node_q.q3, node_q.q4).filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc: number, tp: TrainingProposal) => acc + +tp.proposal_budget, 0);
  }

  return (
    <Flex
      fontSize={'.85em'}>
      <Flex>
        <Table
          border={'solid 1px #EEE'}>
          <Thead
            bg={'#E5E5E5'}>
            <Tr>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                rowSpan={2}
                fontWeight={600}
                textAlign={'center'}>
                Org. Node
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Total Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                colSpan={2}
                fontWeight={600}
                textAlign={'center'}>
                Total { props.keyword ?? 'Diajukan' }
              </Td>
            </Tr>
            <Tr>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Cost
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            {
              props.data?.map((node_q: PlanBudgetFinal.GroupPerNodeQ) => (
                <Tr 
                  key={node_q.organization_node_id}>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { getOrganizationName(node_q.organization_node_id) }
                  </Td>
                  <Td
                    bg={'rgba(0, 92, 185, 0.2)'}
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { getTotalPlan(node_q) }
                  </Td>
                  <Td
                    bg={'rgba(0, 92, 185, 0.2)'}
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { getTotalRealization(node_q) }
                  </Td>
                  <Td
                    bg={'rgba(0, 92, 185, 0.2)'}
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { currencyFormatter.format(getBudgetRealization(node_q)) }
                  </Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </Flex>
      <Flex
        flex={1}
        overflowX={'auto'}>
        <Table>
          <Thead
            bg={'#E5E5E5'}>
            <Tr>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Q1 Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                colSpan={2}
                fontWeight={600}
                textAlign={'center'}>
                Q1 { props.keyword ?? 'Diajukan' }
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Q2 Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Q2 { props.keyword ?? 'Diajukan' }
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Q3 Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Q3 { props.keyword ?? 'Diajukan' }
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Q4 Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Q4 { props.keyword ?? 'Diajukan' }
              </Td>
            </Tr>
            <Tr>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Cost
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Cost
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Cost
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Jumlah
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}>
                Cost
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            {
              props.data?.map((node_q: PlanBudgetFinal.GroupPerNodeQ) => (
                <Tr key={node_q.organization_node_id}>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.q1.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.q1.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.q1.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.q2.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.q2.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.q2.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.q3.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.q3.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.q3.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.q4.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.q4.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.q4.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
}
