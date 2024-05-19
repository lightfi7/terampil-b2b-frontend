import { Summary } from "@/pages/main/organization/employee/[id]";
import { Flex, Image, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { currencyFormatter } from "data-design/src/util";
import { AButton } from "../button/AButton";
import { CompetencyProficiencyBadge } from "../competency-proficiency-badge/CompetencyProficiencyBadge";
import { ContainerGradient } from "../container-gradient/ContainerGradient";
import MonthPicker from "../date-picker/MonthPicker";
import { OrganizationNode } from "data-design/src/entity/OrganizationNode.entity";

interface OrganizationBadgeProps {
  data?: OrganizationNode
  head?: Employee
  onBadgeClick?(): void
}

export function OrganizationBadge(props: OrganizationBadgeProps) {
  return (
    <ContainerGradient 
      p={'20px'}
      pl={'48px'}
      pb={'20px'}
      gap={'3%'}
      align={'center'}>
      <Flex 
        direction={'column'}
        align={'center'}
        gap={'12px'}>
        <Image
          bg={'#EEE'}
          w={'150px'}
          h={'150px'}
          src={props.head?.photo}
          borderRadius={9999}
          border={'solid 2px #FFF'}
          borderColor={'brand'}
          objectFit={'cover'} />
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
            { props.data?.name }
          </Text>
          <Flex 
            direction={'column'}
            gap={'4px'}>
            <Text 
              fontSize={'.8em'}>
              { props.head?.name }
            </Text>
            <Text
              fontSize={'.95em'}
              fontWeight={600}>
              { props.head?.job_profile.name }
            </Text>
          </Flex>
          {/* { !props.simple && <Flex 
            w={'200px'}>
            <MonthPicker 
              setValue={() => {}} />
          </Flex> } */}
        </Flex>
        <Flex 
          flex={1}
          direction={'column'}
          align={'flex-end'}
          gap={'24px'}>
          <CompetencyProficiencyBadge
            summaryBadge={{
              okr: {
                percentage: 10,
                total: 2,
                total_diatas_80_persen: 2,
                total_61_sampai_79_persen: 3,
                total_dibawah_60_persen: 4
              },
              development_progress: {
                percentage: 23,
                total: 12,
                total_diatas_80_persen: 21,
                total_61_sampai_79_persen: 44,
                total_dibawah_60_persen: 55
              },
              competency: [{
                key: 'Sample',
                value: 12
              }, {
                key: 'Sample 2',
                value: 12
              }],
              budget: 12
            }}
            onClick={props.onBadgeClick} />
        </Flex>
      </Flex>
    </ContainerGradient>
  );
}
