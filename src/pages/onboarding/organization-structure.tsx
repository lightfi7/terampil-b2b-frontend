import { AButton } from '@/components/button/AButton';
import { XInputFile } from '@/components/form/input/XInputFile';
import { ModalContentOrgTreeForm } from '@/components/modal/ModalContentOrgTreeForm';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { dfs, generateTreeGeneral, genNodeID, OSNodeData } from '@/components/organization-structure-tree/node.utility';
import { OrganizationStructureTree } from '@/components/organization-structure-tree/OrganizationStructureTree';
import { TemplateAuth } from '@/template-auth';
import { downloadBlob, getExcelBuffer } from '@/util';
import { Button, Flex, Image, Link, list, Text } from '@chakra-ui/react';
import axios from 'axios';
import { JobProfile } from 'data-design/src/entity/JobProfile.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../cookies.util';
import { Parser, parse } from 'csv-parse';
export { getServerSideProps };

export namespace OnboardingOrganizationStructureDTO {
  export interface OnboardingOrganizationStructureRequestData {
    // 
  }
  
  export interface CSVItem {
    id: string
    parent_id: string
    organization_node: string
    pic_name: string
    pic_position: string
    photo: string
    address: string
  }
}

let parser: Parser;
let parser_ongoing: boolean = false;
export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const [finish_interrupt, setFinishInterrupt] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<OnModalReady>();
  const [active_node, setActiveNode] = useState<OSNodeData>();
  const [csv_file, setCSVFile] = useState<any>();
  const [progress, setProgress] = useState<number>(0);
  const [uploaded, setUploaded] = useState<boolean>(false);
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
        list_job_profile: org.list_job_profile.map((jp: JobProfile) => ({
          title: jp.name,
          id: jp.id
        })),
        head_index: org.list_job_profile.findIndex((jp: JobProfile) => jp.is_organization_head)
      })));
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

  function onNodeChangeFromModal() {
    setListNode(list_node.map((node: OSNodeData) => {
      if (node.id === active_node?.id) {
        return {
          ...node,
          ...active_node
        }
      }
      return node;
    }));
    modal?.close();
  }

  async function submit() {
    setLoading(true);
    try {
      const temp_children_data: {[key: string]: OSNodeData[]} = {};
      const tree = generateTreeGeneral<OSNodeData>(
        list_node,
        node => node.id,
        node => node.parent_id,
        (t: OSNodeData, lt: OSNodeData[]) => temp_children_data[t.id] = lt
      );
      const list_org: OrganizationNode[] = (await axios.post(`/onboarding/organization-structure`, {
        list_node: dfs(tree, list_node)
      })).data;
      downloadSampleUploadCSV(list_org);
      window.location.href = '/onboarding/employee-database';
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  function downloadSampleUploadCSV(list_org: OrganizationNode[]) {
    if (list_org.length === 0) {
      return;
    }

    const list_jp = list_org.reduce((ljp: JobProfile[], o: OrganizationNode) => [...ljp, ...o.list_job_profile], []);  
    downloadBlob(getExcelBuffer([{
      title: 'Isi Daftar Karyawan',
      header: [
        'id',
        'job_profile_id',
        'name',
        'email',
        'phone_number',
        'address',
      ],
      data: list_org.map((org: OrganizationNode) => ({
        id: org.id,
        job_profile_id: org.list_job_profile[0].id,
        name: org.pic_name,
        email: '',
        phone_number: '',
        address: '',
      })) as any
    }, {
      title: 'Daftar Job Profile',
      header: [
        'id',
        'job_profile_name',
        'organization_name'
      ],
      data: list_jp.map((jp: JobProfile) => ({
        id: jp.id,
        job_profile_name: jp.name,
        organization_name: list_org.find(x => x.list_job_profile.map(y => y.id).includes(jp.id))?.name
      })) as any
    }]), 'organization-job-profile-list.xlsx');
  }

  function downloadOrganizationStructureSample() {
    downloadBlob(getExcelBuffer([{
      title: 'Isi Struktur Organisasi',
      header: [
        'id',
        'parent_id',
        'organization_node',
        'pic_name',
        'pic_position',
        'photo',
        'address',
      ],
      data: [] as any
    }]), 'organization-structure.xlsx');
  }

  function cleanParser() {
    if (!parser) {
      return;
    }
    parser_ongoing = false;
    parser.removeAllListeners();
    parser.end();
    parser.destroy();
  }

  function parseCSVFile() {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const csv_string: string = event.target.result as string;
      const lines = csv_string.split("\n");
      const size = lines.length;
      const temp_data: OnboardingOrganizationStructureDTO.CSVItem[] = [];

      // Initialize the parser
      cleanParser();
      setProgress(0);
      setUploaded(false);
      parser = parse({ delimiter: [',', ';'], columns: true });

      // Use the readable stream api to consume records
      parser.on('readable', function() {
        parser_ongoing = true;
        let record: OnboardingOrganizationStructureDTO.CSVItem;
        const parseData = () => {
          if (!parser_ongoing) {
            return;
          }
          record = parser.read();
          if (!record) {
            return;
          }
          temp_data.push(record);
          const percentage = Math.ceil(100 * temp_data.length / size);
          if (percentage !== progress) {
            setProgress(percentage);
          }
          requestAnimationFrame(parseData);
        };
        requestAnimationFrame(parseData);
      });

      // Catch any error
      parser.on('error', function(err) {
        console.error(err.message);
      });

      // Test that the parsed records matched the expected records
      parser.on('end', function() {
        setProgress(100);
        cleanParser();
        parseCSVToTree(temp_data.filter(x => Boolean(x.id)));
      });

      // Write data to the stream
      parser.write(csv_string);

      // Close the readable stream
      parser.end();
    };
    reader.onerror = error => console.error(error);
    reader.readAsText(csv_file);
  }

  function parseCSVToTree(data: OnboardingOrganizationStructureDTO.CSVItem[]) {
    setListNode(data.map((item: OnboardingOrganizationStructureDTO.CSVItem) => ({
      id: item.id,
      parent_id: item.parent_id,
      label: item.organization_node,
      position: item.pic_position,
      photo: item.photo,
      pic: item.pic_name,
      address: item.address,
      list_job_profile: []
    })))
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log(list_node);
  }, [list_node]);


  const onBackButtonEvent = (e: any) => {
    e.preventDefault();
    if (!finish_interrupt) {
      if (window.confirm("Do you want to go back ?")) {
        setFinishInterrupt(true);
      } else {
        setFinishInterrupt(false);
      }
    }
  }
  
  useEffect(() => {
    (window.history.pushState as any)(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);  
    };
  }, []);

  useEffect(() => {
    if (!csv_file) {
      return;
    }
    parseCSVFile();
  }, [csv_file]);

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
          Create Your Organization Structure
        </Text>
        <Flex
          border={'solid 2px #EEE'}
          borderRadius={8}
          direction={'column'}
          m={'5px'}>
          <OrganizationStructureTree
            data={list_node}
            setData={setListNode}
            onNodeClick={onNodeClick} />
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
        </Flex>
        <Flex
          mt={'32px'}
          direction={'column'}
          align={'center'}
          textAlign={'center'}
          color={'#545454'}
          gap={'16px'}>
          <Text
            fontWeight={500}>
            or submit your Organization Structure from excel file
          </Text>
          <Text
            fontSize={'.9em'}>
            make sure you follow the guidelines<br/>
            Download the org. structure guideline & format <Link onClick={downloadOrganizationStructureSample}>here</Link>
          </Text>
          <Flex
            direction={'column'}>
            <XInputFile 
              containerStyle={{
                padding: 0,
                width: 250,
                paddingLeft: '15px',
                paddingTop: 0,
                paddingBottom: 0
              }}
              key={''} 
              onChange={setCSVFile}
              placeholder={'Upload CSV'}
              type={"file"} />
            <Text
              fontSize={'.8em'}
              color={'#9A9A9A'}>
              .csv maksimal 5MB
            </Text>
          </Flex>
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
              Submit
            </AButton>
          </Flex>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
