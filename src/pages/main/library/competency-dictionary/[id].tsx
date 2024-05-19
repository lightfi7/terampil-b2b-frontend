import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { TemplateAuth } from '@/template-auth';
import { IPagination, uploadFile } from '@/util';
import { Flex, Image, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Competency, CompetencyType } from 'data-design/src/entity/Competency.entity';
import { JobProfile } from 'data-design/src/entity/JobProfile.entity';
import { KeyBehavior } from 'data-design/src/entity/KeyBehavior.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { ProficiencyLevel } from 'data-design/src/entity/ProficiencyLevel.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
import { CDDTO } from './add';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;
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
      const row: Competency = (await axios.get(`/competency-dictionary/${id}`)).data;
      setListJobProfile((await axios.get('/job-profile')).data);
      const page_library: IPagination<Library> = (await axios.get('/library', {
        params: {
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0
        }
      })).data;
      setListLibrary(page_library.data);
      setData({
        competency: row.name,
        description: row.description,
        tooltip: row.tooltip,
        job_profile_ids: row.list_competency_job_profile.map(x => x.job_profile.id),
        minimum_score: row.minimum_score,
        weight: row.weight,
        type: row.type,
        list_proficiency_level: row.list_level.map((pf: ProficiencyLevel) => ({
          label: pf.label,
          list_key_behavior: pf.list_key_behavior.map((kb: KeyBehavior) => ({
            key_behavior: kb.label ?? '',
            weight: kb.weight,
            tags: kb.tags
          }))
        })),
        tags: row.tags
      });
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function updateData() {
    setLoading(true);
    try {
      await axios.put(`/competency-dictionary/${id}`, data);
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
      title={'Update Competency Dictionary'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Update Competency Dictionary'} />
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
            onClick={updateData}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
