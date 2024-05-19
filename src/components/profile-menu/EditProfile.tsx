import { uploadFile } from "@/util";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";
import { ProfilePictureEditor } from "./ProfilePictureEditor";

export interface UpdateProfileData {
  photo?: string
  nik: string
  nama: string
  email: string
  phone: string
}

interface EditProfileProps {
  karyawan: Employee
  data: UpdateProfileData
  loading?: boolean
  onChange(data: UpdateProfileData): void
  onSubmit?(): void
}

export function EditProfile(props: EditProfileProps) {
  const [loading_upload, setLoadingUpload] = useState<boolean>(false);

  async function uploadPicture(file: any) {
    const url = await uploadFile(file, setLoadingUpload);
    if (props.onChange) {
      props.onChange({
        ...props.data,
        photo: url
      });
    }
  }

  return (
    <Flex
      direction={'column'}
      w={'100%'}
      boxShadow={'0px 1px 14px rgba(0, 0, 0, .2)'}
      borderRadius={8}>
      <Flex
        direction={'column'}
        w={'100%'}
        p={'18px 24px'}
        gap={'24px'}>
        <Text
          fontWeight={700}>
          Profil Saya
        </Text>
        <ProfilePictureEditor
          loading={loading_upload}
          value={props.data.photo}
          onFileChange={uploadPicture} />
        <XForm
          gap={'15px'}
          forms={[{
            type: 'text',
            key: 'nama',
            label: 'NIK',
            placeholder: 'NIK',
            required: true,
            value: props.data.nik,
            containerStyle: {
              padding: 0
            },
            onChange(nik: string) {
              props.onChange({
                ...props.data,
                nik
              });
            },
          }, {
            type: 'text',
            key: 'nama',
            label: 'Nama',
            placeholder: 'Nama',
            required: true,
            value: props.data.nama,
            containerStyle: {
              padding: 0
            },
            onChange(nama: string) {
              props.onChange({
                ...props.data,
                nama
              });
            },
          }, {
            type: 'text',
            key: 'email',
            label: 'Email',
            placeholder: 'Email',
            required: true,
            value: props.data.email,
            containerStyle: {
              padding: 0
            },
            onChange(email: string) {
              props.onChange({
                ...props.data,
                email
              });
            },
          }, {
            type: 'text',
            key: 'nomor_hp',
            label: 'Nomor HP',
            placeholder: 'Nomor HP',
            required: true,
            value: props.data.phone,
            containerStyle: {
              padding: 0
            },
            onChange(phone: string) {
              props.onChange({
                ...props.data,
                phone
              });
            },
          }, {
            type: 'text',
            key: 'ov',
            label: 'Job Profile',
            placeholder: 'Job Profile',
            disabled: true,
            value: props.karyawan.job_profile?.name,
            containerStyle: {
              padding: 0
            },
          }, {
            type: 'text',
            key: 'oh',
            label: 'Divisi',
            placeholder: 'Divisi',
            disabled: true,
            value: props.karyawan.job_profile?.organization_node?.name,
            containerStyle: {
              padding: 0
            },
          }]} />
        <Flex
          alignSelf={'flex-end'}>
          <AButton
            isLoading={props.loading}
            onClick={props.onSubmit}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </Flex>
  );
}
