import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { PDFViewer } from '@/components/pdf-viewer/PDFViewer';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex, Image, Spinner, Text } from '@chakra-ui/react';
import { WithAdminPageProps, getServerSideProps } from 'cookies.util';
import { Library } from 'data-design/src/entity/Library.entity';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export { getServerSideProps };
import ReactPlayer from 'react-player'

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const http_library = useHttp<Library>({
    url: `/library/${id}`,
    initialLoading: true
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
            borderRadius={24}
            boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
            p={'24px 18px'}
            fontSize={'.9em'}
            align={'center'}>
            <Text
              fontWeight={700}
              fontSize={'1.8em'}>
              Video
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
          </Flex>
          <Flex
            align={'center'}
            justify={'center'}
            flex={5}
            borderRadius={24}
            boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
            p={'24px'}>
            { http_library.loading && <Spinner /> }
            { !http_library.loading && <Flex
              flex={1}
              p={'12px'}
              h={'500px'}
              w={'100%'}
              borderRadius={12}
              bg={'#000'}
              overflow={'hidden'}>
              <ReactPlayer 
                width={'100%'}
                height={'100%'}
                url={http_library.result?.file}
                controls />
            </Flex> }
          </Flex>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
