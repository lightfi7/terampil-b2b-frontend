import { Flex, Text } from "@chakra-ui/react";
import { EmployeeKeyResultData, EmployeeKeyResultStatus } from "data-design/src/entity/EmployeeKeyResultData.entity";
import { KeyResult } from "data-design/src/entity/KeyResult.entity";
import _ from "lodash";
import moment from "moment";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { AButton } from "../button/AButton";
import { ProgressValue } from "../progress-value/ProgressValue";
import { ThreeDotsImage } from "../three-dots-image/ThreeDotsImage";
import { KRProgressMonthlyDetail } from "./KRProgressMonthlyDetail";
import { KRSkillGap } from "./KRSkillGap";

interface OKRKeyResultProgressMonthlyProps {
  date: Date
  okr: KeyResult
  onApproveReject?(p: EmployeeKeyResultData, approve: boolean): void
}

export function OKRKeyResultProgressMonthly(props: OKRKeyResultProgressMonthlyProps) {
  const [is_open, setIsOpen] = useState<boolean>(false);
  const [month_start, month_end] = [moment(props.date).startOf('month'), moment(props.date).endOf('month')];
  const list_pencapaian: EmployeeKeyResultData[] = _.filter(props.okr?.list_key_result_data ?? [], x => moment(x.created_at).isBetween(month_start, month_end));
  const total_pencapaian = list_pencapaian.filter(a => a.status === EmployeeKeyResultStatus.APPROVE).reduce((acc: number, curr: EmployeeKeyResultData) => acc + curr.value, 0);
  const persen_pencapaian = props.okr?.target_per_periode == 0 ? 0 : (100 * total_pencapaian / (props.okr?.target_per_periode ?? 0)).toFixed(0);

  return (
    <Flex 
      w={'100%'}
      direction={'column'}
      gap={'12px'}>

      {/* DATA */}
      <Flex 
        w={'100%'}
        border={'solid 1px #FFF'}
        borderColor={'brand'}
        borderRadius={4}
        bg={'#FFF'}
        pt={'7px'}
        pb={'7px'}
        align={'center'}
        position={'relative'}>
        <Flex 
          p={'8px 18px'}
          flex={1}>
          <Text
            fontSize={'.8em'}>
            { moment(props.date).format('MMMM YYYY') }
          </Text>
        </Flex>
        <Flex 
          p={'8px 12px'}
          flex={1}>
          <Text
            fontSize={'.8em'}>
            { list_pencapaian.length } Update
          </Text>
        </Flex>
        <Flex 
          p={'8px 12px'}
          flex={1}>
          <Text
            fontSize={'.8em'}>
            { props.okr?.target_per_periode } { props.okr?.unit }
          </Text>
        </Flex>
        <Flex 
          p={'8px 12px'}
          flex={1}>
          <Text
            fontSize={'.8em'}>
            { total_pencapaian } { props.okr?.unit }
          </Text>
        </Flex>
        <Flex 
          p={'8px 12px'}
          flex={1}
          direction={'column'}>
          <Flex
            direction={'column'}
            w={'80%'}>
            <Flex
              justify={'space-between'}>
              <Text
                fontSize={'.75em'}>
                { persen_pencapaian }%
              </Text>
              <Text
                fontSize={'.75em'}>
                Needs Work
              </Text>
            </Flex>
            <ProgressValue progress={+persen_pencapaian / 100} />
          </Flex>
        </Flex>
        <Flex 
          p={'8px 12px'}
          flex={1}>
          <Text
            fontSize={'.8em'}>
            No Update
          </Text>
        </Flex>
        <Flex
          position={'absolute'}
          left={0}
          top={'100%'}
          mt={is_open ? '8px' : '-12px'}
          ml={'18px'}>
          <AButton
            bg={'brand'}
            _hover={{
              bg: 'brand'
            }}
            onClick={() => setIsOpen(!is_open)}
            p={0}
            pr={'16px'}
            pl={'16px'}
            h={'24px'}
            fontSize={'.7em'}
            borderRadius={999}
            color={'#C4C4C4'}>
            { is_open ? '-' : '+' } Update Pencapaian
          </AButton>
        </Flex>
      </Flex>

      {/* SKILL GAP */}
      <AnimateHeight
        duration={is_open ? 300 : 30}
        height={is_open ? 'auto' : 0}>
        <Flex 
          pl={'3%'}
          mt={is_open ? '26px' : 0}
          direction={'column'}
          gap={'12px'}>
          <KRProgressMonthlyDetail
            onApproveReject={props.onApproveReject}
            okr={props.okr}
            date={props.date}
            data={list_pencapaian} />
        </Flex>
      </AnimateHeight>
    </Flex>
  );
}
