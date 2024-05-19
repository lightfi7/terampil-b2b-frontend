import { AButton } from '@/components/button/AButton';
import { XInputSelect } from '@/components/form/input/XInputSelect';
import { XInputText } from '@/components/form/input/XInputText';
import { GroupDataSummary } from '@/components/group-data-summary/GroupDataSummary';
import { ModalContentOrgTreeForm } from '@/components/modal/ModalContentOrgTreeForm';
import { ModalContentOrgTreeSelect } from '@/components/modal/ModalContentOrgTreeSelect';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { generateTreeGeneral, genNodeID, OSNodeData } from '@/components/organization-structure-tree/node.utility';
import { OrganizationStructureTree } from '@/components/organization-structure-tree/OrganizationStructureTree';
import { SelectTree } from '@/components/select-tree/SelectTree';
import { XTable } from '@/components/table/XTable';
import { TemplateAuth } from '@/template-auth';
import { downloadBlob } from '@/util';
import { Button, Flex, Image, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../cookies.util';
export { getServerSideProps };

export namespace EmployeeDBPreviewDTO {
  export interface EmployeeDBPreviewRequestData {
    // 
  }

  export interface Tree {
    org_node: OrganizationNode
    children: Tree[]
  }

  export interface DataSummary {
    total_organization: number
    total_employee: number
    list_job_profile_sum: {
      label: string
      total: number
    }[]
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<OnModalReady>();
  const [root_org, setRootOrg] = useState<EmployeeDBPreviewDTO.Tree>();
  const [list_org, setListOrg] = useState<OrganizationNode[]>([]);
  const [selected_tree_id, setSelectedTreeID] = useState<number[]>([]);
  const [list_employee, setListEmployee] = useState<Employee[]>([]);
  const [q, setQ] = useState<string>('');
  const [summary, setSummary] = useState<EmployeeDBPreviewDTO.DataSummary>({
    total_employee: 0,
    total_organization: 0,
    list_job_profile_sum: []
  });
  const is_selected_all = list_org.length === selected_tree_id.length;

  async function init() {
    setLoading(true);
    try {
      const list_org: OrganizationNode[] = (await axios.get('/onboarding/existing-organization-structure')).data;
      const summary_data: EmployeeDBPreviewDTO.DataSummary = (await axios.get('/onboarding/summary-employee-data')).data;
      const list_org_node: EmployeeDBPreviewDTO.Tree[] = list_org.map((o: OrganizationNode) => ({
        org_node: o,
        children: []
      }));
      const tree_org_root: EmployeeDBPreviewDTO.Tree = generateTreeGeneral<EmployeeDBPreviewDTO.Tree>(
        list_org_node, 
        (x: EmployeeDBPreviewDTO.Tree) => x.org_node.id,
        (x: EmployeeDBPreviewDTO.Tree) => x.org_node.parent?.id,
        (root: EmployeeDBPreviewDTO.Tree, children: EmployeeDBPreviewDTO.Tree[]) => {
          root.children = children;
        }
      );
      setRootOrg(tree_org_root);
      setListOrg(list_org);
      setSummary(summary_data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function getSummaryData() {
    setLoading(true);
    try {
      setListEmployee((await axios.get('/onboarding/get-employee-data', {
        params: {
          q,
          list_organization_id: selected_tree_id
        }
      })).data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    setLoading(true);
    try {
      window.location.href = '/onboarding/check-organization-structure';
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSummaryData();
  }, [q, selected_tree_id]);

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      title={'Create your Organization Structure'}
      admin={props.admin}
      noSidebar>
      <Flex
        direction={'column'}
        gap={'12px'}
        p={'12px'}>
        <Text
          alignSelf={'center'}
          fontWeight={700}
          fontSize={'1.5em'}
          py={'12px'}>
          Employees Database
        </Text>
        <Flex
          fontSize={'.8em'}
          gap={'12px'}>
          <Flex
            boxShadow={'0px 0px 6px 5px rgba(0, 0, 0, 0.08)'}
            borderRadius={5}
            p={'8px 12px'}>
            <Text>
              Total Karyawan Diunggah: <b>{ summary.total_employee }</b>
            </Text>
          </Flex>
          <Flex
            boxShadow={'0px 0px 6px 5px rgba(0, 0, 0, 0.08)'}
            borderRadius={5}
            p={'8px 12px'}>
            <Text>
              Total Struktur Organisasi: <b>{ summary.total_organization }</b>
            </Text>
          </Flex>
        </Flex>
        <GroupDataSummary
          data={summary.list_job_profile_sum.map(x => ({
            label: x.label,
            value: x.total,
            unit: 'Karyawan'
          }))} />
        <Flex
          align={'center'}
          gap={'12px'}
          fontSize={'.9em'}
          p={'12px 18px'}
          borderRadius={6}
          boxShadow={'0px 0px 6px 5px rgba(0, 0, 0, 0.08)'}>
          <Text>
            Filter
          </Text>
          <ModalInfo
            title={'Select Organization'}
            mdWidth={'550px'}
            trigger={
              <Button
                fontSize={'.9em'}
                fontWeight={400}>
                { 
                  is_selected_all 
                  ? 'All Selected' 
                  : (
                    selected_tree_id.length === 0
                    ? 'Select Organization'
                    : selected_tree_id.map((id: number) => list_org.find((o: OrganizationNode) => o.id == id)?.name ?? '').join(', ')
                  )
                }
              </Button>
            }>
            <ModalContentOrgTreeSelect
              data={root_org!}
              selected={selected_tree_id}
              onSelected={setSelectedTreeID}
              getID={(t: EmployeeDBPreviewDTO.Tree) => t.org_node.id }
              getLabel={(t: EmployeeDBPreviewDTO.Tree): string => t.org_node.name }
              getChildren={(t: EmployeeDBPreviewDTO.Tree): EmployeeDBPreviewDTO.Tree[] => t.children } />
          </ModalInfo>
          <XInputSelect 
            containerStyle={{
              padding: 0,
              width: 250,
              paddingLeft: '15px',
              paddingTop: 0,
              paddingBottom: 0
            }}
            key={''} 
            placeholder={'Location'}
            type={"dropdown"} />
          <XInputText
            containerStyle={{
              padding: 0,
              width: 250,
              paddingLeft: '15px',
              paddingTop: 0,
              paddingBottom: 0
            }}
            key={''} 
            placeholder={'Search'}
            type={"text"}
            value={q}
            onChange={setQ} />
        </Flex>
        <XTable 
          loading={loading}
          data={{
            onRowClick(row: Employee) {
              window.location.href = `/main/organization/employee/${row.id}`;
            },
            header: [{
              label: 'ID',
              key: 'id'
            }, {
              label: 'Name',
              key: 'nama',
              renderValue(row: Employee) {
                return (
                  <Flex 
                    align={'center'}
                    gap={'14px'}>
                    <Image 
                      minW={'36px'}
                      minH={'36px'}
                      w={'36px'}
                      h={'36px'}
                      borderRadius={999}
                      objectFit={'cover'}
                      bg={'#EEE'}
                      src={''} />
                    <Text>
                      { row.name }
                    </Text>
                  </Flex>
                );
              }
            }, {
              label: 'Superior',
              key: 'superior'
            }, {
              label: 'Superior ID',
              key: 'superior_id'
            }, {
              label: 'Organisasi',
              key: 'organisasi',
              renderValue(value: Employee) {
                return value.job_profile.organization_node?.name;
              },
            }, {
              label: 'Job Profile',
              key: 'job_profile',
              renderValue(value: Employee) {
                return value.job_profile.name;
              }
            }, {
              label: 'Location',
              key: 'location'
            }, {
              label: 'Email',
              key: 'email'
            }, {
              label: 'Phone Number',
              key: 'phone_number'
            }],
            data: list_employee
          }} />
        <Flex
          mt={'32px'}
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
            Save &amp; Next
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
