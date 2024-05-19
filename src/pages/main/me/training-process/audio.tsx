const AudioPlayer = dynamic(
  // @ts-ignore
  () => import('@/components/AudioPlayer'),
  { ssr: false }
)

import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex, Text } from '@chakra-ui/react';
import { WithAdminPageProps, getServerSideProps } from 'cookies.util';
import { Library } from 'data-design/src/entity/Library.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const { training_proposal_id } = router.query;

  const http_development_plan = useHttp<TrainingProposal>({
    url: `/development-plan/proposal/${training_proposal_id}`,
    initialLoading: true
  });
  const http_update_progress = useHttp<any>({
    url: '/development-plan/proposal/:id/update-progress'
  });
  const title = http_development_plan.result?.library?.title ?? '';

  async function init() {
    http_development_plan.get();
  }

  function updateProgress(progress: number) {
    http_update_progress.put({
      progress
    }, {
      params: {
        id: training_proposal_id as string
      }
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      noSidebar
      admin={props.admin}
      title={`Podcast: ${title}`}>
      <Flex 
        mb={'12px'}
        p={'0 36px'}
        direction={'column'}
        gap={'48px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Kembali'} />
        <Flex
          gap={'24px'}
          p={'0 8%'}
          direction={'column'}>
          <Flex
            direction={'column'}
            flex={3}
            borderRadius={8}
            boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
            p={'24px 18px'}
            fontSize={'.9em'}
            align={'center'}>
            <Text
              fontWeight={700}
              fontSize={'1.8em'}>
              Podcast
            </Text>
            <Text
              mt={'12px'}
              fontWeight={700}>
              { title }
            </Text>
            <Text
              fontWeight={500}>
              { http_development_plan?.result?.library?.category ?? '' }
            </Text>
            <Text
              mt={'24px'}>
              Description
            </Text>
            <Text>
              { http_development_plan?.result?.library?.description ?? '' }
            </Text>
          </Flex>
          <Flex
            align={'center'}
            justify={'center'}
            flex={5}
            borderRadius={8}
            boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
            minH={'250px'}
            p={'48px'}>
            { !http_development_plan.loading && <Flex
              h={'150px'}
              w={'100%'}>
              <AudioPlayer
                h={120}
                audio={http_development_plan?.result?.library?.file}
                onProgressPlay={updateProgress} />
            </Flex> }
          </Flex>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
