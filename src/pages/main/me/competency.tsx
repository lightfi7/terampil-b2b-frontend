import { SpecificCompetencyBadge } from '@/components/competency-proficiency-badge/SpecificCompetencyBadge';
import { CompetencyGroup } from '@/components/competency/CompetencyGroup';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { ModalContentListLevel } from '@/components/modal/ModalContentListLevel';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex } from '@chakra-ui/react';
import { WithAdminPageProps, getServerSideProps } from 'cookies.util';
import { Competency } from 'data-design/src/entity/Competency.entity';
import { CompetencyAssessment } from 'data-design/src/entity/CompetencyAssessment.entity';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Summary } from '../organization/employee/[id]';
import { competency_labels } from '../organization/employee/[id]/competency';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const id = props.admin.id;

  const http_init_karyawan: useHttpOutput<Employee> = useHttp({
    url: `/karyawan/${id}`
  });
  const http_init_karyawan_summary: useHttpOutput<Summary> = useHttp({
    url: `/karyawan/${id}/summary`
  });
  const http_competency_submission_key_behavior: useHttpOutput<void> = useHttp({
    url: '/competency/key-behavior/:id/submit',
    callback: getData
  });
  const http_competency_submission_general: useHttpOutput<void> = useHttp({
    url: '/competency/general/:id/submit',
    callback: getData
  });
  const http_get_competency: useHttpOutput<Competency[]> = useHttp({
    url: '/competency'
  });
  const http_get_assessment_result: useHttpOutput<CompetencyAssessment[]> = useHttp({
    url: '/assessment-result'
  });
  const http_my_training_proposal: useHttpOutput<TrainingProposal[]> = useHttp({
    url: '/development-plan/proposal'
  });
  const http_library_recommendation_by_tags: useHttpOutput<Library[]> = useHttp({
    url: '/skill-gap-rekomendasi/by-tags'
  });
  const group_competency = _.groupBy(http_get_competency.result ?? [], x => x.type);
  const [active_competency, setActiveCompetency] = useState<Competency>();
  const [modal, setModal] = useState<OnModalReady>();

  async function getData() {
    http_init_karyawan_summary.get();
    http_get_competency.get({
      query: {
        id: props.admin.id
      }
    });
    http_get_assessment_result.get({
      query: {
        id: props.admin.id
      }
    });
    http_my_training_proposal.get({
      query: {
        id: props.admin.id
      }
    });
  }

  useEffect(() => {
    http_init_karyawan.get();
    getData();
  }, []);

  useEffect(() => {
    if (active_competency) {
      modal?.open();
    }
  }, [active_competency]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Dashboard'}>
      <Flex 
        p={'0 12px'}
        direction={'column'}
        gap={'24px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'My Competency'} />
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
                onLevelClick={setActiveCompetency}
                getRecommendationByTags={http_library_recommendation_by_tags}
                proposal={http_my_training_proposal.result}
                resultKeyBehavior={http_get_assessment_result.result}
                employee={props.admin}
                submit={http_competency_submission_general}
                title={competency_labels[key]}
                data={group_competency[key]}
                modeSimple={false} />
            ))
          }
        </Flex>
        <br/>
      </Flex>
      <ModalInfo
        mdWidth={600}
        title={`Key Behavior Seluruh Level`}
        setOnModalReady={setModal}>
        <ModalContentListLevel levels={active_competency?.list_level ?? []} />
      </ModalInfo>
    </TemplateAuth>
  );
}
