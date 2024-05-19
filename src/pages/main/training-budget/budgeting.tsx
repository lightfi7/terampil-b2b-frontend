import YearPicker from '@/components/date-picker/YearPicker';
import { currencyFormatter } from '@/components/input-number';
import { ModalContentOrgTrainingBudget } from '@/components/modal/ModalContentOrgTrainingBudget';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { genNodeID, OSNodeData } from '@/components/organization-structure-tree/node.utility';
import { OrganizationStructureTree } from '@/components/organization-structure-tree/OrganizationStructureTree';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex, list, Text } from '@chakra-ui/react';
import axios from 'axios';
import { JobProfile } from 'data-design/src/entity/JobProfile.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { TrainingBudget } from 'data-design/src/entity/TrainingBudget.entity';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export interface OrganizationStructureWithBudget {
  organization_node: OrganizationNode
  used_budget: number
}

export default function(props: WithAdminPageProps) {
  const http_get_existing_org_structure: useHttpOutput<OrganizationStructureWithBudget[]> = useHttp({
    url: '/organization-structure-budget'
  });
  const http_post_submit_budget: useHttpOutput<any> = useHttp({
    url: '/organization-budget/:id',
    callback: http_get_existing_org_structure.get
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [year, setYear] = useState<number>(parseInt(moment().format('YYYY')));
  const [modal, setModal] = useState<OnModalReady>();
  const [active_node, setActiveNode] = useState<OSNodeData>();
  const [list_node, setListNode] = useState<OSNodeData[]>([{
    id: genNodeID(),
    label: '',
    position: '',
    photo: '',
    pic: '',
    list_job_profile: []
  }]);
  const active_node_budget = (http_get_existing_org_structure.result ?? [])
    .find(x => String(x.organization_node.id) == active_node?.id)?.organization_node?.
    list_training_budget?.find((tb: TrainingBudget) => tb.year == year)?.budget;
  const total_budget = (http_get_existing_org_structure.result ?? []).reduce((acc: number, node: OrganizationStructureWithBudget) => {
    return acc + +(node?.organization_node?.list_training_budget.find((tb: TrainingBudget) => tb.year == year)?.budget ?? 0);
  }, 0);

  async function submitBudget(year: number, budget: number) {
    if (!active_node) {
      return;
    }
    try {
      setLoading(true);
      await http_post_submit_budget.post({ year, budget }, { params: { id: active_node.id } });
      modal?.close();
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  function onNodeClick(node: OSNodeData) {
    setActiveNode(node);
    modal?.open();
  }

  function renderContent(node: OSNodeData) {
    const list_org: OrganizationStructureWithBudget[] = http_get_existing_org_structure.result ?? [];
    const organization_node: OrganizationStructureWithBudget | undefined = list_org.find((on: OrganizationStructureWithBudget) => String(on.organization_node.id) == node.id);
    const training_budget: TrainingBudget | undefined = organization_node?.organization_node?.list_training_budget.find((tb: TrainingBudget) => tb.year == year);

    return (
      <Flex
        direction={'column'}
        gap={'4px'}
        w={'100%'}>
        <Text
          fontWeight={700}
          fontSize={'1.2em'}>
          { node.label }
        </Text>
        <Flex
          w={'100%'}
          gap={'4px'}>
          <Text
            flex={1}
            fontSize={'1.2em'}>
            Budget
          </Text>
          <Text
            flex={3}
            fontSize={'1.2em'}>
            { currencyFormatter.format(training_budget?.budget ?? 0) }
          </Text>
        </Flex>
        <Flex
          w={'100%'}
          gap={'4px'}>
          <Text
            flex={1}
            fontSize={'1.2em'}>
            Used
          </Text>
          <Text
            flex={3}
            fontSize={'1.2em'}>
            { currencyFormatter.format(organization_node?.used_budget ?? 0) } ({
              (100 * (organization_node?.used_budget ?? 0) / (training_budget?.budget ?? 1)).toFixed(2)
            }%)
          </Text>
        </Flex>
      </Flex>
    );
  }

  useEffect(() => {
    http_get_existing_org_structure.get();
  }, []);

  useEffect(() => {
    if (!http_get_existing_org_structure.result) {
      return;
    }

    setListNode(http_get_existing_org_structure.result.map((org: OrganizationStructureWithBudget) => ({
      id: String(org?.organization_node?.id),
      label: org?.organization_node?.name,
      position: org?.organization_node?.pic_position ?? '',
      pic: org?.organization_node?.pic_name ?? '',
      photo: org?.organization_node?.thumbnail ?? '',
      parent_id: org?.organization_node?.parent?.id ? String(org?.organization_node?.parent.id) : undefined,
      list_job_profile: []
    })));
  }, [http_get_existing_org_structure.result]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Budgeting'}>
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
        <Flex w={'200px'}>
          <YearPicker 
            setValue={(date: Date) => setYear(date.getFullYear())}
            value={moment().set('year', year).toDate()} />
        </Flex>
        <Text>
          Total Budget: <b>{ currencyFormatter.format(total_budget) }</b>
        </Text>
      </Flex>
      <Flex 
        direction={'column'}
        gap={'36px'}>
        <OrganizationStructureTree
          data={list_node}
          onNodeClick={onNodeClick}
          renderContent={renderContent} />
      </Flex>
      <ModalInfo
        title={'Edit Budget'}
        mdWidth={'45%'}
        setOnModalReady={setModal}>
        <ModalContentOrgTrainingBudget
          data={active_node}
          initialBudget={active_node_budget}
          year={year}
          loading={loading}
          onSubmit={submitBudget}
          onCancel={() => modal?.close()} />
      </ModalInfo>
    </TemplateAuth>
  );
}
