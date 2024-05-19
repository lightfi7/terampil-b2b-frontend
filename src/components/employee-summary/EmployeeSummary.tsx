import { Flex, Image, Text } from "@chakra-ui/react";
import moment from "moment";
import { ContainerGradient } from "../container-gradient/ContainerGradient";
import { numberFormatter0 } from "../input-number";

interface EmployeeSummaryProps {
  totalEmployee?: number
  totalTrainingProposal?: number
}

export function EmployeeSummary(props: EmployeeSummaryProps) {
  return (
    <ContainerGradient 
      p={'24px 18px'}
      justify={'space-between'}
      align={'center'}>
      <Flex
        gap={'32px'}
        flex={1}>
        <Image 
          w={'80px'}
          h={'80px'}
          objectFit={'contain'}
          src={'/icons/light/icon-user-big.png'} />
        <Flex
          align={'center'}
          gap={'28px'}>
          <Flex 
            direction={'column'}
            gap={'12px'}>
            <Text 
              fontWeight={600}
              fontSize={'1.1em'}>
              Total Karyawan Daftar
            </Text>
            <Text
              fontSize={'.76em'}>
              Update { moment().format('DD MMM YYYY, HH:mm') }
            </Text>
          </Flex>
          <Text 
            fontSize={'2em'}
            fontWeight={700}>
            { numberFormatter0.format(props.totalEmployee ?? 0) }
          </Text>
        </Flex>
      </Flex>
      <Flex h={'90%'} w={'1px'} bg={'#FFF'} />
      <Flex
        align={'center'}
        gap={'28px'}
        flex={1}
        pl={'36px'}>
        <Flex 
          direction={'column'}
          gap={'12px'}>
          <Text 
            fontWeight={600}
            fontSize={'1.1em'}>
            Training yang diikuti
          </Text>
          <Text
            fontSize={'.76em'}>
            Jumlah training yang sudah diikuti<br/>oleh karyawan
          </Text>
        </Flex>
        <Flex align={'flex-end'}>
          <Text 
            fontSize={'2em'}
            fontWeight={700}>
            { numberFormatter0.format(props.totalTrainingProposal ?? 0) }
          </Text>
          <Text 
            mb={'.5em'}
            ml={'8px'}
            fontSize={'1em'}
            fontWeight={500}>
            training
          </Text>
        </Flex>
      </Flex>
    </ContainerGradient>
  );
}
