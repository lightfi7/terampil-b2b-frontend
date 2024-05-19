// import { AudioPlayer } from '@/components/AudioPlayer';
const AudioPlayer = dynamic(
  // @ts-ignore
  () => import('@/components/AudioPlayer'),
  { ssr: false }
)
console.log(AudioPlayer);

import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Library } from 'data-design/src/entity/Library.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const http_library = useHttp<Library>({
    url: `/library/${id}`
  });
  const title = http_library?.result?.title ?? '';

  async function init() {
    http_library.get();
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
        p={'0 4%'}
        direction={'column'}
        gap={'48px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={title} />
        <Flex
          gap={'24px'}>
          <Flex
            align={'center'}
            justify={'center'}
            flex={5}
            w={'70%'}
            minH={'550px'}
            bg={'#E5E5E5'}
            p={'48px'}>
            { !http_library.loading && <Flex
              h={'50px'}
              mt={'-100px'}
              w={'100%'}>
              <AudioPlayer
                h={120}
                audio={http_library?.result?.file} />
            </Flex> }
          </Flex>
          <Flex
            direction={'column'}
            borderRadius={8}
            flex={3}
            boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
            p={'12px 18px'}
            fontSize={'.9em'}>
            <Text
              fontWeight={700}>
              Deskripsi
            </Text>
            <Box 
              w={'40px'}
              h={'1px'}
              bg={'blue.500'} />
            <Text
              mt={'12px'}
              color={'blue.500'}
              fontWeight={700}>
              { title }
            </Text>
            <Text
              fontWeight={500}>
              { http_library?.result?.category ?? '' }
            </Text>
            <Text
              mt={'12px'}>
              { http_library?.result?.description ?? '' }
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
