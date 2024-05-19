import { AButton } from '@/components/button/AButton';
import { CalendarType } from '@/components/date-picker/calendar-view/CalendarView';
import ComplexDatePicker, { ComplexDateType } from '@/components/date-picker/ComplexDatePicker';
import YearPicker from '@/components/date-picker/YearPicker';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { Pagination } from '@/components/pagination/Pagination';
import { TableAction } from '@/components/table-action/TableAction';
import { TableBudget } from '@/components/table-budget/TableBudget';
import { TableBudgetBulanan } from '@/components/table-budget/TableBudgetBulanan';
import { XTable } from '@/components/table/XTable';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex } from '@chakra-ui/react';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { TrainingProposal, TrainingProposalStatus } from 'data-design/src/entity/TrainingProposal.entity';
import { currencyFormatter } from 'data-design/src/util';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
import { PlanBudgetFinal } from './plan-budget-final';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const http_training_budget_per_organization_node_q: useHttpOutput<PlanBudgetFinal.GroupPerNodeQ[]> = useHttp({
    url: '/training-budget/per-organization-node-q'
  });
  const http_training_budget_per_organization_node_m: useHttpOutput<PlanBudgetFinal.GroupPerNodeM[]> = useHttp({
    url: '/training-budget/per-organization-node-m'
  });
  const http_get_existing_org_structure: useHttpOutput<OrganizationNode[]> = useHttp({
    url: '/organization-structure-existing'
  });

  const [date_picker, setDatePicker] = useState<ComplexDateType>({
    type: CalendarType.YEAR,
    date: moment().startOf('year').toDate(),
    date2: moment().endOf('year').toDate()
  });
  const total_budget = (http_training_budget_per_organization_node_q?.result ?? []).reduce((acc: number, curr: PlanBudgetFinal.GroupPerNodeQ) => {
    return acc + [...curr.q1, ...curr.q2, ...curr.q3, ...curr.q4]
      .filter((tp: TrainingProposal) => tp.status === TrainingProposalStatus.REALIZATION)
      .reduce((acc2: number, curr2: TrainingProposal) => {
        return acc2 + +curr2.proposal_budget;
      }, 0);
  }, 0);

  async function init() {
    http_get_existing_org_structure.get();
    http_training_budget_per_organization_node_q.get({
      query: {
        start_date: date_picker.date,
        end_date: date_picker.date2 ?? new Date(),
      }
    });
    http_training_budget_per_organization_node_m.get({
      query: {
        start_date: date_picker.date,
        end_date: date_picker.date2 ?? new Date(),
      }
    });
  }

  useEffect(() => {
    init();
  }, [date_picker.date, date_picker.date2]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Training & Budget'}>
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
        <PageTitleSubtitle
          title={'Realisasi Budget'}
          subtitle={<span style={{
            color: '#626262'
          }}>
            Total budget yang sudah terserap adalah <span style={{
              fontSize: '1.3em',
              color: '#005CB9',
              fontWeight: 700
            }}>
              { currencyFormatter.format(total_budget) }
            </span>
          </span>} />
        <Flex
          gap={'12px'}>
          <Flex
            w={'350px'}>
            <ComplexDatePicker
              value={date_picker}
              setValue={setDatePicker} />
          </Flex>
        </Flex>
        <GeneralContainer title={'Realisasi Plan Kuartal'}>
          <TableBudget 
            keyword={'Realisasi'}
            organizationData={http_get_existing_org_structure.result}
            data={http_training_budget_per_organization_node_q.result} />
        </GeneralContainer>
        <GeneralContainer title={'Realisasi Plan Bulanan'}>
          <TableBudgetBulanan 
            keyword={'Realisasi'}
            organizationData={http_get_existing_org_structure.result}
            data={http_training_budget_per_organization_node_m.result} />
        </GeneralContainer>
      </Flex>
    </TemplateAuth>
  );
}
