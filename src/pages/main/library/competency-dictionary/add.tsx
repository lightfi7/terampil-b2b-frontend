import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex } from '@chakra-ui/react';
import axios from 'axios';
import { CompetencyType } from 'data-design/src/entity/Competency.entity';
import { JobProfile } from 'data-design/src/entity/JobProfile.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export namespace CDDTO {
  export interface KeyBehavior {
    key_behavior: string
    weight: number
    tags: string[]
  }

  export interface ProficiencyLevel {
    label: string
    list_key_behavior: KeyBehavior[]
  }

  export interface Competency {
    competency: string
    description?: string
    tooltip?: string
    job_profile_ids: number[]
    minimum_score: number
    weight: number
    type: CompetencyType
    list_proficiency_level: ProficiencyLevel[]
    tags: string[]
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const [data, setData] = useState<CDDTO.Competency>({
    competency: '',
    description: '',
    tooltip: '',
    job_profile_ids: [],
    minimum_score: '' as any,
    weight: '' as any,
    type: '' as any,
    list_proficiency_level: [],
    tags: []
  });
  const [list_job_profile, setListJobProfile] = useState<JobProfile[]>([]);
  const [list_library, setListLibrary] = useState<Library[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function init() {
    setLoading(true);
    try {
      setListJobProfile((await axios.get('/job-profile')).data);
      const page_library: IPagination<Library> = (await axios.get('/library', {
        params: {
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0
        }
      })).data;
      setListLibrary(page_library.data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function createData() {
    setLoading(true);
    try {
      await axios.post(`/competency-dictionary`, data);
      window.location.href = '/main/library/competency-dictionary';
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      title={'Create Competency Dictionary'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Create Competency Dictionary'} />
        <DetailContainer title={'Isi Detail Competency Dictionary'}>
          <XForm gap={'16px'} forms={[{
            label: 'Competency',
            key: 'competency',
            placeholder: 'Competency',
            type: 'text',
            value: data.competency,
            onChange(competency: string) {
              setData({
                ...data,
                competency
              });
            }
          }, {
            label: 'Description',
            key: 'description',
            placeholder: 'Description',
            type: 'text',
            value: data.description,
            onChange(description: string) {
              setData({
                ...data,
                description
              });
            }
          }, {
            label: 'Tooltip',
            key: 'tooltip',
            placeholder: 'Tooltip',
            type: 'text',
            value: data.tooltip,
            onChange(tooltip: string) {
              setData({
                ...data,
                tooltip
              });
            }
          }, {
            label: 'Job Profile',
            key: 'job_profile',
            placeholder: 'Job Profile',
            type: 'multi-dropdown',
            options: list_job_profile.map((jp: JobProfile) => ({
              label: jp.name,
              value: jp.id
            })),
            values: data.job_profile_ids,
            onChange(job_profile_ids: number[]) {
              setData({
                ...data,
                job_profile_ids
              });
            }
          }, {
            label: 'Type',
            key: 'type',
            placeholder: 'Type',
            type: 'dropdown',
            options: Object.keys(CompetencyType).map((value: string) => ({
              label: value,
              value
            })),
            value: data.type,
            onChange(type: CompetencyType) {
              setData({
                ...data,
                type
              });
            }
          }, {
            label: 'Minimum Score',
            key: 'minimum_score',
            placeholder: 'Minimum Score',
            type: 'number',
            value: data.minimum_score,
            onChange(minimum_score: number) {
              setData({
                ...data,
                minimum_score
              });
            }
          }, {
            label: 'Proficiency',
            key: 'proficiency',
            placeholder: 'Weight',
            type: 'proficiency-key-behavior',
            value: data.list_proficiency_level,
            onChange(list_proficiency_level) {
              setData({
                ...data,
                list_proficiency_level
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
