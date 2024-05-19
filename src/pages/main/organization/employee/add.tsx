import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { useSelectTreeData } from '@/components/form/input/XInputSelectTree';
import { XForm } from '@/components/form/XForm';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination, uploadFile } from '@/util';
import { Flex, Image, Link, Text } from '@chakra-ui/react';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { JobProfile } from 'data-design/src/entity/JobProfile.entity';
import { Objective } from 'data-design/src/entity/Objective.entity';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export namespace KaryawanCreateDTO {
  export interface KaryawanCreateRequestData {
    job_profile_id: number
    proficiency_level: number
    is_job_profile_head?: boolean
    is_hr?: boolean
    is_ceo?: boolean
    is_superior?: boolean
    name: string
    password: string
    nik: string
    email: string
    phone_number: string
    photo?: string
    contribution_roti: number
    description: string
    list_label?: string[]
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();

  const http_init_karyawan: useHttpOutput<IPagination<Employee>> = useHttp({
    url: '/karyawan'
  });
  const http_init_org_node: useHttpOutput<OrganizationNode[]> = useHttp({
    url: '/onboarding/existing-organization-structure'
  });
  const http_get_job_profile_by_org_id: useHttpOutput<JobProfile[]> = useHttp({
    url: '/job-profile'
  });
  const http_get_one_karyawan: useHttpOutput<Employee> = useHttp({
    url: '/karyawan/:id'
  });
  const http_create_karyawan: useHttpOutput<Employee> = useHttp({
    url: '/karyawan'
  });
  const http_update_karyawan: useHttpOutput<Employee> = useHttp({
    url: '/karyawan/:id'
  });

  const { edit_id } = router.query;
  const tree = useSelectTreeData(http_init_org_node.result ?? []);
  const [loading_upload_file, setLoadingUploadFile] = useState<boolean>(false);
  const [data, setData] = useState<KaryawanCreateDTO.KaryawanCreateRequestData>({
    job_profile_id: '' as any,
    proficiency_level: '' as any,
    is_job_profile_head: false,
    is_hr: false,
    is_ceo: false,
    is_superior: false,
    name: '',
    password: '',
    nik: '',
    email: '',
    phone_number: '',
    photo: '',
    contribution_roti: '' as any,
    description: '',
  });
  const [organization_id, setOrgnizationID] = useState<number>();

  async function submit() {
    try {
      if (edit_id) {
        await http_update_karyawan.put(data, {
          params: {
            id: edit_id as string
          }
        })
      } else {
        await http_create_karyawan.post(data);
      }
      window.location.href = '/main/organization/employee';
    } catch (err) {
      //
    }
  }

  useEffect(() => {
    http_init_karyawan.get();
    http_init_org_node.get();
  }, []);

  useEffect(() => {
    if (edit_id) {
      http_get_one_karyawan.get({
        params: {
          id: edit_id as string
        }
      });
    }
  }, [edit_id]);

  useEffect(() => {
    if (http_get_one_karyawan.result) {
      setOrgnizationID(http_get_one_karyawan.result.job_profile.organization_node?.id);
      setData({
        job_profile_id: http_get_one_karyawan.result.job_profile.id,
        proficiency_level: http_get_one_karyawan.result.proficiency_level,
        is_job_profile_head: http_get_one_karyawan.result.is_job_profile_head,
        is_hr: http_get_one_karyawan.result.is_hr,
        is_ceo: http_get_one_karyawan.result.is_ceo,
        is_superior: http_get_one_karyawan.result.is_superior,
        name: http_get_one_karyawan.result.name,
        password: '',
        nik: http_get_one_karyawan.result.nik,
        email: http_get_one_karyawan.result.email,
        phone_number: http_get_one_karyawan.result.phone_number,
        photo: http_get_one_karyawan.result.photo,
        contribution_roti: +http_get_one_karyawan.result.contribution_roti,
        description: http_get_one_karyawan.result.description ?? '',
        list_label: (http_get_one_karyawan.result.list_label ?? []).map(x => x.label),
      });
      tree.onSelected([http_get_one_karyawan.result.job_profile.organization_node?.id]);
    }
  }, [http_get_one_karyawan.result])

  useEffect(() => {
    if (http_create_karyawan.error) {
      alert(http_create_karyawan.error);
    }
  }, [http_create_karyawan.error]);

  useEffect(() => {
    if (!organization_id) {
      return;
    }
    http_get_job_profile_by_org_id.get({
      query: {
        organization_id
      }
    });
  }, [organization_id]);

  return (
    <TemplateAuth
      title={edit_id ? 'Ubah Karyawan' : 'Tambah Karyawan'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 32px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={edit_id ? 'Ubah Karyawan' : 'Tambah Karyawan'} />
        <DetailContainer title={'Isi Profil Karyawan'}>
          <XForm gap={'16px'} forms={[{
            label: 'Nama Karyawan',
            key: 'name',
            placeholder: 'Nama Karyawan',
            type: 'text',
            value: data.name,
            onChange(name: string) {
              setData({
                ...data,
                name
              });
            },
          }, {
            label: 'Is CEO',
            key: 'is_ceo',
            placeholder: 'Is CEO',
            type: 'switch',
            value: data.is_ceo,
            onChange(is_ceo: boolean) {
              setData({
                ...data,
                is_ceo
              });
            },
          }, {
            label: 'Is HR',
            key: 'is_hr',
            placeholder: 'Is HR',
            type: 'switch',
            value: data.is_hr,
            onChange(is_hr: boolean) {
              setData({
                ...data,
                is_hr
              });
            },
          }, {
            label: 'Password',
            key: 'password',
            placeholder: 'Password',
            type: 'password',
            value: data.password,
            onChange(password: string) {
              setData({
                ...data,
                password
              });
            },
          }, {
            label: 'Organisasi',
            key: 'org',
            placeholder: 'Organisasi',
            type: 'select-tree',
            treeData: tree,
            loading: http_get_job_profile_by_org_id.loading,
            value: organization_id,
            onChange: setOrgnizationID,
          }, {
            label: 'Posisi',
            key: 'posisi',
            placeholder: 'Posisi',
            type: 'dropdown',
            createable: true,
            options: http_get_job_profile_by_org_id.result?.map((jp: JobProfile) => ({
              label: jp.name,
              value: jp.id
            })),
            value: data.job_profile_id,
            onChange(job_profile_id: number) {
              setData({
                ...data,
                job_profile_id
              });
            },
          }, {
            label: 'Proficiency Level',
            key: 'level',
            placeholder: 'Proficiency Level',
            type: 'dropdown',
            value: data.proficiency_level,
            options: [{
              label: '1. BASIC',
              value: 1,
            }, {
              label: '2. INTERMEDIATE',
              value: 2,
            }, {
              label: '3. ADVANCED',
              value: 3,
            }, {
              label: '4. EXPERT',
              value: 4,
            }, {
              label: '5. MASTER',
              value: 5,
            }],
            onChange(proficiency_level: number) {
              setData({
                ...data,
                proficiency_level
              })
            },
          }, {
            label: 'NIK',
            key: 'nama',
            placeholder: 'NIK',
            type: 'text',
            value: data.nik,
            onChange(nik: string) {
              setData({
                ...data,
                nik
              });
            },
          }, {
            label: 'Email',
            key: 'nama',
            placeholder: 'Email',
            type: 'text',
            value: data.email,
            onChange(email: string) {
              setData({
                ...data,
                email
              });
            },
          }, {
            label: 'No. HP',
            key: 'phone_number',
            placeholder: 'No. HP',
            type: 'text',
            value: data.phone_number,
            onChange(phone_number: string) {
              setData({
                ...data,
                phone_number
              });
            },
          }, {
            label: 'Photo',
            key: 'photo',
            placeholder: 'Photo',
            type: 'file',
            value: data.photo,
            loading: loading_upload_file,
            async onChange(_file: any) {
              const photo = await uploadFile(_file, setLoadingUploadFile);
              setData({
                ...data,
                photo
              });
            },
          }, {
            label: 'Contribution ROTI',
            key: 'contribution_roti',
            placeholder: 'Contribution ROTI',
            type: 'number',
            value: data.contribution_roti,
            onChange(contribution_roti: number) {
              setData({
                ...data,
                contribution_roti
              })
            },
          }, {
            label: 'Label',
            key: 'list_label',
            placeholder: 'Label',
            type: 'text',
            value: (data.list_label ?? []).join(','),
            onChange(value: string) {
              setData({
                ...data,
                list_label: value.split(',')
              })
            },
          }]} />
        </DetailContainer>
        <Flex 
          mt={'8px'}
          justify={'flex-end'}
          gap={'12px'}>
          <AButton 
            isLoading={http_create_karyawan.loading}
            onClick={() => window.history.back()}
            variant={'outline'}>
            Batal
          </AButton>
          <AButton 
            isLoading={http_create_karyawan.loading}
            onClick={submit}>
            Simpan
          </AButton>
        </Flex>
        <br/>
      </Flex>
    </TemplateAuth>
  );
}
