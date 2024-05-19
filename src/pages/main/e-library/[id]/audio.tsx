const AudioPlayer = dynamic(
  // @ts-ignore
  () => import('@/components/AudioPlayer'),
  { ssr: false }
)

import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex, Image, Text } from '@chakra-ui/react';
import { WithAdminPageProps, getServerSideProps } from 'cookies.util';
import { Library } from 'data-design/src/entity/Library.entity';
import _ from 'lodash';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
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
              { http_library?.result?.category ?? '' }
            </Text>
            <Text
              mt={'24px'}>
              Description
            </Text>
            <Text>
              { http_library?.result?.description ?? '' }
            </Text>
            <Flex
              mt={'24px'}
              align={'center'}>
              <Flex
                gap={'18px'}
                align={'center'}
                fontFamily={'Poppins'}
                color={'#4F657B'}>
                <Image
                  src={http_library.result?.thumbnail}
                  w={'58px'}
                  h={'58px'}
                  objectFit={'cover'}
                  borderRadius={999} />
                <Flex
                  direction={'column'}
                  gap={'3px'}>
                  <Text
                    fontWeight={600}>
                    PODCASTER
                  </Text>
                  <Text>
                    { http_library.result?.trainer_name ?? '-' }
                  </Text>
                </Flex>
                <Flex
                  direction={'column'}
                  gap={'3px'}>
                  <Text
                    fontWeight={600}>
                    DATE
                  </Text>
                  <Text>
                    { moment(http_library.result?.created_at).format('DD MMMM YYYY') }
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            align={'center'}
            justify={'center'}
            flex={5}
            borderRadius={8}
            boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
            minH={'250px'}
            p={'48px'}>
            { !http_library.loading && <Flex
              h={'150px'}
              w={'100%'}>
              <AudioPlayer
                h={120}
                audio={http_library?.result?.file} />
            </Flex> }
          </Flex>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
