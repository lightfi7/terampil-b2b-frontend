import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { TemplateAuth } from '@/template-auth';
import { Flex, Image, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, initAuthorizationToken, useTokenCookie, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export namespace RoleUpdateDTO {
  export interface RoleUpdateRequestData {
    name?: string;
    list_role_permission_id?: number[];
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const [role, setRole] = useState<RoleUpdateDTO.RoleUpdateRequestData>({});
  const [list_permission, setListPermission] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function init() {
    setLoading(true);
    try {
      setListPermission((await axios.get('/permission')).data.data);
      const role: any = (await axios.get(`/role/${id}`)).data;
      setRole({
        ...role,
        list_role_permission_id: role.list_role_permission.map((rp: any) => rp.permission.id)
      });
    } catch (err: any) {
      console.log(err);
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function updateRole() {
    setLoading(true);
    try {
      await axios.put(`/role/${id}`, role);
      window.location.href = '/main/role';
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
      title={'Update Role'}
      admin={props.admin}
      noSidebar>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Update Role'} />
        <DetailContainer title={'Isi Detail Role'}>
          <XForm gap={'8px'} forms={[{
            label: 'Name',
            key: 'name',
            placeholder: 'Name',
            type: 'text',
            value: role.name,
            required: true,
            onChange(name: string) {
              setRole({
                ...role,
                name
              });
            },
          }, {
            label: 'Permission',
            key: 'name',
            placeholder: 'Permission',
            type: 'multiple-check',
            required: true,
            options: list_permission.map((p: any) => ({
              label: p.label,
              value: p.id
            })),
            values: role.list_role_permission_id ?? [],
            onChange(list_role_permission_id: number[]) {
              setRole({
                ...role,
                list_role_permission_id
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
            onClick={updateRole}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
