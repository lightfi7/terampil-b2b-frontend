import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { EmployeeKeyResultData, EmployeeKeyResultStatus } from "data-design/src/entity/EmployeeKeyResultData.entity";
import { KeyResult } from "data-design/src/entity/KeyResult.entity";
import moment from "moment";
import { AButton } from "../button/AButton";

interface KRProgressMonthlyDetailProps {
  okr: KeyResult
  date: Date
  data: EmployeeKeyResultData[]
  onApproveReject?(p: EmployeeKeyResultData, approve: boolean): void
}

export function KRProgressMonthlyDetail(props: KRProgressMonthlyDetailProps) {
  return (
    <Flex
      boxShadow={'0px 1px 14px rgba(0, 0, 0, .1)'}
      borderRadius={4}
      w={'100%'}
      bg={'#FFF'}
      direction={'column'}
      fontSize={'.8em'}>
      <Flex
        p={'12px 16px'}
        direction={'column'}>
        <Text 
          fontWeight={600}
          color={'#373737'}>
          Detail Update Pencapain pada bulan { moment(props.date).format('MMMM YYYY') }
        </Text>
      </Flex>
      <Flex 
        color={'#999999'}
        mb={'4px'}>
        <Text 
          flex={3}
          pl={'16px'}>
          Tanggal Upload
        </Text>
        <Text 
          flex={1}>
          Pencapaian
        </Text>
        <Text 
          flex={1}>
          Evidence
        </Text>
        <Text 
          flex={1}>
          Status
        </Text>
      </Flex>
      {
        props.data.sort((a: EmployeeKeyResultData, b: EmployeeKeyResultData) => moment(a.created_at).unix() - moment(b.created_at).unix()).map((pencapaian: EmployeeKeyResultData) => (
          <Flex 
            key={pencapaian.id}
            direction={'column'}>
            <Box 
              w={'100%'}
              h={'1px'}
              bg={'#E5E5E5'} />
            <Flex 
              color={'#202020'}
              pt={'10px'}
              pb={'10px'}
              align={'center'}>
              <Text 
                flex={3}
                pl={'16px'}>
                { moment(pencapaian.created_at).format('DD MMMM YYYY') }
              </Text>
              <Text 
                flex={1}>
                { pencapaian.value } { props.okr.unit }
              </Text>
              <Text 
                flex={1}>
                <Link 
                  color={'blue'}
                  href={ pencapaian.evidence }>
                  Evidence
                </Link>
              </Text>
              <Text 
                flex={1}>
                { pencapaian.status === EmployeeKeyResultStatus.PENDING && <Flex
                  gap={'12px'}>
                  <AButton 
                    p={'8px'}
                    h={'20px'}
                    borderColor={'red'}
                    color={'red'}
                    borderRadius={999}
                    variant={'outline'}
                    onClick={() => props.onApproveReject && props.onApproveReject(pencapaian, false)}>
                    Reject
                  </AButton>
                  <AButton
                    p={'8px'}
                    h={'20px'}
                    borderRadius={999}
                    onClick={() => props.onApproveReject && props.onApproveReject(pencapaian, true)}>
                    Approve
                  </AButton>
                </Flex> }
                { pencapaian.status !== EmployeeKeyResultStatus.PENDING && pencapaian.status }
              </Text>
            </Flex>
          </Flex>
        ))
      }
    </Flex>
  );
}
