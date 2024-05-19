import { SpecificCompetencyBadge } from '@/components/competency-proficiency-badge/SpecificCompetencyBadge';
import { CompetencyGroup } from '@/components/competency/CompetencyGroup';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { KaryawanBadge } from '@/components/karyawan-badge/KaryawanBadge';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex } from '@chakra-ui/react';
import { Competency } from 'data-design/src/entity/Competency.entity';
import { CompetencyAssessment } from 'data-design/src/entity/CompetencyAssessment.entity';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Summary } from '.';
import { getServerSideProps, WithAdminPageProps } from '../../../../../../cookies.util';
export { getServerSideProps };

export const competency_labels: any = {
  'GENERAL_BEHAVIOR': ' General Behavior Competency',
  'TECHNICAL': ' General Technical',
  'SPECIFIC': ' Specific Competency',
};

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const http_init_karyawan: useHttpOutput<Employee> = useHttp({
    url: `/karyawan/${id}`
  });
  const http_get_competency: useHttpOutput<Competency[]> = useHttp({
    url: '/competency'
  });
  const http_init_karyawan_summary: useHttpOutput<Summary> = useHttp({
    url: `/karyawan/${id}/summary`
  });
  const http_assessment_competency_key_behavior: useHttpOutput<void> = useHttp({
    url: '/competency/key-behavior/:id/assess',
    callback: init
  });
  const http_review_competency_key_behavior: useHttpOutput<void> = useHttp({
    url: '/competency/key-behavior/:id/review',
    callback: init
  });
  const http_assessment_competency_general: useHttpOutput<void> = useHttp({
    url: '/competency/general/:id/assess',
    callback: init
  });
  const http_review_competency_general: useHttpOutput<void> = useHttp({
    url: '/competency/general/:id/review',
    callback: init
  });
  const http_get_assessment_result: useHttpOutput<CompetencyAssessment[]> = useHttp({
    url: '/assessment-result'
  });
  const http_my_training_proposal: useHttpOutput<TrainingProposal[]> = useHttp({
    url: '/development-plan/proposal'
  });
  const http_propose_training: useHttpOutput<TrainingProposal[]> = useHttp({
    url: 'development-plan/library/:id/propose-to/:id_employee',
    callback: init
  });
  const http_unpropose_training: useHttpOutput<TrainingProposal[]> = useHttp({
    url: 'development-plan/library/:id/unpropose-from/:id_employee',
    callback: init
  });
  const http_library_recommendation_by_tags: useHttpOutput<Library[]> = useHttp({
    url: '/skill-gap-rekomendasi/by-tags'
  });
  const group_competency = _.groupBy(http_get_competency.result ?? [], x => x.type);

  async function onCheck(library: Library, checked: boolean, date?: Date, price?: number) {
    if (checked) {
      await http_propose_training.post({
        date,
        price
      }, {
        params: {
          id: library.id,
          id_employee: parseInt(id as string)
        }
      });
    } else {
      await http_unpropose_training.post({}, {
        params: {
          id: library.id,
          id_employee: parseInt(id as string)
        }
      });
    }
  }

  function init() {
    http_my_training_proposal.get({
      query: {
        id
      }
    });
    http_init_karyawan.get();
    http_init_karyawan_summary.get();
    http_get_competency.get({
      query: {
        id
      }
    });
    http_get_assessment_result.get({
      query: {
        id
      }
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Dashboard'}
      noSidebar>
      <Flex 
        p={'0 4%'}
        direction={'column'}
        gap={'48px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Detail Kompetensi Karyawan'} />
        <KaryawanBadge
          simple 
          summaryBadge={http_init_karyawan_summary.result}
          data={http_init_karyawan.result} />
        <Flex
          gap={'24px'}>
          {
            http_init_karyawan_summary.result?.competency.map((x => (
              <Flex
                key={x.key}
                flex={1}>
                <SpecificCompetencyBadge
                  label={competency_labels[x.key]}
                  value={x.value} />
              </Flex>
            )))
          }
        </Flex>
        <Flex
          direction={'column'}
          gap={'12px'}>
          {
            Object.keys(group_competency).map((key: string) => (
              <CompetencyGroup 
                key={key}
                getRecommendationByTags={http_library_recommendation_by_tags}
                checkHttp={http_propose_training}
                uncheckHttp={http_unpropose_training}
                onChecked={onCheck}
                proposal={http_my_training_proposal.result}
                assess={http_assessment_competency_general}
                review={http_review_competency_general}
                title={competency_labels[key]}
                data={group_competency[key]}
                resultKeyBehavior={http_get_assessment_result.result}
                employee={http_init_karyawan.result}
                modeSimple={false} />
            ))
          }
        </Flex>
        <br/>
      </Flex>
    </TemplateAuth>
  );
}
