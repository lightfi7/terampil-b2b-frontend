import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { uploadFile } from '@/util';
import { Flex, Image, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Library, LibraryCategory, LibraryLabel, LibraryType } from 'data-design/src/entity/Library.entity';
import { Training } from 'data-design/src/entity/Training.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DaftarLibrary } from '.';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export namespace LibraryUpdateDTO {
  export interface LibraryUpdateRequestData {
    title: string
    type: LibraryType
    label?: LibraryLabel
    price?: number
    category: LibraryCategory
    description?: string
    length_minutes?: number
    file?: string
    thumbnail?: string
    tags: string[]
    ref_id?: number
    is_micro_learning: boolean
    trainer_name?: string
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const http_b2c_training = useHttp<Training[]>({
    url: '/b2c-training'
  });

  const [data, setData] = useState<LibraryUpdateDTO.LibraryUpdateRequestData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loading_upload, setLoadingUpload] = useState<boolean>(false);

  async function init() {
    setLoading(true);
    try {
      const library: Library = (await axios.get(`/library/${id}`)).data;
      setData(library);
      http_b2c_training.get();
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function updateData() {
    setLoading(true);
    try {
      await axios.put(`/library/${id}`, data);
      window.location.href = '/main/library/knowledge-training';
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      title={'Create Library'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Create Library'} />
        <DetailContainer title={'Isi Detail Library'}>
          <XForm gap={'16px'} forms={[{
            label: 'Jenis Materi',
            key: 'type',
            placeholder: 'Jenis Materi',
            type: 'dropdown',
            options: Object.values(LibraryType).map((value: any) => ({
              label: value,
              value
            })),
            value: data?.type,
            onChange(type: LibraryType) {
              setData({
                ...data!,
                type,
                ref_id: type !== LibraryType.ON_DEMAND_VIDEO_TRAINING ? undefined : data?.ref_id
              });
            }
          }, {
            label: 'Pilih Training',
            key: 'type',
            placeholder: 'Pilih Training',
            type: 'dropdown',
            options: http_b2c_training.result?.map((t: Training) => ({
              label: t.title,
              value: t.id
            })),
            hide: data?.type !== LibraryType.ON_DEMAND_VIDEO_TRAINING,
            value: data?.ref_id,
            onChange(ref_id: number) {
              setData({
                ...data!,
                ref_id
              });
            }
          }, {
            label: 'Thumbnail',
            key: 'thumbnail',
            placeholder: 'Thumbnail',
            type: 'file',
            value: data?.thumbnail,
            async onChange(file: any) {
              const thumbnail = await uploadFile(file, setLoadingUpload);
              setData({
                ...data!,
                thumbnail
              });
            }
          }, {
            label: 'Judul Materi',
            key: 'title',
            placeholder: 'Judul Materi',
            type: 'text',
            value: data?.title,
            onChange(title: string) {
              setData({
                ...data!,
                title
              });
            }
          }, {
            label: 'Trainer / Author',
            key: 'authro',
            placeholder: 'Trainer / Author',
            type: 'text',
            value: data?.trainer_name,
            onChange(trainer_name: string) {
              setData({
                ...data!,
                trainer_name
              });
            }
          }, {
            label: 'Micro Learning',
            key: 'is_micro_learning',
            placeholder: 'Micro Learning',
            type: 'radio-tick',
            value: data?.is_micro_learning ? 1 : 0,
            options: [{
              label: 'Yes',
              value: 1
            }, {
              label: 'No',
              value: 0
            }],
            onChange(is_micro_learning: number) {
              setData({
                ...data!,
                is_micro_learning: is_micro_learning === 1
              });
            }
          }, {
            label: 'Jenis Materi',
            key: 'type',
            placeholder: 'Jenis Materi',
            type: 'dropdown',
            options: Object.values(LibraryType).map((value: any) => ({
              label: value,
              value
            })),
            value: data?.type,
            onChange(type: LibraryType) {
              setData({
                ...data!,
                type
              });
            }
          }, {
            label: 'Label',
            key: 'label',
            placeholder: 'Label',
            type: 'dropdown',
            options: Object.values(LibraryLabel).map((value: any) => ({
              label: value,
              value
            })),
            value: data?.label,
            onChange(label: LibraryLabel) {
              setData({
                ...data!,
                label
              });
            }
          }, {
            label: 'Harga',
            key: 'harga',
            placeholder: 'Harga',
            type: 'number',
            value: data?.price,
            onChange(price: number) {
              setData({
                ...data!,
                price
              });
            }
          }, {
            label: 'Kategori',
            key: 'category',
            placeholder: 'Kategori',
            type: 'dropdown',
            options: Object.keys(LibraryCategory).map((value: any) => ({
              label: value,
              value
            })),
            value: data?.category,
            onChange(category: LibraryCategory) {
              setData({
                ...data!,
                category
              });
            }
          }, {
            label: 'Detail Singkat',
            key: 'description',
            placeholder: 'Detail Singkat',
            type: 'textarea',
            value: data?.description,
            onChange(description: string) {
              setData({
                ...data!,
                description
              });
            }
          }, {
            label: 'Total Waktu',
            key: 'length_minutes',
            placeholder: 'Total Waktu',
            type: 'number',
            value: data?.length_minutes,
            onChange(length_minutes: number) {
              setData({
                ...data!,
                length_minutes
              });
            }
          }, {
            label: 'Daftar Tag',
            key: 'tags',
            placeholder: 'Daftar Tag',
            type: 'text',
            value: data?.tags.join(' '),
            onChange(str_tag: string) {
              setData({
                ...data!,
                tags: str_tag.split(/\s+/).filter(Boolean)
              });
            }
          }, {
            label: 'File',
            key: 'file',
            placeholder: 'File',
            type: 'file',
            value: data?.file,
            async onChange(_file: any) {
              const file = await uploadFile(_file, setLoadingUpload);
              setData({
                ...data!,
                file
              });
            }
          }]} />
        </DetailContainer>
        <Flex 
          mt={'8px'}
          justify={'flex-end'}
          gap={'12px'}>
          <AButton 
            isLoading={loading}
            onClick={() => window.history.back()}
            variant={'outline'}>
            Batal
          </AButton>
          <AButton 
            isLoading={loading}
            onClick={updateData}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
