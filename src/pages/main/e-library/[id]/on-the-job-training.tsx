import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { GeneralAssessmentLibrary } from '@/components/general-assessment-library/GeneralAssessmentLibrary';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex } from '@chakra-ui/react';
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
      title={`On The Job Training: ${title}`}>
      <Flex 
        mb={'12px'}
        p={'0 36px'}
        direction={'column'}
        gap={'48px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Kembali'} />
        <GeneralAssessmentLibrary
          pageTitle={'On The Job Training'}
          title={http_library.result?.title ?? ''}
          thumbnail={http_library.result?.thumbnail}
          description={http_library.result?.description}
          hideButtons />
      </Flex>
    </TemplateAuth>
  );
}
