import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { OKRForm, OKRFormData } from '@/components/pre-form/OKRForm';
import { TemplateAuth } from '@/template-auth';
import { IPagination, uploadFile } from '@/util';
import { Flex, Image, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Competency, CompetencyType } from 'data-design/src/entity/Competency.entity';
import { JobProfile } from 'data-design/src/entity/JobProfile.entity';
import { KeyBehavior } from 'data-design/src/entity/KeyBehavior.entity';
import { KeyResult } from 'data-design/src/entity/KeyResult.entity';
import { Objective, UpdatePeriode } from 'data-design/src/entity/Objective.entity';
import { ProficiencyLevel } from 'data-design/src/entity/ProficiencyLevel.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { objective_id, id } = router.query;
  const [data, setData] = useState<OKRFormData.Objective>({
    objective: '',
    start_date: new Date(),
    end_date: new Date(),
    update_period: '' as any,
    weight: '' as any,
    list_key_result: []
  });
  const [list_competency, setListCompetency] = useState<Competency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function init() {
    setLoading(true);
    try {
      const row: Objective = (await axios.get(`/pre-made-okrs-objective/${id}/${objective_id}`)).data;
      const page_competency: IPagination<Competency> = (await axios.get('/competency-dictionary', {
        params: {
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0
        }
      })).data;
      setListCompetency(page_competency.data);
      setData({
        objective: row.title,
        start_date: row.start_date,
        end_date: row.end_date,
        update_period: row.update_periode,
        weight: row.weight,
        list_key_result: row.list_key_result.map((kr: KeyResult) => ({
          title: kr.title,
          target: kr.target,
          unit: kr.unit,
          update_period: kr.update_periode,
          target_per_period: kr.target_per_periode,
          weight: kr.weight,
          list_competency: kr.list_kr_competency.map(c => c.competency.id)
        }))
      });
    } catch (err: any) {
      console.log(err);
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function updateData() {
    setLoading(true);
    try {
      await axios.put(`/pre-made-okrs-objective/${id}/${objective_id}`, data);
      window.location.replace(`/main/library/pre-made-okrs/${id}`);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  console.log(data);

  return (
    <TemplateAuth
      title={'Update Objective'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Update Objective'} />
        <OKRForm
          title={'Isi Detail Objective'}
          data={data}
          setData={setData}
          listCompetency={list_competency} />
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
