import { Flex, Image, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { AButton } from "../button/AButton";
import { ContainerGradient } from "../container-gradient/ContainerGradient";
import MonthPicker from "../date-picker/MonthPicker";

interface KaryawanBadgeSimpleProps {
  employee?: Employee
}

export function KaryawanBadgeSimple(props: KaryawanBadgeSimpleProps) {
  return (
    <ContainerGradient 
      mt={'24px'}
      p={'36px 4%'}
      pb={'42px'}
      w={'100%'}
      gap={'3%'}>
      <Flex 
        direction={'column'}
        align={'center'}
        mt={'-56px'}
        gap={'12px'}>
        <Image
          bg={'#EEE'}
          w={'150px'}
          h={'150px'}
          borderRadius={9999}
          border={'solid 2px #FFF'}
          borderColor={'brand'}
          objectFit={'cover'} />
        {/* <AButton 
          variant={'outline'}
          color={'#FFF'}
          padding={'3px 12px'}
          fontSize={'.85em'}
          borderColor={'#FFF'}>
          Ubah Profil
        </AButton> */}
      </Flex>
      <Flex 
        flex={1}>
        <Flex 
          alignSelf={'center'}
          flex={1}
          gap={'12px'}
          direction={'column'}>
          <Text 
            fontSize={'1.5em'}
            fontWeight={600}>
            { props.employee?.name }
          </Text>
          <Flex 
            direction={'column'}
            gap={'4px'}>
            <Text 
              fontSize={'.8em'}>
              Penempatan
            </Text>
            <Text
              fontSize={'.95em'}
              fontWeight={600}>
              { props.employee?.job_profile?.name }
            </Text>
          </Flex>
          <Flex 
            direction={'column'}
            gap={'4px'}>
            <Text
              fontSize={'.8em'}>
              Divisi &amp; Posisi
            </Text>
            <Text
              fontSize={'.95em'}
              fontWeight={600}>
              { props.employee?.job_profile?.organization_node?.name }
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </ContainerGradient>
  );
}
