import { Flex, Text } from "@chakra-ui/react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";
import { useState } from "react";

export interface ChangePasswordData {
  old: string
  new: string
}

interface EditPasswordProps {
  data: ChangePasswordData
  setData(data: ChangePasswordData): void
  onSubmit(): void
}

export function EditPassword(props: EditPasswordProps) {
  const [renew_password, setReNewPassword] = useState<string>('');

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
        <Flex
          direction={'column'}
          gap={'4px'}>
          <Text
            fontWeight={700}>
            Kata Sandi
          </Text>
          <Text
            fontSize={'.85em'}
            color={'#626262'}>
            Kata sandi minimal 8 karakter, terdiri dari huruf kapital, huruf kecil, simbol dan angka.
          </Text>
        </Flex>
        <XForm
          gap={'15px'}
          forms={[{
            type: 'password',
            key: 'sandi_lama',
            label: 'Kata Sandi Lama',
            placeholder: 'Masukkan Kata Sandi Lama',
            value: props.data.old,
            containerStyle: {
              padding: 0
            },
            onChange(value: string) {
              props.setData({
                ...props.data,
                old: value
              })
            }
          }, {
            type: 'password',
            key: 'sandi_lama',
            label: 'Kata Sandi Baru',
            placeholder: 'Buat kata sandi baru',
            value: props.data.new,
            containerStyle: {
              padding: 0
            },
            onChange(value: string) {
              props.setData({
                ...props.data,
                new: value
              })
            }
          }, {
            type: 'password',
            key: 'sandi_lama',
            label: 'Konfirmasi Kata Sandi Baru',
            placeholder: 'Konfirmasi Kata Sandi Baru',
            value: renew_password,
            containerStyle: {
              padding: 0
            },
            onChange: setReNewPassword,
          }]} />
        <Flex
          alignSelf={'flex-end'}>
          <AButton
            onClick={() => {
              if (!props.data.old) {
                alert('Password lama tidak boleh kosong');
                return;
              }
              if (!props.data.new) {
                alert('Password baru tidak boleh kosong');
                return;
              }
              if (!renew_password) {
                alert('Konfirmasi Password baru tidak boleh kosong');
                return;
              }
              if (props.data.new !== renew_password) {
                alert('Password baru tidak sama');
                return;
              }
              props.onSubmit();
            }}
            variant={'outline'}>
            Simpan
          </AButton>
        </Flex>
      </Flex>
    </Flex>
  );
}
