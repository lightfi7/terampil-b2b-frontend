import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { TemplateAuth } from '@/template-auth';
import { uploadFile } from '@/util';
import { Flex, Image, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { CompetencyType } from 'data-design/src/entity/Competency.entity';
import { JobProfile } from 'data-design/src/entity/JobProfile.entity';
import { UpdatePeriode } from 'data-design/src/entity/Objective.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export namespace PreMadeDTO {
  export interface KeyResult {
    title: string
    target: number
    unit: string
    update_period: UpdatePeriode
    target_per_period: number
    weight: number
  }

  export interface Objective {
    department: string
    position: string
    thumbnail: string
    objective: string
    start_date: Date
    end_date: Date
    update_period: UpdatePeriode
    weight: number
    list_key_result: KeyResult[]
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const [data, setData] = useState<PreMadeDTO.Objective>({
    department: '',
    position: '',
    thumbnail: '',
    objective: '',
    start_date: new Date(),
    end_date: new Date(),
    update_period: '' as any,
    weight: '' as any,
    list_key_result: []
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [loading_upload, setLoadingUpload] = useState<boolean>(false);

  async function init() {
    setLoading(true);
    try {
      //
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function createData() {
    setLoading(true);
    try {
      await axios.post(`/pre-made-okrs`, data);
      window.location.href = '/main/library/pre-made-okrs';
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  function addOKRItem() {
    setData({
      ...data,
      list_key_result: [
        ...data.list_key_result,
        {
          title: '',
          target: '' as any,
          unit: '',
          update_period: '' as any,
          target_per_period: '' as any,
          weight: '' as any,
        },
      ]
    });
  }

  function updateOKRItem(index: number, kvs: {[key: string]: any}) {
    setData({
      ...data,
      list_key_result: [
        ...data.list_key_result.slice(0, index),
        {
          ...data.list_key_result[index],
          ...kvs
        },
        ...data.list_key_result.slice(index + 1),
      ]
    });
  }

  function removeOKRItem(index: number) {
    setData({
      ...data,
      list_key_result: [
        ...data.list_key_result.slice(0, index),
        ...data.list_key_result.slice(index + 1),
      ]
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      title={'Create Pre-Made OKRs'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Create Pre-Made OKRs'} />
        <DetailContainer title={'Isi Detail Pre-Made OKRs'}>
          <XForm gap={'16px'} forms={[{
            label: 'Department',
            key: 'department',
            placeholder: 'Department',
            type: 'text',
            value: data.department,
            onChange(department: string) {
              setData({
                ...data,
                department
              });
            }
          }, {
            label: 'Position',
            key: 'position',
            placeholder: 'Position',
            type: 'text',
            value: data.position,
            onChange(position: string) {
              setData({
                ...data,
                position
              });
            }
          }, {
            label: 'Thumbnail',
            key: 'thumbnail',
            placeholder: 'Thumbnail',
            type: 'file',
            loading: loading_upload,
            value: data.thumbnail,
            async onChange(file: any) {
              const thumbnail: string = await uploadFile(file, setLoadingUpload) ?? '';
              setData({
                ...data,
                thumbnail
              });
            }
          }]} />
        </DetailContainer>
        <Flex 
          mt={'8px'}
          justify={'flex-end'}
          gap={'12px'}>
          <AButton 
            isLoading={loading}
            onClick={() => window.history.back()}
            variant={'outline'}>
            Batal
          </AButton>
          <AButton 
            isLoading={loading}
            onClick={createData}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
