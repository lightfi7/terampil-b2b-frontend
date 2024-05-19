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
import { UpdatePeriode } from 'data-design/src/entity/Objective.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;
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
      const page_competency: IPagination<Competency> = (await axios.get('/competency-dictionary', {
        params: {
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0
        }
      })).data;
      setListCompetency(page_competency.data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function createData() {
    setLoading(true);
    try {
      await axios.post(`/pre-made-okrs-objective/${id}`, data);
      window.location.replace(`../../${id}`);
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
      title={'Create Objective'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Create Objective'} />
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
            onClick={createData}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
