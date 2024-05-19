import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination, uploadFile } from '@/util';
import { Flex } from '@chakra-ui/react';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { TrainingWajib } from 'data-design/src/entity/TrainingWajib.entity';
import { TrainingWajibLibrary } from 'data-design/src/entity/TrainingWajibLibrary.entity';
import { TrainingWajibParticipant } from 'data-design/src/entity/TrainingWajibParticipant.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export namespace TrainingWajibDTO {
  export interface Data {
    title?: string
    level: number
    description?: string
    thumbnail?: string
    list_organization_node_id: number[]
    list_library_id: number[]
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { edit_id } = router.query;

  const http_organization_node = useHttp<OrganizationNode[]>({
    url: '/onboarding/existing-organization-structure'
  });
  const http_library = useHttp<IPagination<Library>>({
    url: '/library'
  });
  const http_create_training_wajib = useHttp<TrainingWajib>({
    url: '/training-wajib'
  });
  const http_edit_training_wajib = useHttp<TrainingWajib>({
    url: `/training-wajib/${edit_id}`
  });
  const http_training_wajib_one = useHttp<TrainingWajib>({
    url: `/training-wajib/${edit_id}`
  });

  const [data, setData] = useState<TrainingWajibDTO.Data>({
    title: '',
    level: '' as any,
    description: '',
    list_organization_node_id: [],
    list_library_id: []
  });
  const [loading_upload_thumbnail, setLoadingUploadThumbnail] = useState<boolean>(false);

  async function init() {
    http_library.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER
      }
    });
    http_organization_node.get();
    if (edit_id) {
      http_training_wajib_one.get();
    }
  }

  async function submit() {
    if (edit_id) {
      http_edit_training_wajib.put(data);
      window.location.replace('/main/training-event/training-wajib');
      return;
    }
    http_create_training_wajib.post(data);
    window.location.replace('/main/training-event/training-wajib');
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (http_training_wajib_one.result) {
      setData({
        title: http_training_wajib_one.result?.title,
        level: http_training_wajib_one.result?.level ?? '' as any,
        description: http_training_wajib_one.result?.description,
        list_organization_node_id: http_training_wajib_one.result?.list_training_wajib_participant.map((twp: TrainingWajibParticipant) => twp.organization_node?.id) ?? [],
        list_library_id: http_training_wajib_one.result?.list_training_wajib_library.map((twl: TrainingWajibLibrary) => twl.library?.id) ?? [],
      });
    }
  }, [http_training_wajib_one.result]);
  

  return (
    <TemplateAuth
      title={'Tambah Training Wajib untuk Karyawan'}
      admin={props.admin}
      noSidebar>
      <Flex
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Tambah Training Wajib untuk Karyawan'} />
        <DetailContainer title={'Pilih training'}>
          <XForm gap={'16px'} forms={[{
            label: 'Judul Training Wajib',
            key: 'judul',
            placeholder: 'Judul Training Wajib',
            type: 'text',
            value: data.title,
            onChange(title: string) {
              setData({
                ...data,
                title
              })
            },
          }, {
            label: 'Thumbnail',
            key: 'thumbnail',
            placeholder: 'Thumbnail',
            type: 'file',
            loading: loading_upload_thumbnail,
            value: data.thumbnail,
            async onChange(file: string) {
              const thumbnail = await uploadFile(file, setLoadingUploadThumbnail);
              setData({
                ...data,
                thumbnail
              })
            },
          }, {
            label: 'Level',
            key: 'level',
            placeholder: 'Level',
            type: 'dropdown',
            value: data.level,
            options: [{
              label: 'BASIC',
              value: 1,
            }, {
              label: 'INTERMEDIATE',
              value: 2,
            }, {
              label: 'ADVANCED',
              value: 3,
            }, {
              label: 'EXPERT',
              value: 4,
            }, {
              label: 'MASTER',
              value: 5,
            }],
            onChange(level: number) {
              setData({
                ...data,
                level
              })
            },
          }, {
            label: 'Description',
            key: 'description',
            placeholder: 'Description',
            type: 'textarea',
            value: data.description,
            onChange(description: string) {
              setData({
                ...data,
                description
              })
            },
          }, {
            label: 'Meeting Link',
            key: 'meeting-link',
            placeholder: 'Meeting Link',
            type: 'textarea',
            value: data.description,
            onChange(description: string) {
              setData({
                ...data,
                description
              })
            },
          }, {
            label: 'List Library',
            key: 'list-library',
            placeholder: 'List Library',
            type: 'multi-dropdown',
            options: http_library.result?.data.map((l: Library) => ({
              label: l.title,
              value: l.id
            })),
            values: data.list_library_id,
            onChange(list_library_id: number[]) {
              setData({
                ...data,
                list_library_id
              })
            },
          }, {
            label: 'List Participant',
            key: 'list-participant',
            placeholder: 'List Participant',
            type: 'multi-dropdown',
            values: data.list_organization_node_id,
            options: http_organization_node.result?.map((e: OrganizationNode) => ({
              label: e.name,
              value: e.id
            })),
            onChange(list_organization_node_id: number[]) {
              setData({
                ...data,
                list_organization_node_id
              })
            },
          }]} />
        </DetailContainer>
        <Flex 
          mt={'8px'}
          justify={'flex-end'}
          gap={'12px'}>
          <AButton 
            onClick={() => window.history.back()}
            variant={'outline'}>
            Batal
          </AButton>
          <AButton 
            isLoading={http_create_training_wajib.loading || http_edit_training_wajib.loading}
            onClick={submit}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
