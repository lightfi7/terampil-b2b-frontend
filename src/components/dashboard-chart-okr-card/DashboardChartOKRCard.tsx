import { Flex, Image, Text } from "@chakra-ui/react";

interface DashboardChartOKRCardProps {
  bg?: string
}

export function DashboardChartOKRCard(props: DashboardChartOKRCardProps) {
  return (
    <Flex
      direction={'column'}
      borderRadius={7}
      p={'16px 12px'}
      color={'#FFF'}
      bg={(props.bg ?? '#29C56A') + 'EE'}
      flex={1}
      gap={'10px'}>
      <Flex
        gap={'6px'}
        align={'center'}>
        <Text
          fontSize={'.8em'}>
          Total Karyawan Partisipasi
        </Text>
        <Image 
          w={'12px'}
          h={'12px'}
          objectFit={'contain'}
          src={'/icons/light/icon-question-white.png'} />
      </Flex>
      <Text
        fontWeight={600}
        fontSize={'1.2em'}>
        500
      </Text>
      <Flex
        align={'center'}>
        <Image 
          w={'18px'}
          h={'18px'}
          objectFit={'contain'}
          src={'/icons/light/icon-down-white.png'} />
        <Text
          fontSize={'.8em'}>
          <span style={{ fontWeight: 500, fontSize: '1.1em' }}>28%</span> dari bulan sebelumnya
        </Text>
      </Flex>
    </Flex>
  );
}
