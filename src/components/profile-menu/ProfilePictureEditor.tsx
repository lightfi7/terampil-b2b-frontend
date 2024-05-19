import { Box, Flex, Image, Input, Text } from "@chakra-ui/react";
import { useRef } from "react";

interface ProfilePictureEditorProps {
  loading?: boolean
  value?: string
  onFileChange?(file: any): void
}

export function ProfilePictureEditor(props: ProfilePictureEditorProps) {
  const ref = useRef(null);

  function onFileChange(e: any) {
    if (!props.onFileChange) {
      return;
    }
    const files = e.target.files;
    if (!files) {
      return;
    }
    props.onFileChange(files[0]);
  }

  return (
    <Flex
      cursor={'pointer'}
      align={'center'}
      justify={'center'}
      position={'relative'}
      w={'140px'}
      h={'140px'}
      onClick={() => (ref.current as any).click()}>
      <Image
        position={'absolute'}
        src={props.value}
        objectFit={'cover'}
        w={'100%'}
        h={'100%'}
        borderRadius={999} />
      <Box
        position={'absolute'}
        w={'100%'}
        h={'100%'}
        borderRadius={999}
        bg={'#0009'} />
      <Text
        zIndex={9}
        p={'12px'}
        fontSize={'.85em'}
        fontWeight={700}
        color={'#FFF'}
        textAlign={'center'}>
        Upload Foto Profil
      </Text>
      <Input 
        ref={ref}
        type={'file'} 
        onChange={onFileChange}
        hidden />
    </Flex>
  );
}
