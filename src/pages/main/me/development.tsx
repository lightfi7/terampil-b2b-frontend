import { SpecificCompetencyBadge } from '@/components/competency-proficiency-badge/SpecificCompetencyBadge';
import { CompetencyGroup } from '@/components/competency/CompetencyGroup';
import { ContainerGradient } from '@/components/container-gradient/ContainerGradient';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XInputSelect } from '@/components/form/input/XInputSelect';
import { DevelopmentPlanCard } from '@/components/my-development-plan/DevelopmentPlanCard';
import { DevelopmentPlanTab, DevelopmentPlanTabType } from '@/components/my-development-plan/DevelopmentPlanTab';
import { PlanTypeSidetab } from '@/components/my-development-plan/PlanTypeSidetab';
import { TrainingProgressSidetab, TrainingProgressSidetabType } from '@/components/my-development-plan/TrainingProgressSidetab';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex, Text } from '@chakra-ui/react';
import { WithAdminPageProps, getServerSideProps } from 'cookies.util';
import { Competency } from 'data-design/src/entity/Competency.entity';
import { CompetencyAssessment } from 'data-design/src/entity/CompetencyAssessment.entity';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { LibraryType } from 'data-design/src/entity/Library.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Summary } from '../organization/employee/[id]';
import { competency_labels } from '../organization/employee/[id]/competency';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const id = props.admin.id;
  const [tab_type, setTabType] = useState<DevelopmentPlanTabType>(DevelopmentPlanTabType.PROGRESS_TRAINING);
  const [filter_progress_type, setFilterProgressType] = useState<TrainingProgressSidetabType>(TrainingProgressSidetabType.SEMUA);
  const [filter_plan_type, setFilterPlanType] = useState<LibraryType>(LibraryType.EBOOK);

  const http_my_training_proposal: useHttpOutput<TrainingProposal[]> = useHttp({
    url: '/development-plan/proposal'
  });

  function onClick(data: TrainingProposal) {
    switch (data.library.type) {
      case LibraryType.VIDEO:
        window.location.href = `/main/e-library/${data.library.id}/video`;
        break;
      case LibraryType.PODCAST:
        window.location.href = `/main/me/training-process/audio?training_proposal_id=${data.id}`;
        break;
      case LibraryType.ON_DEMAND_VIDEO_TRAINING:
        window.location.href = `/main/me/training?id=${data.id}`;
        break;
      case LibraryType.GROUP_LEARNING:
        window.location.href = `/main/me/training-process/group_learning?training_proposal_id=${data.id}`;
        break;
      case LibraryType.OFFLINE_EXTERNAL_TRAINING:
        window.location.href = `/main/me/training-process/offline-external-training?training_proposal_id=${data.id}`;
        break;
      case LibraryType.OFFLINE_INHOUSE_TRAINING:
        window.location.href = `/main/me/training-process/offline-inhouse-training?training_proposal_id=${data.id}`;
        break;
      case LibraryType.ON_THE_JOB_TRAINING:
        window.location.href = `/main/me/training-process/on-the-job-training?training_proposal_id=${data.id}`;
        break;
      case LibraryType.ONE_ON_ONE:
        window.location.href = `/main/me/training-process/one-on-one?training_proposal_id=${data.id}`;
        break;
      case LibraryType.ONLINE_EXTERNAL_TRAINING:
        window.location.href = `/main/me/training-process/online-external-training?training_proposal_id=${data.id}`;
        break;
      case LibraryType.SERTIFIKASI:
        window.location.href = `/main/me/training-process/sertifikasi?training_proposal_id=${data.id}`;
        break;
      case LibraryType.EBOOK:
        window.location.href = `/main/me/training-process/ebook?training_proposal_id=${data.id}`;
        break;
    }
  }

  useEffect(() => {
    http_my_training_proposal.get({
      query: {
        id: props.admin.id
      }
    });
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'My Development Plan'}>
      <Flex 
        p={'0 12px'}
        direction={'column'}
        gap={'24px'}>
        <ContainerGradient 
          p={'24px 24px'}
          justify={'space-between'}
          align={'center'}>
          <Flex 
            direction={'column'}>
            <Text
              fontWeight={700}
              fontSize={'1.2em'}>
              Progress Training
            </Text>
            <Text
              fontSize={'.8em'}>
              Progres training menampilkan semua progres training yang sedang kamu ikuti.
            </Text>
          </Flex>
        </ContainerGradient>
        <DevelopmentPlanTab
          type={tab_type}
          setType={setTabType} />
        <Flex
          gap={'24px'}>
          <Flex
            direction={'column'}
            gap={'12px'}>
            <TrainingProgressSidetab
              type={filter_progress_type}
              setType={setFilterProgressType} />
            <PlanTypeSidetab
              type={filter_plan_type}
              setType={setFilterPlanType} />
          </Flex>
          <Flex
            flex={3}
            direction={'column'}
            gap={'24px'}>
            <Flex
              justify={'space-between'}
              align={'center'}>
              <Text
                fontWeight={600}
                color={'brand'}
                fontSize={'1.2em'}>
                Semua Aktivitas
              </Text>
              <Flex
                align={'center'}>
                <Text
                  fontWeight={600}
                  fontSize={'.9em'}>
                  Urutkan
                </Text>
                <XInputSelect 
                  containerStyle={{
                    padding: 0,
                    width: 150,
                    paddingLeft: '15px',
                    paddingTop: 0,
                    paddingBottom: 0
                  }}
                  key={''} 
                  placeholder={'Sort'}
                  type={"dropdown"} />
              </Flex>
            </Flex>
            <Flex 
              mb={'48px'}
              direction={'column'}
              gap={'24px'}>
              {
                http_my_training_proposal?.result?.map((proposal: TrainingProposal) => (
                  <DevelopmentPlanCard 
                    onClick={onClick}
                    key={proposal.id}
                    data={proposal} />
                ))
              }
            </Flex>
          </Flex>
        </Flex>
        <br/>
        <br/>
        <br/>
      </Flex>
    </TemplateAuth>
  );
}
