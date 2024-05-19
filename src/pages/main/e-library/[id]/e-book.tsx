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
          align={'flex-start'}>
          <Flex
            border={'solid 1px #EEE'}
            overflow={'hidden'}
            bg={'#FFF'}
            borderRadius={24}
            boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
            w={'30%'}
            align={'flex-start'}
            direction={'column'}
            gap={'12px'}>
            <Image
              src={http_library.result?.thumbnail}
              w={'100%'}
              h={'250px'}
              border={'solid 1px #F5F5F5'}
              bg={'#FAFAFA'}
              objectFit={'contain'} />
            <Flex
              direction={'column'}
              p={'0px 24px'}
              pb={'24px'}
              w={'100%'}
              align={'center'}>
              <Text
                fontWeight={700}
                fontSize={'1.8em'}>
                Ebook
              </Text>
              <Text
                fontWeight={600}>
                { http_library?.result?.title }
              </Text>
              <Flex
                mt={'24px'}
                direction={'column'}
                alignSelf={'flex-start'}>
                <Text>
                  Description:
                </Text>
                <Text>
                  { http_library?.result?.description ?? '-' }
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            border={'solid 1px #EEE'}
            overflow={'hidden'}
            bg={'#FFF'}
            py={'24px'}
            borderRadius={24}
            boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
            flex={1}>
            { http_library.loading && <Spinner /> }
            { !http_library.loading && <PDFViewer url={http_library.result?.file ?? ''} /> }
          </Flex>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
