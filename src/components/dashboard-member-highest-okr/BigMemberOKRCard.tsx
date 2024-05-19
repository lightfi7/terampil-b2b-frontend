import { calculateOKR } from "@/util";
import { Flex, Image, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { EmployeeWithOKR } from "../dashboard-sub-page/DashboardPersonal";
import { ProgressValue } from "../progress-value/ProgressValue";

interface BigMemberOKRCardProps {
  employee: Employee
  value: number
  i?: string
  keyword?: string
}

export function BigMemberOKRCard(props: BigMemberOKRCardProps) {
  return (
    <Flex
      boxShadow={'0px 2px 10px rgba(0, 0, 0, .1)'}
      bg={'#FFF'}
      borderRadius={12}
      p={'18px'}
      fontSize={'.85em'}>
      <Flex
        bgGradient={'linear-gradient(180deg, #0161BA 0%, #01C2BF 100%)'}
        borderRadius={999}
        h={'32px'}
        fontSize={'.9em'}
        w={'32px'}
        align={'center'}
        justify={'center'}
        color={'#FFF'}>
        <Text
          fontWeight={600}>
          { props.i ?? '' }
        </Text>
      </Flex>
      <Flex
        flex={1}
        direction={'column'}
        gap={'12px'}>
        <Flex
          gap={'16px'}>
          <Flex
            align={'center'}
            direction={'column'}
            gap={'12px'}
            flex={3}>
            <Image
              bg={'#EEE'}
              objectFit={'cover'}
              w={'100px'}
              h={'100px'}
              src={props.employee.photo}
              borderRadius={999} />
            <Text
              fontWeight={700}
              fontSize={'1.1em'}>
              { props.employee.name }
            </Text>
          </Flex>
          <Flex
            flex={7}
            mt={'12px'}
            direction={'column'}>
            <Text
              color={'#0263BB'}
              fontWeight={700}
              fontSize={'1.1em'}>
              Top Performer
            </Text>
            <Text
              mt={'8px'}
              color={'#252525'}>
              Penempatan
            </Text>
            <Text
              color={'#898989'}>
              { props.employee.job_profile?.organization_node?.name }
            </Text>
            <Text
              mt={'8px'}
              color={'#252525'}>
              Posisi & Divisi
            </Text>
            <Text
              color={'#898989'}>
              { props.employee.job_profile?.name }
            </Text>
          </Flex>
        </Flex>
        <Flex
          align={'center'}
          gap={'12px'}
          p={'0 24px'}>
          <Text
            fontWeight={700}>
            { props.keyword ?? 'OKRs' }
          </Text>
          <ProgressValue
            bgGradient={'linear-gradient(90deg, #02D1BF 13.61%, #0162BA 92.78%)'}
            h={'6px'}
            progress={(props.value ?? 0) / 100} />
          <Text
            fontWeight={700}>
            { (props.value ?? 0).toFixed(2) }%
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
