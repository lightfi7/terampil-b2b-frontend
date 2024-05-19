import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { TemplateAuth } from '@/template-auth';
import { Flex, Image, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export namespace AdminCreateDTO {
  export interface AdminCreateRequestData {
    nama: string;
    email: string;
    password: string;
    role_id: number;
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminCreateDTO.AdminCreateRequestData>({
    nama: '',
    email: '',
    password: '',
    role_id: '' as any
  });
  const [list_role, setListRole] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function init() {
    setLoading(true);
    try {
      setListRole((await axios.get('/role')).data.data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function createAdmin() {
    setLoading(true);
    try {
      await axios.post(`/admin`, admin);
      window.location.href = '/main/admin';
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
      title={'Create Admin'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Create Admin'} />
        <DetailContainer title={'Isi Detail Admin'}>
          <XForm gap={'16px'} forms={[{
            label: 'Name',
            key: 'nama',
            placeholder: 'Name',
            type: 'text',
            value: admin.nama,
            onChange(nama: string) {
              setAdmin({
                ...admin,
                nama
              });
            }
          }, {
            label: 'Email',
            key: 'email',
            placeholder: 'Email',
            type: 'text',
            value: admin.email,
            onChange(email: string) {
              setAdmin({
                ...admin,
                email
              });
            }
          }, {
            label: 'Password',
            key: 'password',
            placeholder: 'Password',
            type: 'password',
            value: admin.password,
            onChange(password: string) {
              setAdmin({
                ...admin,
                password
              });
            }
          }, {
            label: 'Role',
            key: 'type',
            placeholder: 'Role',
            type: 'dropdown',
            options: list_role.map((role: any) => ({
              label: role.name,
              value: role.id
            })),
            value: admin.role_id,
            onChange(role_id: number) {
              setAdmin({
                ...admin,
                role_id
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
            onClick={createAdmin}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
