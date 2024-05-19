import { PlanBudgetFinal } from "@/pages/main/training-budget/plan-budget-final";
import { Flex, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { OrganizationNode } from "data-design/src/entity/OrganizationNode.entity";
import { TrainingProposal, TrainingProposalStatus } from "data-design/src/entity/TrainingProposal.entity";
import { currencyFormatter } from "data-design/src/util";
import _ from "lodash";

interface TableBudgetBulananProps {
  keyword?: string
  organizationData?: OrganizationNode[]
  data?: PlanBudgetFinal.GroupPerNodeM[]
}

export function TableBudgetBulanan(props: TableBudgetBulananProps) {
  function getOrganizationName(org_id: number) {
    return (props.organizationData ?? []).find((org: OrganizationNode) => org.id == org_id)?.name ?? '';
  }

  function getTotalPlan(node_q: PlanBudgetFinal.GroupPerNodeM) {
    return _.concat(node_q.m1, node_q.m2, node_q.m3, node_q.m4, node_q.m5, node_q.m6, node_q.m7, node_q.m8, node_q.m9, node_q.m10, node_q.m11, node_q.m12).length;
  }

  function getTotalRealization(node_q: PlanBudgetFinal.GroupPerNodeM) {
    return _.concat(node_q.m1, node_q.m2, node_q.m3, node_q.m4, node_q.m5, node_q.m6, node_q.m7, node_q.m8, node_q.m9, node_q.m10, node_q.m11, node_q.m12).filter(x => x.status === TrainingProposalStatus.REALIZATION).length;
  }

  function getBudgetRealization(node_q: PlanBudgetFinal.GroupPerNodeM) {
    return _.concat(node_q.m1, node_q.m2, node_q.m3, node_q.m4, node_q.m5, node_q.m6, node_q.m7, node_q.m8, node_q.m9, node_q.m10, node_q.m11, node_q.m12).filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc: number, tp: TrainingProposal) => acc + +tp.proposal_budget, 0);
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
              props.data?.map((node_q: PlanBudgetFinal.GroupPerNodeM) => (
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
                Jan Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                colSpan={2}
                fontWeight={600}
                textAlign={'center'}>
                Jan { props.keyword ?? 'Diajukan' }
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Feb Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Feb { props.keyword ?? 'Diajukan' }
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Mar Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Mar { props.keyword ?? 'Diajukan' }
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Apr Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Apr { props.keyword ?? 'Diajukan' }
              </Td>

              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Mei Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Mei { props.keyword ?? 'Diajukan' }
              </Td>

              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Jun Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Jun { props.keyword ?? 'Diajukan' }
              </Td>

              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Jul Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Jul { props.keyword ?? 'Diajukan' }
              </Td>

              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Agu Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Agu { props.keyword ?? 'Diajukan' }
              </Td>

              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Sep Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Sep { props.keyword ?? 'Diajukan' }
              </Td>

              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Okt Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Okt { props.keyword ?? 'Diajukan' }
              </Td>

              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Nov Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Nov { props.keyword ?? 'Diajukan' }
              </Td>

              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}>
                Des Plan
              </Td>
              <Td
                border={'solid 1px #EEE'}
                p={'8px 12px'}
                whiteSpace={'nowrap'}
                fontWeight={600}
                colSpan={2}
                textAlign={'center'}>
                Des { props.keyword ?? 'Diajukan' }
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
              props.data?.map((node_q: PlanBudgetFinal.GroupPerNodeM) => (
                <Tr key={node_q.organization_node_id}>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m1.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m1.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m1.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m2.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m2.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m2.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m3.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m3.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m3.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m4.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m4.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m4.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>

                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m5.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m5.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m5.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>

                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m6.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m6.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m6.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>

                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m7.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m7.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m7.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>

                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m8.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m8.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m8.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>

                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m9.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m9.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m9.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>

                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m10.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m10.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m10.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>

                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m11.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m11.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m11.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
                      )
                    }
                  </Td>

                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m12.length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    { node_q.m12.filter(x => x.status === TrainingProposalStatus.REALIZATION).length }
                  </Td>
                  <Td
                    border={'solid 1px #EEE'}
                    p={'8px 12px'}
                    whiteSpace={'nowrap'}>
                    {
                      currencyFormatter.format(
                        node_q.m12.filter(x => x.status === TrainingProposalStatus.REALIZATION).reduce((acc, x) => acc + +x.proposal_budget, 0)
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
