import { ModalContentOrgTreeForm } from '@/components/modal/ModalContentOrgTreeForm';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { genNodeID, OSNodeData } from '@/components/organization-structure-tree/node.utility';
import { OrganizationStructureTree } from '@/components/organization-structure-tree/OrganizationStructureTree';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex, list, Text } from '@chakra-ui/react';
import axios from 'axios';
import { JobProfile } from 'data-design/src/entity/JobProfile.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const http_existing_organization_structure = useHttp<OrganizationNode[]>({
    url: '/onboarding/existing-organization-structure'
  });
  const http_update_organization_structure = useHttp<any>({
    url: '/organization-structure'
  });
  const delete_organization_structure = useHttp<any>({
    url: `/organization-structure/:id`
  });
  const update_organization_structure = useHttp<any>({
    url: `/organization-structure/:id`
  });

  const [list_node, setListNode] = useState<OSNodeData[]>([{
    id: genNodeID(),
    label: '',
    position: '',
    photo: '',
    pic: '',
    list_job_profile: []
  }]);

  const [modal, setModal] = useState<OnModalReady>();
  const [active_node, setActiveNode] = useState<OSNodeData>();

  function onNodeClick(node: OSNodeData) {
    setActiveNode(node);
    modal?.open();
  }

  async function init() {
    http_existing_organization_structure.get();
  }

  async function deleteNodes(nodes: OSNodeData[]) {
    try {
      // for (const node of nodes.reverse()) {
      //   await delete_organization_structure.del({
      //     params: {
      //       id: node.id
      //     }
      //   });
      // }
    } catch (err: any) {
      alert(err.response.data.toString());
    }
  }
  
  function onNodeChangeFromModal() {
    const node: OSNodeData | undefined = list_node.find((node: OSNodeData) => {
      return node.id === active_node?.id
    });
    setListNode(list_node.map((node: OSNodeData) => {
      if (node.id === active_node?.id) {
        return {
          ...node,
          ...active_node
        }
      }
      return node;
    }));
    update_organization_structure.put({
      name: active_node?.label,
      list_job_profile: (active_node?.list_job_profile ?? []).map(jp => ({
        id: jp.id,
        name: jp.title
      })),
      pic_position: active_node?.position
    }, {
      params: {
        id: active_node?.id as any
      }
    })
    modal?.close();
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!http_existing_organization_structure.result) {
      return;
    }
    setListNode((http_existing_organization_structure.result).map((org: OrganizationNode) => ({
      id: String(org.id),
      label: org.name,
      position: org.pic_position ?? '',
      pic: org.pic_name ?? '',
      photo: org.thumbnail ?? '',
      parent_id: org.parent?.id ? String(org.parent.id) : undefined,
      list_job_profile: org.list_job_profile.map((jp: JobProfile) => ({
        id: jp.id,
        title: jp.name
      })),
      head_index: org.list_job_profile.findIndex((jp: JobProfile) => jp.is_organization_head)
    })));
  }, [http_existing_organization_structure.result]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Organization Structure'}>
      <Flex 
        direction={'column'}
        gap={'36px'}>
        <OrganizationStructureTree
          data={list_node}
          setData={setListNode}
          onNodeClick={onNodeClick}
          onDeleteNodes={deleteNodes} />
        <ModalInfo
          title={'Detail'}
          mdWidth={'60%'}
          setOnModalReady={setModal}>
          <ModalContentOrgTreeForm
            data={active_node}
            setData={setActiveNode}
            onSubmit={onNodeChangeFromModal}
            onCancel={() => modal?.close()} />
        </ModalInfo>
        <Flex gap={'24px'}>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
