import { AButton } from '@/components/button/AButton';
import { XForm } from '@/components/form/XForm';
import { TemplateAuth } from '@/template-auth';
import { Flex, Image, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export namespace AdminCreateDTO {
  export interface AdminCreateRequestData {
    name: string;
    list_role_permission_id: number[];
  }
}

export default function(props: WithAdminPageProps) {
  const [role, setRole] = useState<AdminCreateDTO.AdminCreateRequestData>({
    name: '',
    list_role_permission_id: []
  });
  const [list_permission, setListPermission] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function init() {
    setLoading(true);
    try {
      setListPermission((await axios.get('/permission')).data.data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function createAdmin() {
    setLoading(true);
    try {
      await axios.post(`/role`, role);
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
      admin={props.admin}>
      <Flex 
        direction={'column'}
        gap={'12px'}>
        <Flex 
          align={'center'}
          gap={'12px'}>
          <Link onClick={() => window.history.back()}>
            <Image 
              src={'/icons/icon-arrow-down-2.svg'}
              w={'40px'}
              h={'40px'}
              p={'8px'}
              transform={'rotate(90deg)'} />
          </Link>
          <Text 
            fontSize={'1.9em'}
            fontWeight={900}>
            Create Admin
          </Text>
        </Flex>
        <Flex
          direction={'column'} 
          bg={'#FFF'}
          p={'24px 24px'}
          gap={'8px'}
          borderRadius={12}>
          <XForm gap={'8px'} forms={[{
            label: 'Name',
            key: 'name',
            placeholder: 'Name',
            type: 'text',
            value: role.name,
            onChange(name: string) {
              setRole({
                ...role,
                name
              });
            }
          }, {
            label: 'Permission',
            key: 'name',
            placeholder: 'Permission',
            type: 'multiple-check',
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
        </Flex>
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
