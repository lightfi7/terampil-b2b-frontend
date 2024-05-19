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
import { MainExsumList } from '@/components/exsum-list/MainExsumList';
export { getServerSideProps };

export namespace ExSumData {
  export interface ExecutiveSummarySummaryItemEmployee {
    name: string
    job_profile_title: string
    complete_rate: number
    development_cost: number
    l1: number
    l2: number
    l3: number
    l4: number
    l1_old: number
    l2_old: number
    l3_old: number
    l4_old: number
    roti: number
    roti_old: number
  }
  
  export interface ExecutiveSummarySummaryItem {
    organization_node: OrganizationNode
    okr: number
    development_plan: number
    competency: number
    employees: ExecutiveSummarySummaryItemEmployee[]
  }
}

export default function(props: WithAdminPageProps) {
  const http_init: useHttpOutput<ExSumData.ExecutiveSummarySummaryItem[]> = useHttp({
    url: '/dashboard/executive-summary'
  });

  const [year, setYear] = useState<number>(parseInt(moment().format('YYYY')));

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
      noSidebar
      title={'Executive Summary'}>
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
        <PageTitleSubtitle
          title={'Executive Summary'}
          subtitle={'Detail Executive Summary'} />
        <Flex 
          justify={'space-between'}>
          <Flex>
          <YearPicker 
            setValue={(date: Date) => setYear(date.getFullYear())}
            value={moment().set('year', year).toDate()} />
          </Flex>
        </Flex>
        <MainExsumList data={http_init.result} />
      </Flex>
    </TemplateAuth>
  );
}
