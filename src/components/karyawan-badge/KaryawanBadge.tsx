import { Summary } from "@/pages/main/organization/employee/[id]";
import { Flex, Image, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { currencyFormatter } from "data-design/src/util";
import { AButton } from "../button/AButton";
import { CompetencyProficiencyBadge } from "../competency-proficiency-badge/CompetencyProficiencyBadge";
import { ContainerGradient } from "../container-gradient/ContainerGradient";
import MonthPicker from "../date-picker/MonthPicker";

interface KaryawanBadgeProps {
  data?: Employee
  simple?: boolean
  summaryBadge: Summary | undefined
  onBadgeClick?(): void
}

export function KaryawanBadge(props: KaryawanBadgeProps) {
  return (
    <ContainerGradient 
      mt={'48px'}
      p={'20px'}
      pl={'48px'}
      pb={'20px'}
      gap={'3%'}
      align={props.simple ? 'center' : ''}>
      <Flex 
        direction={'column'}
        align={'center'}
        mt={props.simple ? 0 : '-56px'}
        gap={'12px'}>
        <Image
          bg={'#EEE'}
          w={'150px'}
          h={'150px'}
          src={props.data?.photo}
          borderRadius={9999}
          border={'solid 2px #FFF'}
          borderColor={'brand'}
          objectFit={'cover'} />
        { !props.simple && <AButton 
          variant={'outline'}
          color={'#FFF'}
          padding={'3px 12px'}
          fontSize={'.85em'}
          borderColor={'#FFF'}
          onClick={() => window.location.href = `/main/organization/employee/add?edit_id=${props.data?.id}`}>
          Ubah Profil
        </AButton> }
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
              Penempatan
            </Text>
            <Text
              fontSize={'.95em'}
              fontWeight={600}>
              { props.data?.job_profile?.organization_node?.name }
            </Text>
          </Flex>
          <Flex 
            direction={'column'}
            gap={'4px'}>
            <Text
              fontSize={'.8em'}>
              Job Profile
            </Text>
            <Text
              fontSize={'.95em'}
              fontWeight={600}>
              { props.data?.job_profile.name }
            </Text>
          </Flex>
          <Flex 
            direction={'column'}
            gap={'4px'}>
            <Text
              fontSize={'.8em'}>
              Penggunaan Budget Development
            </Text>
            <Text
              fontSize={'.95em'}
              fontWeight={600}>
              { currencyFormatter.format(props.summaryBadge?.budget ?? 0) } / { currencyFormatter.format(props.data?.personal_training_budget ?? 0) } ({
                (100 * (props.summaryBadge?.budget ?? 0) / (props.data?.personal_training_budget ?? 1)).toFixed(2)
              }%)
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
            summaryBadge={props.summaryBadge}
            onClick={props.onBadgeClick}
            simple={props.simple} />
        </Flex>
      </Flex>
    </ContainerGradient>
  );
}
