import { calculateOKR } from "@/util";
import { Flex, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { EmployeeWithOKR } from "../dashboard-sub-page/DashboardPersonal";

interface SmallMemberOKRCardProps {
  i: number
  employee: Employee
  value: number
  keyword?: string
}

export function SmallMemberOKRCard(props: SmallMemberOKRCardProps) {
  return (
    <Flex
      boxShadow={'0px 0px 4px rgba(0, 0, 0, 0.15)'}
      bg={'#FFF'}
      borderRadius={8}
      p={'12px'}
      flex={1}
      fontSize={'.8em'}
      align={'center'}
      gap={'7px'}>
      <Text
        fontWeight={700}
        fontSize={'1.1em'}
        color={'blue.500'}>
        { props.i }th
      </Text>
      <Text
        flex={1}
        fontWeight={700}
        fontSize={'1.1em'}>
        { props.employee.name }
      </Text>
      <Flex 
        flex={1}
        direction={'column'}>
        <Text
          fontSize={'.8em'}
          color={'#252525'}>
          Penempatan
        </Text>
        <Text
          color={'#898989'}>
          { props.employee.job_profile?.organization_node?.name }
        </Text>
      </Flex>
      <Flex 
        flex={1}
        direction={'column'}>
        <Text
          fontSize={'.8em'}
          color={'#252525'}>
          Posisi & Divisi
        </Text>
        <Text
          color={'#898989'}>
          { props.employee.job_profile?.name }
        </Text>
      </Flex>
      <Text
        color={'#0263BB'}
        fontWeight={700}
        flex={1}>
        { (props.value ?? 0).toFixed(2) }% { props.keyword ?? 'OKRs' }
      </Text>
    </Flex>
  );
}
