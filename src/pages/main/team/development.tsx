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
import { LibraryType } from 'data-design/src/entity/Library.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import { useEffect, useState } from 'react';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const id = props.admin.id;
  const [tab_type, setTabType] = useState<DevelopmentPlanTabType>(DevelopmentPlanTabType.PROGRESS_TRAINING);
  const [filter_progress_type, setFilterProgressType] = useState<TrainingProgressSidetabType>(TrainingProgressSidetabType.SEMUA);
  const [filter_plan_type, setFilterPlanType] = useState<LibraryType>(LibraryType.EBOOK);

  const http_team_training_proposal: useHttpOutput<TrainingProposal[]> = useHttp({
    url: '/development-plan/team-proposal'
  });
  const http_submit_review: useHttpOutput<any> = useHttp({
    url: '/development-plan/proposal/:id/approve-submission',
    callback: http_team_training_proposal.get
  });

  async function submitReview(data: TrainingProposal, notes?: string) {
    await http_submit_review.put({
      notes
    }, {
      params: {
        id: data.id
      }
    });
  }

  useEffect(() => {
    http_team_training_proposal.get();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'My Team Development'}>
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
                http_team_training_proposal?.result?.map((proposal: TrainingProposal) => (
                  <DevelopmentPlanCard 
                    key={proposal.id}
                    loading={http_submit_review.loading}
                    onReviewSubmit={submitReview}
                    data={proposal}
                    reviewMode />
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
