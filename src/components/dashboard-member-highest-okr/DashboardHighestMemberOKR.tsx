import { Flex } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { EmployeeWithOKR } from "../dashboard-sub-page/DashboardPersonal";
import { BigMemberOKRCard } from "./BigMemberOKRCard";
import { SmallMemberOKRCard } from "./SmallMemberOKRCard";

interface DashboardHighestMemberOKRProps {
  data: EmployeeWithOKR[]
}

export function DashboardHighestMemberOKR(props: DashboardHighestMemberOKRProps) {
  return (
    <Flex
      gap={'12px'}>
      <Flex
        flex={5}
        direction={'column'}
        gap={'12px'}>
        {
          props.data.slice(0, 3).map((e: EmployeeWithOKR, i: number) => (
            <BigMemberOKRCard
              key={e.employee.id}
              i={['1st', '2nd', '3rd'][i] ?? ''} 
              employee={e.employee}
              value={e.okr} />
          ))
        }
      </Flex>
      <Flex 
        flex={6}
        direction={'column'}
        gap={'12px'}>
        {
          props.data.slice(3).map((e: EmployeeWithOKR, i: number) => (
            <SmallMemberOKRCard
              i={i + 4}
              key={e.employee.id}
              employee={e.employee}
              value={e.okr} />
          ))
        }
      </Flex>
    </Flex>
  );
}
