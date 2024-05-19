import { Flex } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { EmployeeWithDP, EmployeeWithOKR } from "../dashboard-sub-page/DashboardPersonal";
import { BigMemberOKRCard } from "./BigMemberOKRCard";
import { SmallMemberOKRCard } from "./SmallMemberOKRCard";

interface DashboardHighestMemberDPProps {
  data: EmployeeWithDP[]
}

export function DashboardHighestMemberDP(props: DashboardHighestMemberDPProps) {
  return (
    <Flex
      gap={'12px'}>
      <Flex
        flex={5}
        direction={'column'}
        gap={'12px'}>
        {
          props.data.slice(0, 3).map((e: EmployeeWithDP, i: number) => (
            <BigMemberOKRCard
              key={e.employee.id}
              i={['1st', '2nd', '3rd'][i] ?? ''} 
              employee={e.employee}
              value={e.dp}
              keyword={'DP'} />
          ))
        }
      </Flex>
      <Flex 
        flex={6}
        direction={'column'}
        gap={'12px'}>
        {
          props.data.slice(3).map((e: EmployeeWithDP, i: number) => (
            <SmallMemberOKRCard
              i={i + 4}
              key={e.employee.id}
              employee={e.employee}
              value={e.dp}
              keyword={'DP'} />
          ))
        }
      </Flex>
    </Flex>
  );
}
