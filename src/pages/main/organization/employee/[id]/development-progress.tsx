import { AButton } from '@/components/button/AButton';
import YearPicker from '@/components/date-picker/YearPicker';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { KaryawanBadgeDP } from '@/components/karyawan-badge/KaryawanBadgeDP';
import { KaryawanBadgeSimple } from '@/components/karyawan-badge/KaryawanBadgeSimple';
import { ObjectiveKeyResult } from '@/components/objective-key-result/ObjectiveKeyResult';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex, Text } from '@chakra-ui/react';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const total_page = Math.ceil(10 / limit);

  const http_init_karyawan: useHttpOutput<Employee> = useHttp({
    url: `/karyawan/${id}`
  });

  async function init() {
    http_init_karyawan.get();
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
        gap={'24px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Detail Progress Development Plan'} />
        <Flex 
          gap={'24px'}
          w={'100%'}>
          <KaryawanBadgeSimple
            employee={http_init_karyawan.result} />
          <KaryawanBadgeDP
            employee={http_init_karyawan.result} />
        </Flex>
        <br/>
      </Flex>
    </TemplateAuth>
  );
}
