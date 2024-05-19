import { AButton } from '@/components/button/AButton';
import { XInputFile } from '@/components/form/input/XInputFile';
import { ModalContentOrgTreeForm } from '@/components/modal/ModalContentOrgTreeForm';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { genNodeID, OSNodeData } from '@/components/organization-structure-tree/node.utility';
import { TemplateAuth } from '@/template-auth';
import { downloadBlob } from '@/util';
import { Button, Flex, Image, Link, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Parser, parse } from 'csv-parse';
import { getServerSideProps, WithAdminPageProps } from '../../../cookies.util';
import axios from 'axios';
export { getServerSideProps };

export namespace OnboardingEmployeeDatabaseDTO {
  export interface OnboardingEmployeeDatabaseRequestData {
    // 
  }
  
  export interface CSVItem {
    id: string
    job_profile_id: string
    name: string
    email: string
    phone_number: string
    address: string
  }
}

let parser: Parser;
let parser_ongoing: boolean = false;
export default function(props: WithAdminPageProps) {
  const router = useRouter();
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
  const [csv_data, setCSVData] = useState<OnboardingEmployeeDatabaseDTO.CSVItem[]>([]);

  async function init() {
    setLoading(true);
    try {
      // setListRole((await axios.get('/role')).data.data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    setLoading(true);
    try {
      await axios.post('/onboarding/employee-data', { csv_data });
      window.location.href = '/onboarding/employee-database-preview';
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
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
      const temp_data: OnboardingEmployeeDatabaseDTO.CSVItem[] = [];

      // Initialize the parser
      cleanParser();
      setProgress(0);
      setUploaded(false);
      parser = parse({ delimiter: [',', ';'], columns: true });

      // Use the readable stream api to consume records
      parser.on('readable', function() {
        parser_ongoing = true;
        let record: OnboardingEmployeeDatabaseDTO.CSVItem;
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
        setCSVData(temp_data.filter(x => Boolean(x.id) && Boolean(x.email) && Boolean(x.job_profile_id)));
      });

      // Write data to the stream
      parser.write(csv_string);

      // Close the readable stream
      parser.end();
    };
    reader.onerror = error => console.error(error);
    reader.readAsText(csv_file);
  }

  useEffect(() => {
    if (!csv_file) {
      return;
    }
    parseCSVFile();
  }, [csv_file]);

  useEffect(() => {
    init();
  }, []);

  console.log(list_node);

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
          Employees Database
        </Text>
        <Flex
          border={'solid 2px #EEE'}
          borderRadius={8}
          direction={'column'}
          m={'5px'}
          pb={'24px'}
          align={'center'}
          textAlign={'center'}
          gap={'12px'}>
          <Image
            src={'/image/onboarding-2.png'}
            w={'320px'}
            h={'280px'}
            objectFit={'contain'} />
          <Text
            fontSize={'.9em'}
            fontWeight={300}>
            Make Sure You Follow the Guidelines<br/>
            Use employee database guideline & format that given on the Organization Structure page
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
            isLoading={loading}
            onClick={submit}>
            Save &amp; Next
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
