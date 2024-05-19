import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { ProgressValue } from "../progress-value/ProgressValue";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { ExSumData } from "@/pages/main/executive-summary";
import { currencyFormatter } from "../input-number";

interface MainExsumListItemProps {
  data: ExSumData.ExecutiveSummarySummaryItem
  index: number
}

export function IconDown() {
  return (
    <Image 
      w={'.85em'}
      h={'.85em'}
      transition={'250ms'}
      objectFit={'contain'}
      src={'/icons/icon-down.png'} />
  );
}

export function IconUp() {
  return (
    <Image 
      w={'.85em'}
      h={'.85em'}
      transition={'250ms'}
      objectFit={'contain'}
      src={'/icons/icon-up.png'} />
  );
}

export function MainExsumListItem(props: MainExsumListItemProps) {
  const [show, setShow] = useState<boolean>(false);
  const total_roti = props.data.employees.length === 0 
    ? 0 
    : props.data.employees.reduce((acc: number, item: ExSumData.ExecutiveSummarySummaryItemEmployee) => acc + item.roti, 0) / props.data.employees.length;
 
  function getLabel(roti: number) {
    if (roti < .5) {
      return 'Unaccaptable';
    }
    if (roti < .7) {
      return 'Need Improvement';
    }
    if (roti < .85) {
      return 'Meet Expectation';
    }
    return 'Exceed Expectation';
  }

  function getGradient(roti: number) {
    if (roti < .5) {
      return 'linear-gradient(90deg, #C41D1D 7.14%, #CE832C 100%);'
    }
    if (roti < .7) {
      return 'linear-gradient(90deg, #C49F1D 7.14%, #CE832C 100%);';
    }
    return 'linear-gradient(90deg, #015DBA 0%, #2BCDC9 71.5%);';
  }

  return (
    <Flex
      flex={1}
      direction={'column'}
      gap={'8px'}>

      {/* ------------- */}
      {/* Summary Start */}
      {/* ------------- */}
      <Flex 
        cursor={'pointer'}
        onClick={() => setShow(!show)}
        align={'center'}
        gap={'18px'}
        borderTopRightRadius={8}
        p={'12px 18px'}
        color={'#FFF'}
        fontSize={'1.2em'}
        bgGradient={'linear-gradient(90deg, #016ABA 0.96%, #32DFCB 117.32%);'}
        fontWeight={700}>
        <Flex 
          flex={1}>
          <Text
            fontSize={'1.3em'}>
            { props.index + 1 }. { props.data.organization_node.name }
          </Text>
        </Flex>
        <Flex
          align={'center'}
          gap={'12px'}>
          <Text>
            Dev
          </Text>
          <Flex
            w={'90px'}>
            <ProgressValue 
              progress={(props.data.development_plan ?? 0) / 100}
              bg={'#FFF'} />
          </Flex>
          <Text>
            { (props.data.development_plan ?? 0).toFixed(2) }%
          </Text>
        </Flex>
        <Box h={'90%'} w={'1px'} bg={'#FFF'} />
        <Flex
          align={'center'}
          gap={'12px'}>
          <Text>
            Competency<br/>Proficiency
          </Text>
          <Flex
            w={'90px'}>
            <ProgressValue 
              progress={(props.data.competency ?? 0) / 100}
              bg={'#FFF'} />
          </Flex>
          <Text>
            { (props.data.competency ?? 0).toFixed(2) }%
          </Text>
        </Flex>
        <Box h={'90%'} w={'1px'} bg={'#FFF'} />
        <Flex
          align={'center'}
          gap={'12px'}>
          <Text>
            OKR
          </Text>
          <Flex
            w={'90px'}>
            <ProgressValue 
              progress={(props.data.okr ?? 0) / 100}
              bg={'#FFF'} />
          </Flex>
          <Text>
            { (props.data.okr ?? 0).toFixed(2) }%
          </Text>
        </Flex>
        <Box h={'90%'} w={'1px'} bg={'#FFF'} />
        <Flex
          align={'center'}
          gap={'12px'}>
          <Text>
            ROTI
          </Text>
          <Flex
            w={'90px'}>
            <ProgressValue 
              progress={total_roti}
              bg={'#FFF'} />
          </Flex>
          <Text>
            { (total_roti * 100).toFixed(2) }%
          </Text>
        </Flex>
      </Flex>
      {/* ------------- */}
      {/* Summary Start */}
      {/* ------------- */}


      {/* --------------- */}
      {/* Main Item Start */}
      {/* --------------- */}
      <AnimateHeight
        duration={show ? 300 : 30}
        height={show ? 'auto' : 0}>
        <Flex
          direction={'column'}
          gap={'8px'}
          pl={'5%'}>

          {/* ------------ */}
          {/* Header Start */}
          {/* ------------ */}
          <Flex
            align={'center'}
            bg={'#E5E5E5'}
            fontSize={'.95em'}>
            <Flex flex={.3} direction={'column'} p={'7px'}>
              <Text>
                No
              </Text>
            </Flex>
            <Flex flex={1} direction={'column'} p={'7px'}>
              <Text>
                Name
              </Text>
            </Flex>
            <Flex flex={1} direction={'column'} p={'7px'}>
              <Text>
                Job Position
              </Text>
            </Flex>
            <Flex flex={1} direction={'column'} p={'7px'}>
              <Text>
                Development Completion Rate YTD
              </Text>
            </Flex>
            <Flex flex={1} direction={'column'} p={'7px'}>
              <Text>
                Total Development Cost
              </Text>
            </Flex>
            <Flex flex={1} direction={'column'} p={'7px'} align={'center'}>
              <Text
                fontWeight={700}>
                L1 - REACTION
              </Text>
              <Text>
                Training Rating
              </Text>
            </Flex>
            <Flex flex={1} direction={'column'} p={'7px'} align={'center'}>
              <Text
                fontWeight={700}>
                L2 - LEARNING
              </Text>
              <Text>
                Post-Test
              </Text>
            </Flex>
            <Flex flex={1.5} direction={'column'} p={'7px'} align={'center'}>
              <Text
                fontWeight={700}>
                L3 - BEHAVIOR
              </Text>
              <Text>
                Competency Assessment
              </Text>
            </Flex>
            <Flex flex={1} direction={'column'} p={'7px'} align={'center'}>
              <Text
                fontWeight={700}>
                L4 - RESULT
              </Text>
              <Text>
                OKR's Achievement
              </Text>
            </Flex>
            <Flex flex={.5} direction={'column'} p={'7px'}>
              <Text>
                ROTI
              </Text>
            </Flex>
            <Flex flex={1} direction={'column'} p={'7px'}>
              <Text>
                Result Status
              </Text>
            </Flex>
          </Flex>
          {/* ---------- */}
          {/* Header End */}
          {/* ---------- */}


          {/* --------- */}
          {/* Row Start */}
          {/* --------- */}
          {
            props.data.employees.map((row: ExSumData.ExecutiveSummarySummaryItemEmployee, i: number) => (
              <Flex 
                key={i}
                border={'1px solid rgba(0, 92, 185, 0.5)'}
                borderRadius={8}
                align={'center'}
                py={'8px'}>
                <Flex flex={.3} direction={'column'} p={'7px'}>
                  <Text>
                    { i + 1 }
                  </Text>
                </Flex>
                <Flex flex={1} direction={'column'} p={'7px'}>
                  <Text>
                    { row.name }
                  </Text>
                </Flex>
                <Flex flex={1} direction={'column'} p={'7px'}>
                  <Text>
                    { row.job_profile_title }
                  </Text>
                </Flex>
                <Flex flex={1} direction={'column'} p={'7px'}>
                  <Text>
                    { (row.complete_rate * 100).toFixed(2) }%
                  </Text>
                </Flex>
                <Flex flex={1} direction={'row'} p={'7px'} align={'center'} gap={'3px'}>
                  <Text>
                    { currencyFormatter.format(row.development_cost) }
                  </Text>
                </Flex>
                <Flex flex={1} direction={'row'} p={'7px'} align={'center'} gap={'3px'}>
                  <Text>
                    { (row.l1 * 100).toFixed(2) }%
                  </Text>
                  { row.l1 == row.l1_old ? '' : (row.l1 > row.l1_old ? <IconUp /> : <IconDown />) }
                </Flex>
                <Flex flex={1} direction={'row'} p={'7px'} align={'center'} gap={'3px'}>
                  <Text>
                    { (row.l2 * 100).toFixed(2) }%
                  </Text>
                  { row.l2 == row.l2_old ? '' : (row.l2 > row.l2_old ? <IconUp /> : <IconDown />) }
                </Flex>
                <Flex flex={1.5} direction={'row'} p={'7px'} align={'center'} gap={'3px'}>
                  <Text>
                    { (row.l3 * 100).toFixed(2) }%
                  </Text>
                  { row.l3 == row.l3_old ? '' : (row.l3 > row.l3_old ? <IconUp /> : <IconDown />) }
                </Flex>
                <Flex flex={1} direction={'row'} p={'7px'} align={'center'} gap={'3px'}>
                  <Text>
                    { (row.l4 * 100).toFixed(2) }%
                  </Text>
                  { row.l4 == row.l4_old ? '' : (row.l4 > row.l4_old ? <IconUp /> : <IconDown />) }
                </Flex>
                <Flex flex={.5} direction={'row'} p={'7px'} align={'center'} gap={'3px'}>
                  <Text>
                    { (row.roti * 100).toFixed(2) }%
                  </Text>
                  { row.roti == row.roti_old ? '' : (row.roti > row.roti_old ? <IconUp /> : <IconDown />) }
                </Flex>
                <Flex flex={1} direction={'column'} p={'7px'}>
                  <Text>
                    { getLabel(row.roti) }
                  </Text>
                  <ProgressValue
                    bgGradient={getGradient(row.roti)}
                    progress={row.roti} />
                </Flex>
              </Flex>
            ))
          }
          {/* ------- */}
          {/* Row End */}
          {/* ------- */}
        </Flex>
        {/* ------------- */}
        {/* Main Item End */}
        {/* ------------- */}
      </AnimateHeight>

    </Flex>
  );
}
