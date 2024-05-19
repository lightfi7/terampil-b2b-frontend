
import { Button, Checkbox, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XInputText } from "../form/input/XInputText";
import { XForm } from "../form/XForm";
import { OSNodeData } from "../organization-structure-tree/node.utility";

interface ModalContentOrgTreeFormProps {
  onSubmit?(): void
  onCancel?(): void
  onDelete?(data: OSNodeData): void
  data?: OSNodeData
  setData(data: OSNodeData): void
  loading?: boolean
}

export function ModalContentOrgTreeForm(props: ModalContentOrgTreeFormProps) {
  const [feedback, setFeedback] = useState<string>('');

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit();
  }

  function onJobProfileChange(i: number, value: string) {
    props.setData({
      ...props.data!,
      list_job_profile: [
        ...props.data!.list_job_profile!.slice(0, i),
        {
          ...props.data!.list_job_profile![i],
          title: value
        },
        ...props.data!.list_job_profile!.slice(i + 1)
      ]
    });
  }

  function onJobProfileDelete(i: number) {
    props.setData({
      ...props.data!,
      list_job_profile: [
        ...props.data!.list_job_profile!.slice(0, i),
        ...props.data!.list_job_profile!.slice(i + 1)
      ]
    });
  }

  function onJobProfileAdd() {
    props.setData({
      ...props.data!,
      list_job_profile: [
        ...props.data!.list_job_profile,
        {
          title: ''
        }
      ]
    });
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}
      mt={'-12px'}>
      <XForm
        gap={'8px'}
        labelStyle={{
          padding: 0
        }}
        forms={[{
          label: 'Nama Organisasi',
          key: 'nama',
          placeholder: 'Nama Organisasi',
          type: 'text',
          value: props.data?.label,
          onChange(label: string) {
            props.setData({
              ...props.data!,
              label
            });
          },
        }, {
          label: 'Posisi PIC',
          key: 'posisi_pic',
          placeholder: 'Posisi PIC',
          type: 'text',
          value: props.data?.position,
          onChange(position: string) {
            props.setData({
              ...props.data!,
              position
            });
          },
        }, {
          label: 'Nama PIC',
          key: 'nama_pic',
          placeholder: 'Nama PIC',
          type: 'text',
          value: props.data?.pic,
          onChange(pic: string) {
            props.setData({
              ...props.data!,
              pic
            });
          },
        }, {
          label: 'Alamat',
          key: 'alamt',
          placeholder: 'Alamat',
          type: 'textarea',
          value: props.data?.address,
          onChange(address: string) {
            props.setData({
              ...props.data!,
              address
            });
          },
        }]} />
      <Flex
        direction={'column'}
        mt={'12px'}
        gap={'8px'}>
        <Flex 
          direction={'column'}
          gap={'8px'}>
          {
            (props.data!.list_job_profile ?? []).map((job_profile: { title: string }, i: number) => (
              <Flex
                key={`x-${i}`}
                align={'center'}
                justify={'space-between'}
                p={'5px 10px'}
                border={'solid 1px #EEE'}
                borderRadius={10}
                gap={'10px'}>
                <Checkbox
                  isChecked={props.data!.head_index == i}
                  onChange={(e) => props.setData({ ...props.data!, head_index: e.target.checked ? i : undefined })}>
                  <Text
                    fontSize={'.7em'}>
                    Is Head?
                  </Text>
                </Checkbox>
                <XInputText
                  containerStyle={{ padding: 0, flex: 1 }}
                  key={String(i)} 
                  onChange={(value: string) => onJobProfileChange(i, value)}
                  value={job_profile.title}
                  placeholder={'Job Profile'}
                  type={"text"} />
                <Text 
                  fontSize={'.7em'}
                  cursor={'pointer'}
                  color={'red.600'}
                  onClick={() => onJobProfileDelete(i)}>
                  Hapus
                </Text>
              </Flex>
            ))
          }
        </Flex>
        { props.onSubmit && <Button
          border={'dashed 1px #005CB9'}
          borderRadius={8}
          bg={'none'}
          fontWeight={400}
          fontSize={'.8em'}
          h={'35px'}
          color={'#005CB9'}
          onClick={onJobProfileAdd}>
          + Tambah Job Profile
        </Button> }
      </Flex>
      { props.onSubmit && <Flex
        mt={'24px'}
        justify={'space-between'}
        gap={'16px'}>
        <AButton
          isLoading={props.loading}
          h={'42px'}
          w={'100%'}
          onClick={props.onCancel}
          variant={'outline'}>
          Batal
        </AButton>
        <AButton
          h={'42px'}
          w={'100%'}
          onClick={submit}>
          Simpan
        </AButton>
      </Flex> }
    </Flex>
  );
}
