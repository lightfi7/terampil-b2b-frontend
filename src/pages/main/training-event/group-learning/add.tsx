import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination, uploadFile } from '@/util';
import { Flex } from '@chakra-ui/react';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { GroupLearning } from 'data-design/src/entity/GroupLearning.entity';
import { GroupLearningLibrary } from 'data-design/src/entity/GroupLearningLibrary.entity';
import { GroupLearningParticipant } from 'data-design/src/entity/GroupLearningParticipant.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export namespace GroupLearningDTO {
  export interface Data {
    employee_pic_id?: number
    level: number
    name: string
    place: string
    detail?: string
    date_start: Date
    date_end: Date
    banner?: string
    trainer?: string
    budget: number
    online_meeting_link?: string
    list_employee_id: number[]
    list_library_id: number[]
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { edit_id } = router.query;

  const http_employees = useHttp<IPagination<Employee>>({
    url: '/karyawan'
  });
  const http_library = useHttp<IPagination<Library>>({
    url: '/library'
  });
  const http_create_group_learning = useHttp<GroupLearning>({
    url: '/group-learning'
  });
  const http_edit_group_learning = useHttp<GroupLearning>({
    url: `/group-learning/${edit_id}`
  });
  const http_group_learning_one = useHttp<GroupLearning>({
    url: `/group-learning/${edit_id}`
  });

  const [loading_upload, setLoadingUpload] = useState<boolean>(false);
  const [data, setData] = useState<GroupLearningDTO.Data>({
    level: '' as any,
    name: '',
    place: '',
    date_start: new Date(),
    date_end: new Date(),
    budget: '' as any,
    list_employee_id: [],
    list_library_id: []
  });

  async function init() {
    http_employees.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER
      }
    });
    http_library.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER
      }
    });
    if (edit_id) {
      await http_group_learning_one.get();
    }
  }

  async function submit() {
    if (edit_id) {
      http_edit_group_learning.put(data);
      window.location.href = '/main/training-event/group-learning';
      return;
    }
    http_create_group_learning.post(data);
    window.location.href = '/main/training-event/group-learning';
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (http_group_learning_one.result) {
      setData({
        employee_pic_id: http_group_learning_one.result?.employee_pic?.id ?? '' as any,
        level: http_group_learning_one.result?.level ?? '' as any,
        name: http_group_learning_one.result?.name ?? '',
        place: http_group_learning_one.result?.place ?? '',
        detail: http_group_learning_one.result?.detail ?? '',
        date_start: http_group_learning_one.result?.date_start ?? new Date(),
        date_end: http_group_learning_one.result?.date_end ?? new Date(),
        banner: http_group_learning_one.result?.banner ?? '',
        trainer: http_group_learning_one.result?.trainer ?? '',
        budget: http_group_learning_one.result?.budget ?? '' as any,
        list_employee_id: http_group_learning_one.result?.list_group_learning_participant.map((glp: GroupLearningParticipant) => glp.employee?.id) ?? [],
        list_library_id: http_group_learning_one.result?.list_group_learning_library.map((gll: GroupLearningLibrary) => gll.library?.id) ?? []
      });
    }
  }, [http_group_learning_one])

  return (
    <TemplateAuth
      title={'Tambah Group Learning untuk Karyawan'}
      admin={props.admin}
      noSidebar>
      <Flex
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Tambah Group Learning untuk Karyawan'} />
        <DetailContainer title={'Pilih training'}>
          <XForm gap={'16px'} forms={[{
            label: 'Judul Group Learning',
            key: 'judul',
            placeholder: 'Judul Group Learning',
            type: 'text',
            value: data.name,
            onChange(name: string) {
              setData({
                ...data,
                name
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
            label: 'PIC',
            key: 'pic',
            placeholder: 'Pilih PIC',
            type: 'dropdown',
            options: http_employees.result?.data.map((e: Employee) => ({
              label: e.name,
              value: e.id
            })) ?? [],
            value: data.employee_pic_id,
            onChange(employee_pic_id: number) {
              setData({
                ...data,
                employee_pic_id
              })
            },
          }, {
            label: 'Tempat',
            key: 'place',
            placeholder: 'Tempat',
            type: 'text',
            value: data.place,
            onChange(place: string) {
              setData({
                ...data,
                place
              })
            },
          }, {
            label: 'Meeting Link',
            key: 'meeting-link',
            placeholder: 'Meeting Link',
            type: 'text',
            value: data.online_meeting_link,
            onChange(online_meeting_link: string) {
              setData({
                ...data,
                online_meeting_link
              })
            },
          }, {
            label: 'Detail',
            key: 'detail',
            placeholder: 'Detail',
            type: 'textarea',
            value: data.detail,
            onChange(detail: string) {
              setData({
                ...data,
                detail
              })
            },
          }, {
            label: 'Tanggal',
            key: 'tanggal',
            start: data.date_start,
            end: data.date_end,
            placeholder: 'Tanggal Mulai',
            placeholder2: 'Tanggal Selesai',
            onRangeChange(date_start?: Date, date_end?: Date) {
              setData({
                ...data,
                date_start: date_start ?? new Date(),
                date_end: date_end ?? new Date()
              })
            },
            type: 'range-date'
          }, {
            label: 'Banner',
            key: 'banner',
            placeholder: 'Banner',
            type: 'file',
            value: data.banner,
            loading: loading_upload,
            async onChange(file: string) {
              const banner: string | undefined = await uploadFile(file, setLoadingUpload);
              setData({
                ...data,
                banner
              })
            },
          }, {
            label: 'Trainer',
            key: 'trainer',
            placeholder: 'Trainer',
            type: 'text',
            value: data.trainer,
            onChange(trainer: string) {
              setData({
                ...data,
                trainer
              })
            },
          }, {
            label: 'Budget',
            key: 'budget',
            placeholder: 'Budget',
            type: 'number',
            value: data.budget,
            onChange(budget: number) {
              setData({
                ...data,
                budget
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
            values: data.list_employee_id,
            options: http_employees.result?.data.map((e: Employee) => ({
              label: e.name,
              value: e.id
            })),
            onChange(list_employee_id: number[]) {
              setData({
                ...data,
                list_employee_id
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
            isLoading={http_create_group_learning.loading || http_edit_group_learning.loading}
            onClick={submit}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
