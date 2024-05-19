import { AButton } from '@/components/button/AButton';
import YearPicker from '@/components/date-picker/YearPicker';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { ObjectiveKeyResult } from '@/components/objective-key-result/ObjectiveKeyResult';
import { ChangePasswordData, EditPassword } from '@/components/profile-menu/EditPassword';
import { EditProfile, UpdateProfileData } from '@/components/profile-menu/EditProfile';
import { ProfileMenu } from '@/components/profile-menu/ProfileMenu';
import { TemplateAuth } from '@/template-auth';
import { Flex, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [menu, setMenu] = useState<'profil' | 'password'>('profil');
  const [update_profile_data, setUpdateProfileData] = useState<UpdateProfileData>({
    photo: props.admin.photo,
    nik: props.admin.nik,
    nama: props.admin.name,
    email: props.admin.email,
    phone: props.admin.phone_number ?? '',
  });
  const [change_password_data, setChangePasswordData] = useState<ChangePasswordData>({
    old: '',
    new: ''
  });

  async function updateProfle() {
    setLoading(true);
    try {
      await axios.put('/profile', update_profile_data);
      alert('Berhasil disimpan.');
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function changePassword() {
    setLoading(true);
    try {
      await axios.put('/password', change_password_data);
      alert('Password berhasil diubah.');
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function init() {
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'My Profile'}>
      <Flex 
        p={'0 14px'}
        mt={'12px'}
        gap={'24px'}>
        <Flex
          flex={1}
          align={'flex-start'}>
          <Flex
            position={'sticky'}
            top={0}
            w={'100%'}>
            <ProfileMenu
              active={menu}
              options={[{
                label: 'Ubah Profil',
                key: 'profil'
              }, {
                label: 'Atur Kata Sandi',
                key: 'password'
              }]}
              onChange={setMenu} />
          </Flex>
        </Flex>
        <Flex
          flex={4}>
          { menu === 'profil' && <EditProfile 
            karyawan={props.admin}
            data={update_profile_data}
            onChange={setUpdateProfileData}
            loading={loading}
            onSubmit={updateProfle} /> }
          { menu === 'password' && <EditPassword
            data={change_password_data}
            setData={setChangePasswordData}
            onSubmit={changePassword} /> }
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
