import { AButton } from '@/components/button/AButton';
import { ModalContentOrgTreeForm } from '@/components/modal/ModalContentOrgTreeForm';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { dfs, genNodeID, OSNodeData } from '@/components/organization-structure-tree/node.utility';
import { OrganizationStructureTree } from '@/components/organization-structure-tree/OrganizationStructureTree';
import { TemplateAuth } from '@/template-auth';
import { Button, Flex, Image, Link, list, Text } from '@chakra-ui/react';
import axios from 'axios';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
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

  async function init() {
    setLoading(true);
    try {
      const list_org: OrganizationNode[] = (await axios.get('/onboarding/existing-organization-structure')).data;
      if (list_org.length === 0) {
        return;
      }
      setListNode(list_org.map((org: OrganizationNode) => ({
        id: String(org.id),
        label: org.name,
        position: org.pic_position ?? '',
        pic: org.pic_name ?? '',
        photo: org.thumbnail ?? '',
        parent_id: org.parent?.id ? String(org.parent.id) : undefined,
        list_job_profile: []
      })));
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    setLoading(true);
    try {
      await axios.post(`/onboarding/finalize`);
      window.location.href = '/main';
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log(list_node);
  }, [list_node]);

  return (
    <TemplateAuth
      title={'Create your Organization Structure'}
      admin={props.admin}
      noSidebar>
      <Flex
        direction={'column'}>
        <Text
          alignSelf={'center'}
          fontWeight={700}
          fontSize={'1.5em'}
          py={'12px'}>
          Please Double Check the Organization Structure with Employee’s Name Below
        </Text>
        <Flex
          border={'solid 2px #EEE'}
          borderRadius={8}
          direction={'column'}
          m={'5px'}>
          <OrganizationStructureTree
            data={list_node}
            setData={setListNode} />
        </Flex>
        <Flex
          mt={'32px'}
          direction={'column'}
          align={'center'}
          textAlign={'center'}
          color={'#545454'}
          gap={'16px'}>
          <Flex
            align={'center'}
            alignSelf={'center'}
            color={'#545454'}
            gap={'16px'}>
            <Text
              cursor={'pointer'}
              onClick={router.back}>
              Back
            </Text>
            <AButton
              onClick={submit}>
              Submit
            </AButton>
          </Flex>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
