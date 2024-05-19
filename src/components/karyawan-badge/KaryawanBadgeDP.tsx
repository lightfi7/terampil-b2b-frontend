import { Flex, Image, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { AButton } from "../button/AButton";
import { ContainerGradient } from "../container-gradient/ContainerGradient";
import MonthPicker from "../date-picker/MonthPicker";
import TerampilPieChart from "../terampil-pie-chart/TerampilPieChart";

interface KaryawanBadgeDPProps {
  employee?: Employee
}

export function KaryawanBadgeDP(props: KaryawanBadgeDPProps) {
  return (
    <ContainerGradient 
      mt={'24px'}
      p={'36px 4%'}
      pb={'42px'}
      w={'100%'}
      gap={'8%'}>
      <Flex 
        direction={'column'}
        align={'center'}
        mt={'-56px'}
        gap={'12px'}>
        <Flex 
          bg={'#FFF'}
          borderRadius={9999}>
          <TerampilPieChart 
            d={'150px'}
            outerRadius={74}
            innerRadius={60}
            data={[{
              name: 'Selesai',
              color: '#29C56A',
              value: 0
            }, {
              name: 'Belum',
              color: '#C4C4C4',
              value: 100
            }]}
            centerValue={'0%'} />
        </Flex>
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
            Progress Training { props.employee?.name }
          </Text>
          <Text 
            fontSize={'.9em'}>
            Progress { props.employee?.name } dalam mengikuti 0 training
          </Text>
          <Flex 
            direction={'column'}
            gap={'12px'}>
            <Flex>
              <AButton 
                variant={'outline'}
                borderColor={'#FFF'}
                color={'#FFF'}
                borderRadius={999}>
                0 training dalam proses
              </AButton>
            </Flex>
            <Flex>
              <AButton 
                variant={'outline'}
                borderColor={'#FFF'}
                color={'#FFF'}
                borderRadius={999}>
                0 training sudah selesai
              </AButton>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </ContainerGradient>
  );
}
