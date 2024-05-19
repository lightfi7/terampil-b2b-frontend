import { AButton } from '@/components/button/AButton';
import YearPicker from '@/components/date-picker/YearPicker';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { GroupTrainingGrid } from '@/components/group-training-grid/GroupTrainingGrid';
import { ItemElibrary } from '@/components/item-elibrary/ItemElibrary';
import { ObjectiveKeyResult } from '@/components/objective-key-result/ObjectiveKeyResult';
import { Pagination } from '@/components/pagination/Pagination';
import { TableAction } from '@/components/table-action/TableAction';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Box, Flex, Image, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Library, LibraryCategory, LibraryType } from 'data-design/src/entity/Library.entity';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

interface LibrarySummary {
  category: string
  total: string
}

export default function(props: WithAdminPageProps) {
  const http_library = useHttp<IPagination<Library>>({
    url: '/library'
  });
  const http_library_summary = useHttp<LibrarySummary[]>({
    url: '/summary-library'
  });

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(12);
  const total_page = Math.ceil((http_library?.result?.total ?? 0) / limit);
  const group_library = _.chunk(http_library?.result?.data, 4);

  async function init(filter?: {[key: string]: any}) {
    http_library.get({
      query: {
        limit,
        offset: page * limit,
        ...(filter ?? {})
      }
    });
  }

  function gotoDetail(library: Library) {
    switch (library.type) {
      case LibraryType.VIDEO:
        window.location.href = `e-library/${library.id}/video`;
        break;
      case LibraryType.PODCAST:
        window.location.href = `e-library/${library.id}/audio`;
        break;
      case LibraryType.ON_DEMAND_VIDEO_TRAINING:
        window.location.href = `e-library/${library.id}/training`;
        break;
      case LibraryType.GROUP_LEARNING:
        window.location.href = `e-library/${library.id}/group-learning`;
        break;
      case LibraryType.OFFLINE_EXTERNAL_TRAINING:
        window.location.href = `e-library/${library.id}/offline-external-training`;
        break;
      case LibraryType.OFFLINE_INHOUSE_TRAINING:
        window.location.href = `e-library/${library.id}/offline-inhouse-training`;
        break;
      case LibraryType.ON_THE_JOB_TRAINING:
        window.location.href = `e-library/${library.id}/on-the-job-training`;
        break;
      case LibraryType.ONE_ON_ONE:
        window.location.href = `e-library/${library.id}/one-on-one`;
        break;
      case LibraryType.ONLINE_EXTERNAL_TRAINING:
        window.location.href = `e-library/${library.id}/online-external-training`;
        break;
      case LibraryType.SERTIFIKASI:
        window.location.href = `e-library/${library.id}/sertifikasi`;
        break;
      case LibraryType.EBOOK:
        window.location.href = `e-library/${library.id}/e-book`;
        break;
    }
  }

  useEffect(() => {
    http_library_summary.get();
  }, []);

  useEffect(() => {
    init();
  }, [page, limit]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'E-Library'}>
      <Flex 
        p={'0 18px'}
        direction={'column'}
        gap={'24px'}>
        <Flex
          w={'100%'}
          h={'350px'}
          borderRadius={24}
          align={'center'}
          position={'relative'}>
          <Image 
            zIndex={1}
            borderRadius={24}
            src={'/bg-library.png'}
            w={'100%'}
            h={'100%'}
            objectFit={'cover'}
            position={'absolute'}
            top={0}
            left={0} />
          <Box 
            zIndex={1}
            w={'100%'}
            h={'100%'}
            borderRadius={24}
            objectFit={'cover'}
            position={'absolute'}
            bg={'#000A'}
            top={0}
            left={0} />
          <Image
            zIndex={2}
            src={'https://www.terampil.com/static/media/logo-terampil.0d80083e.png'}
            w={'300px'}
            h={'150px'}
            m={'24px 7%'}
            objectFit={'contain'} />
          <Flex
            zIndex={2}
            direction={'column'}
            color={'#FFF'}>
            <Text
              fontSize={'48px'}
              fontWeight={700}>
              E-Library
            </Text>
            <Text
              fontSize={'14px'}
              fontWeight={400}>
              Kumpulan materi untuk mu.
            </Text>
            {/* <Flex
              mt={'70px'}
              gap={'24px'}>
              <Flex
                gap={'8px'}
                align={'flex-end'}>
                <Text
                  fontSize={'14px'}
                  fontWeight={400}>
                  Modul Training
                </Text>
                <Text
                  mb={'-3px'}
                  fontSize={'20px'}
                  fontWeight={700}>
                  0
                </Text>
              </Flex>
              <Flex
                gap={'8px'}
                align={'flex-end'}>
                <Text
                  fontSize={'14px'}
                  fontWeight={400}>
                  Modul Training
                </Text>
                <Text
                  mb={'-3px'}
                  fontSize={'20px'}
                  fontWeight={700}>
                  0
                </Text>
              </Flex>
              <Flex
                gap={'8px'}
                align={'flex-end'}>
                <Text
                  fontSize={'14px'}
                  fontWeight={400}>
                  Modul Training
                </Text>
                <Text
                  mb={'-3px'}
                  fontSize={'20px'}
                  fontWeight={700}>
                  0
                </Text>
              </Flex>
              <Flex
                gap={'8px'}
                align={'flex-end'}>
                <Text
                  fontSize={'14px'}
                  fontWeight={400}>
                  Modul Training
                </Text>
                <Text
                  mb={'-3px'}
                  fontSize={'20px'}
                  fontWeight={700}>
                  0
                </Text>
              </Flex>
            </Flex> */}
          </Flex>
        </Flex>
        <Text
          fontSize={'20px'}
          fontWeight={600}>
          Kategori
        </Text>
        <GroupTrainingGrid data={(http_library_summary.result ?? []).map((libsum: LibrarySummary) => ({
          label: libsum.category,
          count: parseInt(libsum.total),
          image: 'https://media.architecturaldigest.com/photos/56b524e44ac3d842677b9ad7/master/w_320%2Cc_limit/home-office-09.jpg'
        }))} />
        <Text
          fontSize={'20px'}
          fontWeight={600}>
          E-Library
        </Text>
        <TableAction
          noSort
          filterOptions={[{
            type: 'text',
            name: 'title'
          }, {
            type: 'text',
            name: 'description'
          }, {
            type: 'dropdown',
            name: 'type',
            options: Object.keys(LibraryType).map((value: any) => ({
              label: value,
              value
            }))
          }, {
            type: 'dropdown',
            name: 'category',
            options: Object.keys(LibraryCategory).map((value: any) => ({
              label: value,
              value
            }))
          }]}
          onFilter={(key: string, value: string) => init({ [key]: value })} />
        <Flex
          gap={'12px'}
          direction={'column'}
          minH={'280px'}>
          { http_library.loading && <Spinner /> }
          {
            !http_library.loading && group_library.map((list_lib: Library[], i: number) => (
              <Flex
                key={i}
                gap={'24px'}>
                {
                  list_lib.map((lib: Library, j: number) => (
                    <ItemElibrary
                      onClick={() => gotoDetail(lib)}
                      data={lib} 
                      key={`${i}-${j}`} />
                  ))
                }
              </Flex>
            ))
          }
        </Flex>
        <Pagination 
          page={page} 
          numberOfPages={total_page} 
          limit={limit}
          onLimitChange={setLimit}
          onPageChange={setPage}
          limitValues={[
            4 * 3,
            4 * 9,
            4 * 15,
            4 * 30,
            4 * 50
          ]} />
        <br/>
      </Flex>
    </TemplateAuth>
  );
}
