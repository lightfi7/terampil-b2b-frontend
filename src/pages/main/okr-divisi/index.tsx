import { AButton } from '@/components/button/AButton';
import { DashboardCEOData } from '@/components/dashboard-sub-page/DashboardCEO';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Box, Flex, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
import { OKRDivisiCard } from '@/components/okr-divisi-card/OKRDivisiCard';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
export { getServerSideProps };

export interface DivisiSummaryItem {
  organization_node: OrganizationNode
  okr: number
  development_plan: number
  competency: number
}

export default function(props: WithAdminPageProps) {
  const http_summary: useHttpOutput<DivisiSummaryItem[]> = useHttp({
    url: '/dashboard/divisi'
  });

  async function init() {
    http_summary.get();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'OKR Divisi'}>
      <Flex 
        direction={'column'}
        gap={'24px'}
        p={'0 14px'}
        mt={'12px'}>
        <Grid
          gridTemplateColumns={'1fr 1fr'}
          gap={'18px'}>
          {
            (http_summary.result ?? []).map((item: DivisiSummaryItem, i: number) => (
              <GridItem
                key={item.organization_node.id}>
                <OKRDivisiCard
                  i={i}
                  data={item}
                  onClick={() => window.location.href = `/main/okr-divisi/${item.organization_node.id}`} />
              </GridItem>
            ))
          }
        </Grid>
      </Flex>
    </TemplateAuth>
  );
}
